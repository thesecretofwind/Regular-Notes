## express的笔记

### 常见模块

1. 引入express包,但引入的是一个函数,需要调用函数

   ````javascript
   //常见的引入的例子
   const express = require('express')
   const app = express()
   
   app.get('/filterOther',(request,response) => {
      mint.filter(request.query.content).then(data => {
       if(!data.pass){
           data.text = data.text.replace(new RegExp('</([^a-z])','g'),function($0,$1){
           return '</'
       })
           response.send({text:data.text,pass:data.pass})
       }else{
           response.send({isSesitive:false})
       }
      })
   })
   app.listen(3000,()=>{
       console.log('启动成功')
   })
   ````

   上述的例子就是引用建立get请求(url为http:localhost:3000/filterOther)后启动会的的回调,request是请求时的参数,,可以包括请求传递过来的参数,可使用`request.query.参数名`来获取get请求传递过来的参数,当然,request.params.参数名也可以,但是这是获取传递过来的key所对应的value的(个人感觉与request.query.参数名不一样的是,后者获取的是一个对象,而前者是获取特定的值罢了)

2. 引入post请求

   post请求与get请求不一样,要导入body-parser来挂载,才能获取post请求传递过来的数据

   ``````javascript
   app.use(bodyParser.urlencoded({ extended: false }))
   app.use(bodyParser.json())
   
   app.post('/filterBlogContent',(request,response) => { //request.body就是传递的内容了
       testSesitive(response,request.body.params.data)
   })
   
   function testSesitive(response,testContent){
       mint.filter(testContent).then(data => {
           if(!data.pass){
               data.text = data.text.replace(new RegExp('</([^a-z])','g'),function($0,$1){
               return '</'
           })
               response.send({text:data.text,pass:data.pass})
           }else{
               response.send({isSesitive:false})
           }
          })
   }
   
   
   app.listen(3000,()=>{
       console.log('启动成功')
   })
   ``````

   

3. 配置跨域

   ```javascript
   //1.直接设置响应头来进行跨域
   app.get('/filterOther',(request,response) => {
    	response.header("Access-Control-Allow-Origin", "*");
       response.header("Access-Control-Allow-Headers", "X-Requested-With");
       response.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
       response.header("X-Powered-By",' 3.2.1')
       response.header("Content-Type", "application/json;charset=utf-8");
      mint.filter(request.query.content).then(data => {
       if(!data.pass){
           data.text = data.text.replace(new RegExp('</([^a-z])','g'),function($0,$1){
           return '</'
       })
           response.send({text:data.text,pass:data.pass})
       }else{
           response.send({isSesitive:false})
       }
      })
   })
   /*
   	//全局可使用这种方式
   app.all('*', function (req, res, next) {
       //允许http://xxx.xx.xx/可跨
       res.header('Access-Control-Allow-Origin', 'http://xxx.xx.xx/');
       res.header('Access-Control-Allow-Headers', 'Content-Type');
       res.header('Access-Control-Allow-Methods', '*');
       res.header('Content-Type', 'application/json;charset=utf-8');
       next();
   }
   */
   
   //2.使用cors包括,直接使用即可(当然亦可以配置须臾跨域的源,方法,头部信息,验证信息等
   const cors = require('cors')
   app.use(cors())
   /*
   	//这个是配置具体(感觉像是app.all的一个封装罢了)
   var cors=require('cors');
   app.use(cors({
       origin:['http://localhost:8080'],  //指定接收的地址
       methods:['GET','POST'],  //指定接收的请求类型
       alloweHeaders:['Content-Type','Authorization']  //指定header
   }))
   */
   
   ```

4. 设置响应头字段

   ```javascript
   //1.设置单属性字段
   app.get('/filterOther',(request,response) => {
   response.setHeader('charset', 'utf-8');
   })
   //2.返回的是写入的信息的(必须在调用 response.end() 之前调用)
   response.writeHead(200, {
     'Content-Length': Buffer.byteLength(body),
     'Content-Type': 'text/plain' });
   ```

   