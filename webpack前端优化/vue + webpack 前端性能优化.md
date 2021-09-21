# vue + webpack 前端性能优化

## 背景

   对于程序开发者而言，开发一个项目不仅仅注重效率和功能，前端的性能问题也是非常重要的。这直接影响用户的体验，从而间接的也反应该项目质量的好坏。    影响项目性能的原因有很多，如：资源文件的大小，业务的繁杂程度等，所以前端优化的方式也很多。这些东西很零碎，容易被人遗忘。所以这篇文章中对我平时用的优化方式总结一下，可能不是太全面，大家有其它的优化方式可以留言，互相交流下哟。不说了，麻溜的写。。

## 优化一： vue-router路由懒加载

   `懒加载：`也叫延迟加载，即在需要的时候进行加载，随用随载。    使用懒加载的原因： `vue`是单页面应用，使用`webpcak`打包后的文件很大，会使进入首页时，加载的资源过多，页面会出现白屏的情况，不利于用户体验。运用懒加载后，就可以按需加载页面，提高用户体验。

### 懒加载的写法：

```javascript
import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
export default new Router({
  mode: 'history',
  routes: [
   {
      path: '/',
      component: resolve => require(['@/components/DefaultIndex'],resolve),
      children: [
        {
          path: '',
          component: resolve => require(['@/components/Index'],resolve)
        },
        {
          path: '*',
          redirect: '/Index'
        }
      ]
})
```



### 非懒加载的路由配置：

```
import Vue from 'vue'
import Router from 'vue-router'
import DefaultIndex from '@/components/DefaultIndex'
import Index from '@/components/Index'
Vue.use(Router)
export default new Router({
  mode: 'history',
  routes: [
   {
      path: '/',
      component: 'DefaultIndex ',
      children: [
        {
          path: '',
          component: 'Index'
        },
        {
          path: '*',
          redirect: '/Index'
        }
      ]
})
复制代码
```



## 优化二：webpack压缩图片（减少图片大小）

   一般在`vue`项目中用`webpack`打包时，会根据`webpack.base.conf.js`中`url-loader`中设置`limit`大小来对图片处理，对小于`limit`的图片转化为`base64`格式，其余的不做操作。所以对有些较大的图片资源，在请求资源的时候，加载会很慢，可以用`image-webpack-loader`来压缩图片。

### 安装：

```javascript
npm install image-webpack-loader --save-dev
```

### 配置：

   在`webpack.base.conf.js`文件中引入配置（此项目我用的是脚手架搭建的，所以是`webpack.base.conf.js`）

```javascript
1: 引入：
require("image-webpack-loader")
2：配置：
  module: {
    rules: [
    ...(config.dev.useEslint ? [createLintingRule()] : []),
    {
      test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
      loader: 'url-loader',
      options:   {
       loader: 'image-webpack-loader',
       options: {
        bypassOnDebug: true,
      }
    }
  },
或者也可配置为：
{
  test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
  use:[
    {
    loader: 'url-loader',
    options: {
      limit: 10000,
      name: utils.assetsPath('img/[name].[hash:7].[ext]')
      }
    },
    {
      loader: 'image-webpack-loader',
      options: {
        bypassOnDebug: true,
      }
    }
  ]
}
复制代码
```



## 优化三：打包后的js过大，将js打包多个文件

   由于`webpack`打包后的`js`过大，以至于在加载资源时间过长。所以将文件打包成多个`js`文件，在需要的时候按需加载。

### 优化方案：

```javascript
entry:{ 
 main:'xxx.js'
} 
plugins:{
 new commonsChunkPlugin({
 name:'commons',
 minChunks:function(module){
  // 下边return参考的vue-cli配置
  // any required modules inside node_modules are extracted to vendor
  return (
   module.resource &&
   /\.js$/.test(module.resource) &&
   module.resource.indexOf(
   path.join(__dirname, '../node_modules')
   ) === 0
  )
 }
}) ,
// 以下才是关键
new commonsChunkPlugin({
 name:'charts',
 chunks:['commons'] 
 minChunks:function(module){
  return (
   module.resource &&
   /\.js$/.test(module.resource) &&
   module.resource.indexOf(
   path.join(__dirname, '../node_modules')
   ) === 0 && ['jquery.js', 'highcharts.js','echarts'].indexOf( module.resource.substr(module.resource.lastIndexOf('/')+1).toLowerCase() ) != -1
  )
 }
}) 
}
```



## 优化四：去掉不必要的插件

   1：打包时，将一些不必要的插件可以去掉，以防止打包一些无用的资源，导致打包后的文件过大，影响性能。

   2：在引入第三方插件的时候，如果该插件的组件过大，可以按需引入，如`element-ui`。

   3：使用`webpack.optimize.UglifyJsPlugin`插件压缩混淆[js](http://lib.csdn.net/base/javascript)代码，使用方法如下：

```javascript
plugins: [//webpack.config.jsnew webpack.optimize.UglifyJsPlugin({    warnings: false,
    compress: {
        join_vars: true,
        warnings: false,
    },
    toplevel: false,
    ie8: false,
]
```



## 优化五： gzip压缩

   web前端项目，静态资源放在`cdn`上比较多，`gzip`的压缩是非常必要的，它直接改变了`js`文件的大小，减少两到三倍。 参考[加速nginx: 开启gzip和缓存](https://link.jianshu.com/?t=https%3A%2F%2Fwww.darrenfang.com%2F2015%2F01%2Fsetting-up-http-cache-and-gzip-with-nginx%2F)，`nginx`的`gzip`配置非常简单，在你对应的域名底下，添加下面的配置，重启服务即可。`gzip_comp_level`的值大于`2`的时候并不明显，建议设置在`1或者2`之间。

```javascript
// 开启gzip
gzip on;
// 启用gzip压缩的最小文件，小于设置值的文件将不会压缩
gzip_min_length 1k;
// gzip 压缩级别，1-10，数字越大压缩的越好，也越占用CPU时间，后面会有详细说明
gzip_comp_level 2;
//进行压缩的文件类型。javascript有多种形式。其中的值可以在 mime.types 文件中找到。
gzip_types text/plain application/javascript application/x-javascript text/css application/xml text/javascript application/x-httpd-php image/jpeg image/gif image/png;
//是否在http header中添加Vary: Accept-Encoding，建议开启
gzip_vary on;
//禁用IE 6 gzip
gzip_disable "MSIE [1-6]\.";
复制代码
```



   这种方法我 没有使用过，有用过的亲，可以留言，沟通一下下。



## 优化六： 服务器缓存

   为了提高服务器获取数据的速度，`nginx`缓存着静态资源是非常必要的。如果是测试服务器对`html`应该不设置缓存，而`js`等静态资源环境因为文件尾部会加上一个`hash`值，这可以有效实现缓存的控制。

```php
location ~* ^.+\.(ico|gif|jpg|jpeg|png)$ { 
  access_log   off; 
  expires      30d;
}
location ~* ^.+\.(css|js|txt|xml|swf|wav)$ {
  access_log   off;
  expires      24h;
}
location ~* ^.+\.(html|htm)$ {
  expires      1h;
}
```

## 优化七: 使用tree-shaking,去除死代码

## 优化八:使用scope-hosting,作用域提升

减少沿着作用域查找变量的时间

## 优化九:使用ignorePlugin,忽略指定的的目录

使得指定目录被忽略，从而使得打包变快，文件变小，如对moment包打包的问题，如果只需要设置中文的话，其他语言也会被i打包进去的，导致打包速度变慢，所以使用ignorePlugin插件对一些没用的依赖目录打包