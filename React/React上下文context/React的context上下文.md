## React的context上下文

### 含义

`上下文（context）`: 是指一个组件里面包含所有子组件组成dom 的树，那么在这颗虚拟dom树中的环境，就称之为上下文。说到树这个概念，稍微提一笔，在树中，每一个节点我们都可以理解他是一颗树的根节点（起始节点）。

react中的上下文的特点：

1. 当某个组件创建了上下文后，上下文中的数据，会被所有后代组件共享,如概念所说，子组件与父组件中都可以使用上下文的数据。
2. 如果某个组件依赖了上下文，会导致该组件不再纯粹（外部数据仅来源于属性props）,毕竟组件的数据都是都是一层一层往下传的，如果突然组件的数据来着祖先组件，这会给组件维护起来带来一定的麻烦。
3. 一般情况下，用于第三方组件（通用组件）
4. 在react 中，上下文分为两种形式的，一个是react版本小于16.0以前旧的上下文，另一个是16.3后面提出新的上下文旧版本上下文
   创建上下文只有类组件才可以创建上下文

### 旧版本上下文

#### 创建上下文

只有类组件才可以创建上下文

#### 使用上下文中的数据

给类组件书写静态属性 childContextTypes，使用该属性对上下文中的数据类型进行约束。添加实例方法 getChildContext，该方法返回的对象，即为上下文中的数据，该数据必须满足类型约束，该方法会在每次render之后运行。

使用上下文中的数据
**要求：**

1. 如果要使用上下文中的数据，组件必须有一个静态属性 contextTypes，该属性描述了需要获取的上下文中的数据类型
2. 可以在组件的构造函数中，通过第二个参数，获取上下文数据也可从组件的context属性中获取 {this.context}
3. 在函数组件中，通过第二个参数，获取上下文数据
   

如果要使用上下文中的数据，组件必须有一个静态属性 contextTypes，该属性描述了需要获取的上下文中的数据类型,可以在组件的构造函数中，通过第二个参数，获取上下文数据也可从组件的context属性中获取 {this.context}在函数组件中，通过第二个参数，获取上下文数据

#### 原理

![img](C:\Users\Administrator\Desktop\markdown笔记\React\React上下文context\images\watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQxNDk5Nzgy,size_16,color_FFFFFF,t_70)

#### 样列

```react
import React, { Component } from 'react'
import PropTypes from "prop-types";
// 类组件
interface ITestOldContextS {
  a: string,
  b: number
}
// 子组件1
class ChildA extends Component {
  render() {
    return (
      <div>
        <h2>我是子组件</h2>
        <ChildB></ChildB>
      </div>
    )
  }
}
// 子组件2
class ChildB extends Component {
  static contextTypes = {
    a: PropTypes.string
  }
  render() {
    return (
      <div>
        <h3>我是子组件的子组件，我获取上下文中的数据：{this.context.a}</h3>
      </div>
    )
  }
}



export default class TestOldContext extends Component<{}, ITestOldContextS> {
  state: ITestOldContextS = {
    a: '测试',
    b: 0
  }
  // 规定上下文中的类型
  static childContextTypes = {
    a: PropTypes.string,
  }
  // 给上下文中放入指定属性
  getChildContext() {
    return {
      a: this.state.a
    }
  }
  render() {
    return (
      <div>
        <h1>我是跟组件，  我自己的数据 a: {this.state.a} b:{this.state.b}</h1>
        <ChildA />
      </div>
    )
  }
}
```

![在这里插入图片描述](C:\Users\Administrator\Desktop\markdown笔记\React\React上下文context\images\2.png)



**上面的上下文设计有没有问题？**
**答案是肯定有问题的，不然为啥会去掉呢.**

1. 上下文的数据比较混乱，如果组件的层级很多，如果开发过程中遗留一点不经意的问题，那么对于维护的人员来说，那将是很痛苦的一件事情。
2. 子组件可不可以修改上下文中的数据， 这个答案也是肯定的，但是需要在父组件中提供一个修改的方法来进行修改，这个是js的优势
3. 存在严重的效率问题，并且容易导致滥用上下文的数据变化
   上下文中的数据不可以直接变化，最终都是通过状态改变

#### 上下文的数据变化

1. 上下文中的数据`不可以`直接变化，最终都是通过状态改变
2. 在上下文中加入一个`处理函数`，可以用于后代组件更改上下文的数据

### 新版本的上下文

对于这个版本的上下文,有点像一个小型的vuex， 因为数据是被抽离出来了。然后在父组件和子组件是共享的，主要是在使用方式上，让人觉得遍历。

#### 创建上下文

上下文是一个独立于组件的对象，该对象通过React.createContext(默认值)创建,返回的是一个包含两个属性的对象



- `Provider属性`：生产者。一个组件，该组件会创建一个上下文，该组件有一个value属性，通过该属性，可以为其数据赋值

  `注： 同一个Provider，不要用到多个组件中，如果需要在其他组件中使用该数据，应该考虑将数据提升到更高的层次,如果把provider提升到跟组件，那么这个是不是就是一个vuex?

- `Consumer属性`：使用者。Consumer是一个组件,它的子节点，是一个函数（它的props.children需要传递一个函数）
  使用上下文中的数据

#### 使用上下文中的数据

两种方法： 第一种是和旧版api差不都的使用方式;

1. 在类组件中，直接使用this.context获取上下文数据,要求：必须拥有静态属性 contextType , 应赋值为创建的上下文对象
2. 在函数组件中，需要使用Consumer来获取上下文数据

#### 原理

![在这里插入图片描述](C:\Users\Administrator\Desktop\markdown笔记\React\React上下文context\images\3.png)

#### 样例

```react
import React, { Component } from 'react'
// 创建一个上下文(React.createContext：创建一个上下文的容器(组件), 里面的值为设置共享的默认数据)
const ctx = React.createContext({ a: '' })
// 类组件
interface ITestOldContextS {
  a: string,
  b: number
}
// 子组件1
class ChildA extends Component {
  render() {
    return (
      <div>
        <h2>我是子组件</h2>
        <ChildB></ChildB>
      </div>
    )
  }
}
// 子组件2
class ChildB extends Component {

  render() {
    return (
      <div>
        {/* 使用上下文 */}
        <ctx.Consumer>
          {value => (
            <h3>我是子组件的子组件，我获取上下文中的数据：{value.a}</h3>
          )}
        </ctx.Consumer>
      </div>
    )
  }
}



export default class TestOldContext extends Component<{}, ITestOldContextS> {
  state: ITestOldContextS = {
    a: '测试',
    b: 0
  }

  // 给上下文中放入指
  getChildContext() {
    return {
      a: this.state.a
    }
  }
  render() {
    return (
      // 在父组件中赋值上下文
      <ctx.Provider value={{ a: this.state.a }}>
        <div>
          <h1>我是根组件,我自己的数据 a: {this.state.a} b:{this.state.b}</h1>
          <ChildA />
        </div>
      </ctx.Provider>
    )
  }
}


```

![在这里插入图片描述](C:\Users\Administrator\Desktop\markdown笔记\React\React上下文context\images\4.png)