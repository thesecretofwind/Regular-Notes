## local本地验证

本地验证默认使用用户名和密码来进行验证。

### 配置策略

在做验证之前，首先需要对策略进行配置，官方的示例如下：

```javascript
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: '用户名不存在.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: '密码不匹配.' });
      }
      return done(null, user);
    });
  }
));
```

其中的`User.findOne()`是MongoDB风格的语法，意思是从数据库的User集合中查询一条数据，第一个参数是查询条件，后面是callback，一般在callback中进行后续操作。

这里的逻辑很简单，依次检查`username`、`password`，如果出错则返回错误信息，如果通过则返回`done(null,user)`。

### usernameField

前面说过passport默认使用用户名和密码来验证，但实际上也有很多需要用邮箱来验证的，那么如何实现呢？

passport在策略配置里提供了options参数，用来设置你要验证的字段名称，即usernameField，使用方法如下：

```javascript
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'passwd'
  },
  function(username, password, done) {
    // ...
  }
));
```

注意，这里的字段名称应该是页面表单提交的名称，即req.body.xxx，而不是user数据库中的字段名称。

将options作为LocalStrategy第一个参数传入即可。

### 验证回调

passport本身不处理验证，验证方法在策略配置的回调函数里由用户自行设置，它又称为验证回调。验证回调需要返回验证结果，这是由done()来完成的。

在passport.use()里面，done()有三种用法：

- 当发生系统级异常时，返回done(err)，这里是数据库查询出错，一般用next(err)，但这里用done(err)，两者的效果相同，都是返回error信息；
- 当验证不通过时，返回done(null, false, message)，这里的message是可选的，可通过express-flash调用；
- 当验证通过时，返回done(null, user)。

### 密码验证

在张丹的教程里密码是明文存储的，在实际中这当然不行，上面的代码里是user.validPassword(password)方法，这并不是passport添加的，而是需要用户自定义。

一般对密码进行哈希和盐化的Nodejs模块是bcrypt，它提供一个compare方法来验证密码，如何使用它则超出本文的范围，这里就不讲了。

###  session序列化与反序列化

验证用户提交的凭证是否正确，是与session中储存的对象进行对比，所以涉及到从session中存取数据，需要做session对象序列化与反序列化。调用代码如下：

```javascript
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
```

这里第一段代码是将环境中的user.id序列化到session中，即sessionID，同时它将作为凭证存储在用户cookie中。

第二段代码是从session反序列化，参数为用户提交的sessionID，若存在则从数据库中查询user并存储与req.user中。

这段代码的顺序可以放在passport.use()的前面或后面，但需要在app.configure()之前。

### Authenticate验证

做完了上面这些设置，我们终于可以开始做验证了。

```javascript
app.post('/login',
  passport.authenticate('local',
    { successRedirect: '/',
     failureRedirect: '/login',
     failureFlash: true }),
  function(req, res) {
    // 验证成功则调用此回调函数
    res.redirect('/users/' + req.user.username);
  });
```

这里的passport.authenticate(‘local’)就是中间件，若通过就进入后面的回调函数，并且给res加上res.user，若不通过则默认返回401错误。

authenticate()方法有3个参数，第一是name，即验证策略的名称，第二个是options，包括下列属性：

- session：Boolean。设置是否需要session，默认为true
- successRedirect：String。设置当验证成功时的跳转链接
- failureRedirect：String。设置当验证失败时的跳转链接
- failureFlash：Boolean or String。设置为Boolean时，express-flash将调用use()里设置的message。设置为String时将直接调用这里的信息。
- successFlash：Boolean or String。使用方法同上。

第三个参数是callback。注意如果使用了callback，那么验证之后建立session和发出响应都应该由这个callback来做，passport中间件之后不应该再有其他中间件或callback。以下是代码：

```javascript
app.get('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.redirect('/login'); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.redirect('/users/' + user.username);
    });
  })(req, res, next);
});
```

### HTTP request操作

注意上面的代码里有个req.logIn()，它不是http模块原生的方法，也不是express中的方法，而是passport加上的，passport扩展了HTTP request，添加了四种方法。

- logIn(user, options, callback)：用login()也可以。作用是为登录用户初始化session。options可设置session为false，即不初始化session，默认为true。
- logOut()：别名为logout()。作用是登出用户，删除该用户session。不带参数。
- isAuthenticated()：不带参数。作用是测试该用户是否存在于session中（即是否已登录）。若存在返回true。事实上这个比登录验证要用的更多，毕竟session通常会保留一段时间，在此期间判断用户是否已登录用这个方法就行了。
- isUnauthenticated()：不带参数。和上面的作用相反。

