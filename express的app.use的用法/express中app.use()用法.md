## express中app.use()用法

app.use(path,callback)中的callback既可以是router对象又可以是函数
 app.get(path,callback)中的callback只能是函数

当一个路由有好多个子路由时用app.use(path,router)
 例子：
 http://localhost:3000/home/one
 http://localhost:3000/home/second
 http://localhost:3000/home/three
 路由/home后面有三个子路由紧紧跟随，分别是/one,/second,/three
 如果使用app.get()，则要不断的重复,很麻烦，也不利用区分



```csharp
app.get("/home",callback)
app.get("/home/one",callback)
app.get("/home/second",callback)
app.get("/home/three",callback)
```

我们可以创建一个router.js  专门用来一个路由匹配多个子路由



```tsx
var express = require('express')
var router = express.Router()
router.get("/",(req,res)=>{
    res.send("/")
})
router.get("/one",(req,res)=>{
    res.send("one")
})
router.get("/second",(req,res)=>{
    res.send("second")
})
router.get("/treen",(req,res)=>{
    res.send("treen")
})
module.exports = router;
```

在app.js中导入router.js



```jsx
var express = require('express')
var router = require("./router")
var app = express()

app.use('/home',router) //router路由对象中的路由都会匹配到"/home"路由后面
app.get('/about', function (req, res) {
  console.log(req.query)
  res.send('你好，我是 Express!')
})

// 4 .启动服务
app.listen(3000, function () {
  console.log('app is running at port 3000.')
})
```

那么，什么时用app.use，什么时用app.get呢？

路由规则是`app.use(path,router)`定义的，`router`代表一个由`express.Router()`创建的对象，在路由对象中可定义多个路由规则。可是如果我们的路由只有一条规则时，可直接接一个回调作为简写，也可直接使用`app.get`或`app.post`方法。即
 当一个路径有多个匹配规则时(多个子路由)，使用app.use（）

## app.use(express.static('public'));

为了提供对静态资源文件（图片，css，js文件）的服务，请使用Express内置的中间函数express.static.

传递一个包含静态资源的目录给express.static中间件用于立即开始提供文件。 比如用以下代码来提供public目录下的图片、css文件和js文件：
 `app.use(express.static('public'));`

如果前台想请求后台public目录下images/08.jpg静态的图片资源
 通过： `http://localhost:3000/images/08.jpg`

通过多次使用 express.static中间件来添加多个静态资源目录:



```rust
app.use(express.static('public'));
app.use(express.static('file'));
```

Express将会按照你设置静态资源目录的顺序来查看静态资源文件。

为了给静态资源文件创建一个虚拟的文件前缀（文件系统中不存在），可以使用express.static函数指定一个虚拟的静态目录，如下：



```rust
app.use('/static', express.static('public'))
```

现在你可以使用‘/static’作为前缀来加载public文件夹下的文件了

比如： http:// localhost:3000/static/image/kitten.jpg



作者：vioi
链接：https://www.jianshu.com/p/1d92463ebb69
来源：简书
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。