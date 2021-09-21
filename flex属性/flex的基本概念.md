## flex的基本概念

- Flex布局元素，称为Flex容器，简称"容器"。它的所有子元素自动成为容器元素，简称"项目"。
- 容器默认存在两根轴：水平的主轴(main axis)和垂直的交叉轴(cross axis)。主轴的排列方式：从左到右；交叉轴的排列方式：从上到下;

## 容器的属性

### 1、flex-direction :属性决定主轴的方向 (即项目的排列方式）

- flex-direction：row （主轴水平方向，起点在左端）

![](C:\Users\Administrator\Desktop\markdown笔记\flex属性\images\1.jpg)

![](C:\Users\Administrator\Desktop\markdown笔记\flex属性\images\2.jpg)

- flex-direction：row-reverse （主轴水平方向，起点在右端）

![](C:\Users\Administrator\Desktop\markdown笔记\flex属性\images\3.jpg)

![](C:\Users\Administrator\Desktop\markdown笔记\flex属性\images\4.jpg)

- flex-direction：column （主轴垂直方向，起点在上沿）

![](C:\Users\Administrator\Desktop\markdown笔记\flex属性\images\5.jpg)

![](C:\Users\Administrator\Desktop\markdown笔记\flex属性\images\6.jpg)

- flex-direction：column-reverse （主轴在垂直方向，起点在下沿）

![](C:\Users\Administrator\Desktop\markdown笔记\flex属性\images\7.jpg)

![](C:\Users\Administrator\Desktop\markdown笔记\flex属性\images\8.jpg)

### 2、flex-wrap : 默认情况下，项目都排在一条线（又称"轴线"上）

- flex-wrap：nowarp （不换行，默认的)

![](C:\Users\Administrator\Desktop\markdown笔记\flex属性\images\9.jpg)

![](C:\Users\Administrator\Desktop\markdown笔记\flex属性\images\10.jpg)

- flex-wrap：wrap （换行，第一行在上面）

![](C:\Users\Administrator\Desktop\markdown笔记\flex属性\images\11.jpg)

![](C:\Users\Administrator\Desktop\markdown笔记\flex属性\images\12.jpg)

- flex-wrap：wrap-reverse （换行，第一行在下面）

![](C:\Users\Administrator\Desktop\markdown笔记\flex属性\images\13.jpg)

![](C:\Users\Administrator\Desktop\markdown笔记\flex属性\images\14.jpg)

### 3、flex-flow：是flex-direction 属性和flex-wrap属性的简写，默认值row、nowrap

### 4、justify-content：属性定义了项目在主轴上的对齐方式

- justify-content：flex-start （左对齐，默认值）

<img src="C:\Users\Administrator\Desktop\markdown笔记\flex属性\images\15.jpg" style="zoom:67%;" />

![](C:\Users\Administrator\Desktop\markdown笔记\flex属性\images\16.jpg)

- justify-content：flex-end（右对齐）

![](C:\Users\Administrator\Desktop\markdown笔记\flex属性\images\17.jpg)



![](C:\Users\Administrator\Desktop\markdown笔记\flex属性\images\18.jpg)

- justify-content：center （居中）

![](C:\Users\Administrator\Desktop\markdown笔记\flex属性\images\19.jpg)

![](C:\Users\Administrator\Desktop\markdown笔记\flex属性\images\20.jpg)

- justify-content：space-between （两端对齐，项目之间的间隔相等）

![](C:\Users\Administrator\Desktop\markdown笔记\flex属性\images\21.jpg)

![](C:\Users\Administrator\Desktop\markdown笔记\flex属性\images\22.jpg)

- justify-content：space-around （每个项目两侧的间距相等）

![](C:\Users\Administrator\Desktop\markdown笔记\flex属性\images\23.jpg)



![](C:\Users\Administrator\Desktop\markdown笔记\flex属性\images\24.jpg)

### 5、align-items :定义项目交叉轴上如何对齐（单行）

- align-items：flex-start （交叉轴起点对齐）

![](C:\Users\Administrator\Desktop\markdown笔记\flex属性\images\25.jpg)

![](C:\Users\Administrator\Desktop\markdown笔记\flex属性\images\26.jpg)

- align-items: flex-end （交叉轴终点对齐）

![](C:\Users\Administrator\Desktop\markdown笔记\flex属性\images\27.jpg)

![](C:\Users\Administrator\Desktop\markdown笔记\flex属性\images\28.jpg)

- align-items：center （垂直方向，中间开始）

![](C:\Users\Administrator\Desktop\markdown笔记\flex属性\images\居中1.jpg)

![](C:\Users\Administrator\Desktop\markdown笔记\flex属性\images\居中2.jpg)

- align-items：baseline （项目第一行文字的基线对齐）

![](C:\Users\Administrator\Desktop\markdown笔记\flex属性\images\30.jpg)

![](C:\Users\Administrator\Desktop\markdown笔记\flex属性\images\29.jpg)

- align-items：stretch （默认值，如果项目未设置高度或设为auto,将占满整个容器的高度)

![](C:\Users\Administrator\Desktop\markdown笔记\flex属性\images\31.jpg)

![](C:\Users\Administrator\Desktop\markdown笔记\flex属性\images\32.jpg)

### 6、align-content :多行轴线对齐（用法同align-items ）

## flex项目属性

### 1、order 定义项目排列顺序

- order：number （数值越小越靠前，默认为0）

![](C:\Users\Administrator\Desktop\markdown笔记\flex属性\images\33.jpg)

![](C:\Users\Administrator\Desktop\markdown笔记\flex属性\images\34.jpg)

### 2、flex-grow 定义项目放大比例

- flex-grow ：number（默认0，如果有剩余空间也不放大，值为1放大，2是1的双倍大小，此类推）

![](C:\Users\Administrator\Desktop\markdown笔记\flex属性\images\35.jpg)

![](C:\Users\Administrator\Desktop\markdown笔记\flex属性\images\36.jpg)

### 3、flex-shrink 定义项目缩小比例

- flex-shrink ：number （默认为1，如果空间不足则会缩小，值为0不能缩小

![](C:\Users\Administrator\Desktop\markdown笔记\flex属性\images\37.jpg)

![](C:\Users\Administrator\Desktop\markdown笔记\flex属性\images\38.jpg)

### 4、flex-basis 定义项目自身大小

![](C:\Users\Administrator\Desktop\markdown笔记\flex属性\images\39.jpg)

![](C:\Users\Administrator\Desktop\markdown笔记\flex属性\images\40.jpg)

### 5、flex：属性是flex-grow，flex-shrink ,flex-basis的简写，默认值为0、1、auto

### 6、align-self 项目自身对齐

- align-self ：auto | flex-start | flex-end | center | baseline | stretch

![](C:\Users\Administrator\Desktop\markdown笔记\flex属性\images\41.jpg)

![](C:\Users\Administrator\Desktop\markdown笔记\flex属性\images\42.jpg)

align-items在伸缩容器上使用它，伸缩容器内部所有的元素都一致地受制于align-items的值。
但是有些时候，我们希望伸缩容器内部某个元素在侧轴上的排列方式有所差异。此时就不能使用
align-items，因为align-items作用于整体。我们希望作用于部分。这就是align-self的发挥场地。

align-self的可取值和align-items的可取值完全相同。之前一直看不懂align-self和align-items的区别
那是因为没有发挥想象力。