### 完整示例

基本上passport本地验证的知识点就是这些，下面给出一个相对完整的示例，包括bcrypt的实现，这里借用了nodeclub中的方法，为实现它你需要自己配置hash：

```javascript
var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
//User模型需自己实现
var User = require('../models/User');
var bcrypt = require('bcrypt');

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

//这里的username可以改成前端表单对应的命名，如：
// <form><input type="text" name="hehe">...</form>
//则这里将所有的username改为hehe
passport.use(new LocalStrategy({ usernameField: 'username' }, function(username, password, done) {
  //实现用户名或邮箱登录
  //这里判断提交上的username是否含有@，来决定查询的字段是哪一个
  var criteria = (username.indexOf('@') === -1) ? {username: username} : {email: username};
  User.findOne(criteria, function(err, user) {
    if (!user) return done(null, false, { message: '用户名或邮箱 ' + username + ' 不存在'});
    bcompare(password, hash, function(err, isMatch) {
      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: '密码不匹配' });
      }
    });
  });
}));

...

app.use(cookieParser());
app.use(session({secret: "need change"}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

...

app.post('/login', passport.authenticate('local', function(err, user, info) {
    if (err) return next(err);
    if (!user) {
      req.flash('errors', { msg: info.message });
      return res.redirect('/login');
    }
    req.logIn(user, function(err) {
      if (err) return next(err);
      req.flash('success', { msg: '登录成功！' });
      res.redirect('/');
    });
  })(req, res, next)
);
//这里getUser方法需要自定义
app.get('/user', isAuthenticated, getUser);
app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

//将req.isAuthenticated()封装成中间件
var isAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
};

var bcompare = function (str, hash, callback) {
bcrypt.compare(str, hash, callback);
};
```

passport-local模块也包括一些示例，不过这些示例都是Express 3.x时代写的，所以不要原封不动的copy代码。

基本的local验证就讲到这里，下面还有进阶的验证技巧，比如在RESTful API中使用passport，验证多个条件等。

## OAuth验证

OAuth验证是体现passport强大的地方，如果你看过nodeclub的源码，会发现它自己实现了local验证，但它的Github验证是用passport来实现的。

OAuth标准分为两个版本，1.0版和2.0版，两者被使用的都很广泛，passport通过passport-oauth为两者提供支持，使用下面的命令可以安装。

```javascript
npm install passport-oauth
```

### OAuth验证流程

OAuth1.0和2.0的使用流程都差不多，一般来说如下：

1. 为你的app去第三方服务商处申请标识和令牌appkey和secret；
2. 在你的app里添加按钮或链接，将用户引导至服务商的授权页，用户在这里选择授权给你的app；
3. 授权成功后跳转回你的app，同时还传递回access_token和一些用户资料。

到这里首次验证流程就完成了，之后只要拿access_token去就可以做登录验证或者其他事了。

### OAuth1.0

要使用passport OAuth1.0验证你需要先引入：

```javascript
var passport = require('passport')
  , OAuthStrategy = require('passport-oauth').OAuthStrategy;
```

然后是配置：

```javascript
passport.use('provider', new OAuthStrategy({
    requestTokenURL: 'https://www.provider.com/oauth/request_token',
    accessTokenURL: 'https://www.provider.com/oauth/access_token',
    userAuthorizationURL: 'https://www.provider.com/oauth/authorize',
    consumerKey: '123-456-789',
    consumerSecret: 'shhh-its-a-secret'
    callbackURL: 'https://www.example.com/auth/provider/callback'
  },
  function(token, tokenSecret, profile, done) {
    User.findOrCreate(..., function(err, user) {
      done(err, user);
    });
  }
));
```

这里比通用流程多的一点就是，你的App需要先访问第三方服务，获取request token，这个request token是未授权的，等用户授权之后，可以拿这个request token去换取access token。

在passport中你不必管这些细节，找到第三服务的文档找到对应的URL添上即可。当然你还得申请key和secret。

