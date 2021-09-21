# CSS 提高性能的方法

1. 尽量将样式写在单独的css文件中，在head标签中引用

好处：

1） 内容与样式分离，易用管理和维护

2） 减少页面体积

3） css文件可以被缓存、重用，维护成本降低

2. 不使用@import

因为@import是在文档解析完毕才开始加载的，而且不支持js修改样式

3. 避免使用复杂的选择器，层级越少越好

建议嵌套的选择器层级不要超过三层

4. 精简页面的样式文件，去掉不用的样式

根据当前页面需要的css去合并当前页面用到的css文件，而不是把所有的css文件合并在一个文件中，这样其他页面的css也同时引入到当前页面中而不用到，造成文件过大，影响加载速度，而且浏览器也要去进行多余的样式匹配，影响渲染时间

（注：合并成一个文件有一个优点：样式文件会被浏览器缓存，进入到其他页面样式文件不用再去下载。）

5. 利用css继承减少代码量

css的一些属性父元素设置了，子元素也继承了，因此子元素不用重复设置样式，比如说字体font-size，font-family，color，pointer：curse

# css提高可维护性的方法

1. 命名与备注

命名是提高代码可读性的第一步，也是及其重要的一步，要找一个合适贴切的名字

​		

```scss
	头：header

　　内容：content/container

　　尾：footer

　　导航：nav

　　侧栏：sidebar

　　栏目：column

　　页面外围控制整体佈局宽度：wrapper

　　左右中：left right center

　　登录条：loginbar

　　标志：logo

　　广告：banner

　　页面主体：main

　　热点：hot

　　新闻：news

　　下载：download

　　子导航：subnav

　　菜单：menu

　　子菜单：submenu

　　搜索：search

　　友情链接：friendlink

　　页脚：footer

　　版权：copyright

　　滚动：scroll

　　内容：content

　　标签：tags

　　文章列表：list

　　提示信息：msg

　　小技巧：tips

　　栏目标题：title

　　加入：joinus

　　指南：guide

　　服务：service

　　注册：regsiter

　　状态：status

　　投票：vote

　　合作伙伴：partner

　　导航：nav

　　主导航：mainnav

　　子导航：subnav

　　顶导航：topnav

　　边导航：sidebar

　　左导航：leftsidebar

　　右导航：rightsidebar

　　菜单：menu

　　子菜单：submenu

　　标题: title

　　摘要: summary
```

2. 提取相同样式

提取相同的样式成为一个单独的类再引用，这样不仅可以精简CSS文件大小，而且CSS代码变少，更易于重用和维护

原来的代码：

```css
.about-title{
　　margin: 0 auto 6rem; 
   color: #333; 
   text-align: center; 
   letter-spacing: 4px; 
   font-size: 2rem;

　　}

.achieve-title{
　　margin: 0 auto 6rem; 
   color: #fff;
   text-align: center; 
   letter-spacing: 4px; 
   font-size: 2rem;

　　}
```

　

```css
.column-title{
　　margin: 0 auto 6rem; 
   text-align: center;
   letter-spacing: 4px; 
   font-size: 2rem;

}

.about{
　　color: #333;
}

.achieve{
　　color:#fff;
}
```

3. 书写顺序

- 位置属性(position, top, right, z-index, display, float等)
- 大小(width, height, padding, margin)

- 文字系列(font, line-height, letter-spacing, color- text-align等)

- 背景(background, border等)

- 其他(animation, transition等)
  