## XSS和CSRF简述即预防措施

### XSS

XSS（Cross Site Script）跨站脚本攻击，原本缩写为css，但是为了和层叠样式表（Cascading Style Sheet，css）区别，就取名XSS。

跨站脚本攻是指攻击者在网站上注入恶意的客户端代码，通过恶意脚本对客户端网页进行篡改，从而在用户浏览网页时，对用户浏览器进行控制或者获取用户隐私数据的一种攻击方式（在用户浏览的网页中添加恶意代码，从而达到控制或者获取用户隐私数据的一种攻击方式）

#### 分类：

##### 1. 反射型跨站脚本攻击

反射型XSS之间简单把用户输入的数据“反射”给浏览器，这种攻击方式往往需要攻击者狗屎用户点击一个恶意链接，或者提交一个表单，或者进入一个恶意网站时，注入脚本进入被攻击者的网站（一般来说，点击了恶意链接，跳转至攻击者布置的恶意网站，然后执行相应的恶意代码）

##### 2.存储型跨站脚本攻击

存储型XSS会把用户输入的数据“存储”在服务端，当浏览器请求数据时，脚本从服务器上响应数据并执行。如：攻击者在社区或者论坛上写下一篇包含恶意js代码的文章或者评论，文章或评论发表后，所有访问该文章或者评论的用户，都会在他们浏览器中执行这段恶意的js代码

##### 3.基于DOM型跨站脚本攻击

基于DOM的XSS是指通过恶意脚本修改页面的DOM结构，是纯粹发生在客户端的攻击

#### XSS攻击（跨站脚本攻击）的防范：

1. 使用HttpOnly防止窃取Cookie

因为攻击者可以通过注入恶意脚本获取用户的 Cookie 信息。通常 Cookie 中都包含了用户的登录凭证信息，攻击者在获取到 Cookie 之后，则可以发起 Cookie 劫持攻击。所以，严格来说，HttpOnly 并非阻止 XSS 攻击，而是能阻止 XSS 攻击后的 Cookie 劫持攻击。

2. 输入检查

一般是检查用户输入的数据是否包含<,>等特殊字符，如果存在着对这些特殊字符进行过滤和着重新编码（这种方式也叫 XSS Filter）

3. 输出检查

除富文本的输出外，在变量输出到 HTML 页面时，可以使用编码或转义的方式来防御 XSS 攻击。如：在浏览器使用如sanitize-html对输出内容进行有规则的过滤之后再输出到页面

### CSRF

CSRF（Cross Site Request Forgery）跨站请求伪造，是一种劫持受信任用户向服务器发送非预期请求的攻击方式

通常情况下，跨站请求伪造攻击时借助受害者的Cookie（或者说是用户信息）骗取服务器的信任，可以再受害者不知情的情况下以受害者的名义伪造请求发送请求

#### 浏览器cookie策略

浏览器所持有的cookie一般分为两种

1. session Cookie（会话期Cookie）：会话期cookie是最简单的cookie，它不需要指定过期时间（Expires）或者有效期（Max-age），它尽在会话期内有效，浏览器关闭后它会自动删除
2. Permanent Cookie（持久性cookie）：与会话期cookie不同，持久性cookie可以指定一个特定的过期时间（Expires）或者有效时间（Max-Age）

```javascript
//设置了两个cookie，myCookie和test，前者为会话期cookie，后者是有有效期的cookie
res.setHeader('Set-Cookie',['myCookie=222','test=333; expires=Sat, 21 Jul 2018 00:00:00 GMT;'])
```



注意：每个cookie都会有关联的域，这个域的范围一般通过domain属性指定。如果cookie的域和页面的域相同，那么我们称这个cookie为第一方cookie，如果cookie的域和页面的域不相同，则称之为第三方cookie。一个页面包含图片或存放在其他域上的资源如土拍你时，第一方的cookie也只会发送给设置它们（设置cookie）的服务器

##### 详讲cookie的路径和域

###### 1. cookie的路径(path)

cookie有一个属性是路径path，而这个路径是在服务器创建cookie时设置的（使用Set-Cookie设置），它（cookie的路径）是相对域域domain，如果不设置的话，默认path为"/"，即当前路径），path的作用是决定浏览器访问服务器某个资源时，需要讲浏览器端保存的那些cookie归还（发送）给服务器

![关于cookie路径的图片](C:\Users\Administrator\Desktop\markdown笔记\CDN\images\3.png)

由上图可知，浏览器端保存了Cookie1（对应路径是/Example/cookie），Cookie2（对应路径是/Example/），Cookie3（对应路径是/Example/cookie）

当浏览器的访问服务器端的路径为：``http://localhost:8080/Example/cookie/a/index.jsp`

