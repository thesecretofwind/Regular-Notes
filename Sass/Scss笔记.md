## Sass 

### 1.介绍
Sass (Syntactically Awesome StyleSheets)，一种基于ruby编写的CSS预处理器，可以使用变量、嵌套、混入、继承、运算、函数等功能，兼容css3等

### 2.变量的声明和使用
scss中使用$(美元符)来标识变量，如$hightlight-colr:#F90;任何可用作css属性值都可以作为scss的变量值，甚至像 1px solid red这样以空格分割的多个属性值(逗号也可以，如字体名字是逗号分割的，但在scss中可以使用),变量名可以和css的属性名或选择器名称相同，也可以使用中划线(短杆)或下划线连接组成变量，二者的连接时互通的，而且注意，短杆和下划线的两边内容一样，代表同一变量
#### 2.1使用
变量的使用-->css生成时，变量会被变量的值替代（简单看作js的变量代替也可以）
```scss
//编译前
$hightlight-colr:#f90;
.selected{
    border: 1px solid $hightlight-colr
}
//编译后
.selected{
    border:1px solid #f90;
}
```
可以更加复杂，把一个css所有的属性值作为作为一个变量值，而且变量值中可以引用其他变量
```scss
//编译前
$hightlight:#f90;
$hightlight-border:1px dashed $heightlight
.selected{
    border:$heightlight-border
}
//编译后
.selected{
    border:1px solid #f90;
}
```
### 3嵌套属性
在scss中，属性可以嵌套（这里的嵌套是指像border-color,border-left,background-img,background-origin...),其规则为：把属性名从短杆(中划线-)分开，再根属性后面添加一个冒号(:)，然后就是一个{}块，把子属性后半部分(就是短杆拆分的后面部分)写道{}块中
```scss
//编译前
nav{
    border: 1px solid #ccc {
        left:0px;
        right:0px;
    }
}
//编译后
nav{
    border:1px solid #ccc;
    border-left:0px;
    border-right:0px;
}
//编译前
.container{
    width:100px;
    height:100px;
    backgroud{
        image:url('./images/timg.jpg')
        origin:0% 0%
        size:cover
        repeat:no-repeat
    }
}
//编译后
.container{
    width:100px;
    height:100px;
    background-image:url('./images/timg.jpg');
    background-origin:0% 0%;
    background-size:cover;
    background-repeat:no-repeat;
}
```
### 4.嵌套规则和父选择器的标识&
嵌套规则：在css中，孩子选择器可以不断地嵌套下去，以准确地到达想要地样式类或标签，如果嵌套很多的话，比较冗余，如果scss可以之前嵌套下去，其预处理器会自动帮你加上，补全
```scss
//编译前
#content{
    article{
        h1{
            color:red;
        }
        p{
            margin-bottom:1.5em;
            span{
                color:orange;
            }
        }
    }
    aside:{
            backgroud-color:#EEE;
        }
}
//编译后
#content article h1 {color:red;}
#content article p{margin-bottom:1.5em}
#content article p span{color:orange;}
$content aside{background-color:#EEE}
```
父选择器&，可以在嵌套规则中代表着父选择器，可以进行一些内容上的触发
```scss
//编译前
article a{
    color:blue;
    &:hover{color:red}
}
//编译后
article a {color:blue}
article a:hover{color:red}
```
父类选择器的另一种用法-->可以在父类选择器&之前添加选择器
```scss
//编译前
#content aside{
    color:red;
    add-class & {
        color:green
    }
}
//编译后
#content aside {color:red};
add-class #content aside {color:green}
```
### 5.scss支持群组选择器的嵌套
```scss
//编译前
.container{
    h1,h2,h3 {color:red}
}
//编译后
.container h1,.container h2,.container h3{color:red}

```
### 6.scss支持子选择器(>)和兄弟选择器(+或者~)
子选择器> ：
.container > p {color:red} ==>指的是.container类后面的所有p元素的字体颜色都为红色，跨层级的不算
如

```html
<div class="container">
    <p>hello</p>
    <div>
        <p>world</p>
    </div>
</div>
```
中的world不受影响,字体不会变红)

后代选择器：
.container p {color:red}==>标识.container 下所有的p元素，包括包裹的p元素颜色都生效
如

```html
<div class="container">
<p>hello</p>
<div><p>world</p>
</div></div>
```
中的world不受影响,字体不会变红
~(后面选择器？)
p ~ ul{background} ==>代表的是p元素后面的所有（同级）ul元素(注意：这个和后代选择器和子元素选择器不同，这个是选定的是波浪线前面的选择器后面的同级选择器代表的元素)
如

```html
 <p>段落P </p>
    <div>
        <ul>
            <li>列表项1 </li>
            <li>列表项2 </li>
            <li>列表项3 </li>
        </ul>
    </div>
    <ul>
        <li>列表项1 </li>
        <li>列表项2 </li>
        <li>列表项3 </li>
    </ul>
    <ul>
        <li>列表项1 </li>
        <li>列表项2 </li>
        <li>列表项3 </li>
    </ul>
```
知道了之后，看一下下面这些在scss中代码及编译后的代码
```scss
artivlr{
    ~ aricle {border-top:1px dashed #ccc}
    > secton {backgound:#eee}
    dl > {
        dt{color:#333}
        dd{color:#555}
    }
    nav + &{margin-top:0}
}

article article{border-top:1px dashed #ccc}
artile > section{background:#eee}
aritcle dl > dt{color:#333}
article dl >dd{color:#555}
```
注意：~和+，>这三个组合选择器可以放在外面，也可以在里面，好像一般来说对于一个父元素选择器中，如果有多个想要设置样式的子元素来说，把组合选择器放在外面比较好

### 7.导入sass文件
在css文件中@import表示在一个css文件中导入其他css文件，只有执行道@import语句才会去下载想要导入的那些css文件（也就说
