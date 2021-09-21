## 关于css属性display，float，position的一些问题

#### 对于display的常用属性的解释

1. inline

   使元素变成行内元素，拥有行内元素的特性（即可以与其他行内元素共享一行）；但不能改变元素的height，width属性，大小由内容撑开；而且可是使用padding，margin的left和right常常边距效果，但是top和bottom不行

2. block

   使元素变成块级元素，独占一行，在不设置自己的宽度的情况下，块级元素会默认填满父级元素的宽度；能改变元素的height，width的值，也能使用padding和margin的四个方法产生边距效果

3. inline-block

   同时具有行内元素和块级元素的特点，也就是行内块

#### display:inline-block和浮动float的区别

相同：float:left和display:inline-block都能实现行排布

不同：1. 设置display:inline-block,元素不会脱离文本流,而 float会使元素脱离文本流,且还可能导致父元素高度坍塌

float的缺点:容易出现元素参差不齐的情况(就是说元素的高度不一致,排列展示不太好看)

inline-block的缺点:使用display:inline-block的元素会存在4px的像素

原因:因为设置displace:inline-block的元素之间存在换行(回车符,有空格或是换行),这个换行相当于空白字符了,通常情况下,多个连续的空白符会合并成一个空白符,就是这个空白符产生空隙

解决: 1. 把设置dispaly:inline-block的元素不留空格不换行

 		 2.空格符本质上是一个字符,所以可以设置父元素的font-size:0

   		3.设置letter-spacing设置字符间的距离,且支持设置为负值,所以可以把letter-spacing设置为负值可以去除空隙

#### 关于inline-block在各个浏览器的问题:

1. block水平的元素inline-block化后，IE6/7没有换行符间隙问题，其他浏览器均有；

2. inline水平的元素inline-block后，所有主流浏览器都有换行符/空格间隙0问题；

3. font-size:0，去除换行符间隙，在IE6/7下残留1像素间隙，Chrome浏览器无效，其他浏览器都完美去除；

4. letter-spacing负值可以去除所有浏览器的换行符间隙，但是，Opera浏览器下极限是间隙1像素，0像素会反弹，换行符间隙还原

  关于上面的一些简化:

 浏览器兼容性：ie6/7是不兼容 display：inline-block的所以要额外处理一下：
　　在ie6/7下：
　　对于行内元素直接使用{dislplay:inline-block;}
　　对于块级元素：需添加{display:inline;zoom:1;}

css中zoom属性的作用:

1. ie浏览器的专有属性,可以设置或检索对象的缩放比例
2. 触发ie浏览器的hasLayout
3. 解决ie下的浮动,margin重叠等问题

#### 关于文档流的解释

文档流:指元素排版布局过程中,元素会自动从左往右,从上至下的流式排列,并最终窗体自上而下分成一行行,并在每一行按从左至右的顺序排放元素.

脱离文档流标志=>没有实际高度,脱离文档流的元素都是块级元素

#### 关于设置绝对定义的一些问题

设置绝对定位的父元素的position要置为relative(即父元素要是相对定位)

#### 绝对定位和浮动的区别

float是半脱离文档,在文档流中会占有一定位置,使用float脱离文档流时,但其他盒子内的文本依旧会为这个元素让出位置,环绕在周围

absolute是完全脱离,对于使用position:absolute脱离文档流元素,其他盒子和其他盒子内的文本都会无视它(设置absolute的元素)

设置了float属性的元素的位置属性(top/bottom,right/left)是无效的

一些其他的思考:

按照我的理解浮动元素就是跟块级元素不在一个水平空间，跟文字内联元素在一个空间，所以这里边框就相当于在背景之上，所以不会影响背景元素，平常所说的清除浮动，并不是说把浮动元素的float属性去掉，而是清除其周围的浮动元素，使其自身周围没有浮动元素