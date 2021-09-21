

虽然基本用法已经能覆盖一般需求了，但是还是有各种edge case的存在。passport也提供了一些扩展性的功能来应对不同的场景。下面就来讲一下。

## 验证多个条件

有的时候，在登录时不但需要验证用户名和密码，还需要验证一个附加条件，比如Discuz!论坛程序提供的功能：

[![20141116005335](C:\Users\Administrator\Desktop\markdown笔记\express-session\images\2015-09-14_55f69d4cec5fc.jpg)](http://box.kancloud.cn/2015-09-14_55f69d4cec5fc.jpg)

这种情况passport也是支持的。

在配置策略的时候，Strategy接受一个options参数，它包含一个passReqToCallback项，默认为false，设置为true时可以将整个req传递给回调函数，这样在回调里就可以验证req中带的所有条件了。示例代码如下：

```javascript
passport.use(new LocalStrategy(
  {passReqToCallback: true},
  function(req, username, password, done) {
    // now you can check any req.body.xxx
  }
));
```

这个方法在OAuth验证中也是支持的。

## 使用多种验证策略/匿名登录验证

最常见的case是贴吧，我们支持已登录的用户发帖，但是对匿名用户也支持发帖回帖，但对它们屏蔽了一些高级用法。

这里需要用到匿名验证策略passport-anonymous，它的使用非常简单，只需要声明一句就行了：

```javascript
passport.use(new AnonymousStrategy());
```

要实现多种验证策略，可如下配置：

```javascript
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , AnonymousStrategy = require('passport-anonymous').Strategy;

  ...

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
//匿名登录认证作为本地认证的fallback
passport.use(new AnonymousStrategy());

...

app.get('/',
  passport.authenticate(['local', 'anonymous'], { session: false }),
  function(req, res){
    if (req.user) {
      res.json({ msg: "用户已登录"});
    } else {
      res.json({ msg: "用户以匿名方式登录"});
    }
  });
```

我们可以看到使用多种验证策略时，可使用数组来将策略名称作为参数传给authenticate方法。

匿名验证是作为local验证的fallback而存在，当local验证不满足时会调用后面的验证方法。

理论上讲这种调用方法也可用于其它验证，但不鼓励这么做，它会让用户系统变得极为复杂难以维护。、

最后注意：使用匿名验证时需要将session设为false，不将匿名用户信息存储到session中。

### 游客登录验证

还有一种使用场景是将所有的匿名用户都视为游客，这样你可以通过用户管理页面来操作所有的游客的信息。

你可以通过passport-anonymous来实现这一点，将所有的匿名用户都赋予同一个用户ID，但还有一个passport插件来专门做这件事，那就是[passport-dummy](https://github.com/developmentseed/passport-dummy)，它的使用方法如下：

```javascript
var passport = require('passport')
  , DummyStrategy = require('passport-dummy').Strategy;

// 设置部分
passport.use(new DummyStrategy(
  function(done) {
    return done(null, {username: 'dummy'});
  }
));

// 路由部分
app.post('/login', 
  passport.authenticate('dummy', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });
```

实际使用中经常需要与其他验证方法结合起来，比如在上面的多种验证策略中代替匿名登录验证。

## 在其他Web框架中使用passport

这里要明白，passport只是做登录验证的，只是操作session，甚至连验证都是用户自己完成，它本身是个很独立的模块，但是由于其使用了connect中的一些方法，因此与connect有些耦合。

因此一般的connect-style 的web框架passport都能直接使用，无需适配。

那么要在其它web框架中如Hapi中能使用passport吗？

回答是理论上能，但不建议直接这么做。一般这样的框架也应该都有自己的验证模块或插件，如果实在不能满足需求，非要用passport，这里提供一下思路：首先要支持session，然后构造类似express中的req和res，起码要支持res.session各种操作，以及将http request赋值为req。

这里有[Hapi框架使用passport的教程](http://emptymind.me/user-authentication-with-hapi-passport-and-mongoose/)，可以看到非常麻烦， 它本身已经有hapi-auth-cookie和bell模块用于验证，所以不必执着于使用passport。

## 在RESTful API中使用passport

RESTful API的验证分为两种情况。一种是面向自己app的用户，其验证和http验证一样。另一种是向第三方提供的API，这种情况下可能每次连接都需要验证，反而不需要用到session了。passport也支持这样的做法。

想要每次连接都进行验证，只需将authenticate方法作为中间件添加到需要验证的URL里，然后将session设为false：

```javascript
app.get('/api/users/me',
  passport.authenticate('basic', { session: false }),
  function(req, res) {
    res.json({ id: req.user.id, username: req.user.username });
  });
```

这样每次连接都需要经过authenticate，并且不会被记录在session里。

## 制作passport插件

passport以插件的形式支持了很多第三方网站和服务的OAuth验证，但并不是所有的，如果你需要在app中用到第三方的服务，但它们没有对应的passport插件，你可以用通用的OAuth或其他验证方法来进行验证，也可以将它们封装成passport-x插件。

制作passport插件并不困难，因为它只是对策略的配置部分进行了一些封装而已，你可以将一个已有的passport插件稍微修改即可。

比如要制作一个OAuth2.0的passport插件，你可以以passport-github为模板，甚至只需要修改它的[strategy.js](https://github.com/jaredhanson/passport-github/blob/master/lib/strategy.js)，步骤总结如下：

1. 将所有带github.com的地址修改为对应的地址；
2. 将github、passport-github修改为你需要的服务的名称。

没错，就是这么简单！

如果仅仅为自己使用，上面的步骤已经足够，但你还可以将它们分享出来给别人使用，这需要额外的步骤：

1. 修改example/login，以及readme.md，并测试；
2. 将你的插件发布到Github和npm上；
3. 给passport作者[Jared Hanson](https://github.com/jaredhanson)发邮件，或者到[passport的Github页面](https://github.com/jaredhanson/passport)上发issue，将插件添加到provider list上。

现在你也是passport的贡献者了！~

## 更多的验证方案

上面我们只是讲到了local验证和OAuth验证，以及提到了一下anonymous验证，但实际上passport支持的验证方法不止这几种，具体支持的验证方案可以参见[这个页面](http://passportjs.org/guide/other-api/)。

在多数时候，我们只需要引入这些实现方案，就可以进行验证。

这里的验证方案在我们想向第三方app提供RESTful API时非常有用。

## 推荐项目

一些学习passport具体实现的Nodejs项目。

- [Hackathon Starter](https://github.com/sahat/hackathon-starter)：实现了超过10个第三方服务OAuth登录验证。
- [nodeclub](https://github.com/cnodejs/nodeclub/)：实现Github OAuth验证。

## 参考链接

- [passport官方文档](http://passportjs.org/guide/)：本文的覆盖面已超过官方文档。
- [Express结合Passport实现登陆认证](http://blog.fens.me/nodejs-express-passport/) ：张丹博客，基本用法，有完整示例
- [Passport实现社交网络OAuth登陆](http://blog.fens.me/nodejs-oauth-passport/)：张丹博客，基本用法，有Github和LinkedIn示例
- [用NodeJS完成简单的身份验证](http://www.zhanxin.info/nodejs/2013-10-16-simple-authentication-in-nodejs.html)：一篇译文，包括local验证和Github示例
- [NodeCoffee实录 – 登录认证](http://www.ituring.com.cn/article/56279)：用CoffeeScript写passport示例
- [OAuth 2和passport框架](http://www.moye.me/2014/10/01/oauth-2-0和passport/)：讲OAuth2.0原理和passport基本示例