use方法的回调接受四个参数，token就是access token，和tokenSecret一起好好保存。profile则是用户在第三方服务上的一些公开资料，它的模型在[这里](http://passportjs.org/guide/profile/)，不过返回的资料不一定全面，在使用前需要验证是否存在。

OAuth1.0的路由常见写法如下：

```javascript
app.get('/auth/provider', passport.authenticate('provider'));
app.get('/auth/provider/callback', 
  passport.authenticate('provider', { successRedirect: '/',
                                      failureRedirect: '/login' }));
```

上面就是OAuth1.0的验证流程。

OAuth1.0主要是一些比较早提供第三方登录功能的网站使用，现在的网站大部分使用OAuth2.0了，新浪微博原先使用的是1.0，现在也改用2.0了。

### OAuth2.0

OAuth2.0的验证不需要request_token，但比1.0多了scope和refresh token，我们先来看看具体的配置方法：

```javascript
var passport = require('passport')
  , OAuth2Strategy = require('passport-oauth').OAuth2Strategy;

passport.use('provider', new OAuth2Strategy({
    authorizationURL: 'https://www.provider.com/oauth2/authorize',
    tokenURL: 'https://www.provider.com/oauth2/token',
    clientID: '123-456-789',
    clientSecret: 'shhh-its-a-secret'
    callbackURL: 'https://www.example.com/auth/provider/callback'
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate(..., function(err, user) {
      done(err, user);
    });
  }
));
```

refreshToken是重新获取access token的方法，因为access token是有使用期限的，到期了必须让用户重新授权才行，现在有了refresh token，你可以让应用定期的用它去更新access token，这样第三方服务就可以一直绑定了。不过这个方法并不是每个服务商都提供，注意看服务商的文档。

下面是路由，OAuth2.0也有一点不同：

```javascript
app.get('/auth/provider',
  passport.authenticate('provider', { scope: 'email' })
);
app.get('/auth/provider/callback', 
  passport.authenticate('provider', { successRedirect: '/',
                                      failureRedirect: '/login' }));
```

scope是权限范围，需要在服务商处事先申请，想进一步了解可参考微博的[scope文档](http://open.weibo.com/wiki/Scope)。它可以只有一项，也可以有多项，当为多项时以数组形式表示。

### 使用passport-x插件

passport-oauth包含通用的验证方法，基本山任何提供OAuth的服务都能用上面的方法来验证，但大部分提供第三方登录的网站都有passport的插件，它们的列表见[官网](http://passportjs.org/guide/providers/)和[Github wiki](https://github.com/jaredhanson/passport/wiki/Strategies#providers)。使用它们可以让app绑定第三方服务更加简单和模块化。

passport-x插件的一般用法如下（以Github为例）。

首先安装passport-github，注意这种情况不需要安装passport-oauth：

```javascript
npm install passport-github
```

安装完后是配置：

```javascript
var passport = require('passport')
  , GithubStrategy = require('passport-github').Strategy;

//passport设置部分 
passport.use(new GithubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: "http://www.example.com/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate(..., function(err, user) {
      if (err) { return done(err); }
      done(null, user);
    });
  }
));

...
//路由部分
app.get('/auth/github', passport.authenticate('github'));
app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });
```

与通用OAuth验证流程对比，上面的代码少了服务商的验证页部分，你只需要将获得的appkey和secret填到对应地方即可。

### OAuth验证的逻辑

OAuth验证的麻烦之处主要是处理逻辑，很多网站将第三方的OAuth作为一种用户注册手段，当用户点击第三方登录时，若用户未注册会为他们创建账号，这里面的逻辑就比较绕了。比如Hackathon Starter的处理逻辑如下：

```
/**
 * OAuth验证策略概述
 * 
 * 当用户点击“使用XX登录”链接
 * - 若用户已登录
 *   - 检查该用户是否已绑定XX服务
 *     - 如果已绑定，返回错误（不允许账户合并）
 *     - 否则开始验证流程，为该用户绑定XX服务
 * - 用户未登录
 *   - 检查是否老用户
 *     - 如果是老用户，则登录
 *     - 否则检查OAuth返回profile中的email，是否在用户数据库中存在
 *       - 如果存在，返回错误信息
 *       - 否则创建一个新账号
 */
```

另外还有平常验证用户是否已绑定某个服务，可以封装成中间件：

```javascript
var isAuthorized = function(req, res, next) {

  if (req.user.provider)) {
    next();
  } else {
    //do something else
  }
};
```

学习OAuth验证最好的项目是[Hackathon Starter](https://github.com/sahat/hackathon-starter)，它实现了十几种的第三方网站和服务的OAuth验证，推荐学习。下面进阶学习里面还有如何开发一个passport OAuth验证插件。