也就是说index.jsp的访问路径是/Example/cookie/a/(注意,不仅是因为这个最后的文件名为index.js这个默认的文件,然则所有的目录下的cookie的path都是文件的上级路径,不包含本文件),这个就是cookie的路径为/Example/cookie/a/,这个路径包含了/Example/,和/Example/cookie/两个父路径(可以想象成子路径下的路径,会如果子路径有对应的cogeiokie,则会把本路径下的cookie+所有父路径下的cookie发给服务器(注意:请求报文的cookie可以是一个数组))

###### 避免混淆的举例

假如浏览器端保存如下几个cookie,它们的路径分别是:

aCookie.path=/Example20/; bCookie.path=/Example20/jsps/;

cCookie.path=/Example20/jsps/cookie;

1. 访问路径:http://localhost:8080/Example20/index.jsp

浏览器发送给服务器的cookie有:aCookie

2. 访问路径是:http://localhost:8080/Example20/jsps/a.jsp

浏览器发送给服务器的cookie有:aCookie,bCookie

3. 访问路径是http://localhost:8080/Example20/jsps/cookie/b.jsp

浏览器发送给服务器的cookie有:aCookie,bCookie,cCookie

可以理解为访问子路径,会把父路径下的cookie+本路径的cookie一起发送给服务器端,而访问父路径,则一般不会把子路径下的cookie发送给服务端

###### 2. cookie的域(domain)

Cookie中有一个属性是域,Cookie类中有setDomain(pattern)来设置cookie的域getDomain()来获取cookie的域

一般很少使用cookie的域,只有在多个二级域共享cookie时才使用

如:www.baidu.com,zhidao.baidu.com,news.baidu.com,tieba.baidu.com

这些域都可以理解时百度的子项目,如果要在这些与中共享cookie,就要使用cookie的域

注意:

1. 设置domain为:setDomain(".baidu.com")
2. 设置path为setPath("/")

默认cookie的域是当前域名,默认cookie的路径是当前页面的目录路径.

如果想要跨域或者在其他路径下访问cookie就要重新设置这两个属性,domain和path

如:

www.baidu.com/content/example/3.jsp 则域domain为www.baidu.com,路径path为/content/example

常见的通过cookie来进行CSRF(跨站请求伪造)攻击

当用户进行登陆时,打开另外的含有恶意链接的恶意网站,用户如果点击了这个恶意网站的上恶意链接,这个恶意链接会利用登陆的信息来进行相应的恶意操作

如:

你登陆了博客,而你有打开另一个网页,这个网页上有恶意的链接如图片(自动加载),你点了就会利用你登陆博客的用户信息来进行具体帖子的删除

注意:假设登陆的网址是http://www.c.com:8002/,恶意网站上有一个恶意的img标签,一个img标签的src是http://www.c.com:8002/content/delete/87343,则会自动发起删除的请求(因为img在网页加载是同步加载,而且路径是与登陆路径下的子路径,所有能利用用户的登陆信息)

因为一般cookie中包含用户的认证信息,当用户访问攻击者准备的攻击环境时,攻击者就可以对服务器发起CSRF攻击.在这个攻击过程中,攻击者借助受害者的cookie片区服务器的信任,但不能拿到cookie,也看不到cookie的内容.而对于服务器返回的结果,由于浏览器同源策略的限制,攻击者也无法进行解析(这个我也不晓得为啥扯到浏览器的同源策略...)因此，攻击者无法从返回的结果中得到任何东西，他所能做的就是给服务器发送请求，以执行请求中所描述的命令，在服务器端直接改变数据的值，而非窃取服务器中的数据。

#### CSRF攻击的防范:

1. 使用验证码:

因为CSRF攻击往往是在用户不知情的情况下构造了网络请求,而验证码会强制用户必须与应用进行交互,才能完成最终请求(就是发送敏感请求后,必须有一个验证码来给用户予确定).因为通常情况下,验证码能够很好的遏制CSRF攻击

2. 检查Referer字段(请求报文中的字段,表示发起htpp请求来源地址)

因为如果在恶意网址上发起的CSRF攻击的话,发起请求的referer字段是指向恶意网址的,所以可以通过检查http请求的referer字段,来查看请求的网址适合是合法的

3. 添加 token 验证(token==令牌)

CSRF 攻击之所以能够成功，是因为攻击者可以完全伪造用户的请求，该请求中所有的用户验证信息都是存在于 Cookie 中，因此攻击者可以在不知道这些验证信息的情况下直接利用用户自己的 Cookie 来通过安全验证。要抵御 CSRF，关键在于在请求中放入攻击者所不能伪造的信息，并且该信息不存在于 Cookie 之中。可以在 HTTP 请求中以参数的形式加入一个随机产生的 token，并在服务器端建立一个拦截器来验证这个 token，如果请求中没有 token 或者 token 内容不正确，则认为可能是 CSRF 攻击而拒绝该请求。