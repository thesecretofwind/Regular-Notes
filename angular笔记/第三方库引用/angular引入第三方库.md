# angular引入第三方库

1. 使用cdn引用

就是在index.html文件中,直接使用link和script标签引入css的形式来对第三库进行引用(注意:如果是库与库之间存在依赖,要注意依赖关系比如引用bootstrap,则需要优先加载jquery和popper.js)

2. 在angualar.json文件中进行配置

angular.json是angular的配置文件,里面有一个styles属性和script属性(其值是一个数组),然后将需要引用的第三方库的路径添加到这里,然后重新启动就可以使用了

(注:在这里添加的库文件路径必须是本地路径的,网络路径会不找不到,而且这里引用的文件都是全局生效的,所有组件都是可以使用)

![在这里插入图片描述](C:\Users\Administrator\Desktop\markdown笔记\angular笔记\第三方库引用\images\1.png)

3. 在css文件中使用@import(路径)或者sass文件中的@import +路径(如果是在下载到node_modules文件夹下的,可以在暴民前加个~)

   @import "~bootstrap"(好像不加这个~波浪号也没事)

   如果导入的是js文件的话,可以在main.ts文件中导入

   import 'bootstrap'即可在全局生效