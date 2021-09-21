## react的受控组件和非受控组件

> 受控组件就是可以被 react 状态控制的组件
>  在 react 中，Input textarea 等组件默认是非受控组件（输入框内部的值是用户控制，和React无关）。但是也可以转化成受控组件，就是通过 onChange 事件获取当前输入内容，将当前输入内容作为 value 传入，此时就成为受控组件。
>  好处：可以通过 onChange 事件控制用户输入，使用正则表达式过滤不合理输入。

**双向数据绑定就是受控组件**

### 受控组件DOM操作、双向数据绑定



```jsx
import React,{Component} from 'react';
import ReactDOM from 'react-dom';

class Input extends Component{
    constructor(){
        super();
        this.state = {val:''};
    }
    handleChange=(event)=>{
        let val = event.target.value;
        this.setState({val})
    }

    render(){
        return (
            <div>
                <p>{this.state.val}</p>
                <input type="text" value={this.state.val} onChange={this.handleChange} /> //input就是受控组件 被状态对象的属性控制
            </div> 
        )
    }
}

ReactDOM.render(<Input/>,window.app)
```



```csharp
import React,{Component} from 'react';
import ReactDOM from 'react-dom';

class Sum extends Component{
    constructor(){
        super();
        this.state={a:0,b:0,result:0}
    }
    handleChangeA=(event)=>{
        this.setState({
            a:parseInt(event.target.value),
            result:parseInt(event.target.value)+this.state.b
        })
    }
    handleChangeB=(event)=>{
        this.setState({
            b:parseInt(event.target.value),
            result:parseInt(event.target.value)+this.state.a
        })
    }
    render(){
        return (
            <div>
                <input type="text" value={this.state.a} onChange={this.handleChangeA}/> +
                <input type="text" value={this.state.b} onChange={this.handleChangeB} /> = 
                <input type="text" value={this.state.result}/>
            </div>
        )
    }
}

ReactDOM.render(<Sum/>,window.app)
```

#### 非受控组件DOM操作



```csharp
import React,{Component} from 'react';
import ReactDOM from 'react-dom';

class Sum extends Component{
    handleChange=(event)=>{
        let a = parseInt(this.refs.a.value||0);
        let b = parseInt(this.refs.b.value||0);
        this.refs.result.value = a+b;
    }
    render(){
        return (
            //经过React封装可以onChange可以写在div上
            <div onChange={this.handleChange}> 
                <input type="text" ref="a" /> +
                <input type="text" ref="b" /> = 
                <input type="text" ref="result" />
            </div>
            //input是非受控组件，因为不受状态控制
        )
    }
}

ReactDOM.render(<Sum/>,window.app)
```

如果ref等于一个函数，表示当元素被挂载到页面中之后会立即调用此函数，并传入渲染后的DOM元素



```csharp
import React,{Component} from 'react';
import ReactDOM from 'react-dom';

class Sum extends Component{
    handleChange=(event)=>{
        let a = parseInt(this.a.value||0);
        let b = parseInt(this.b.value||0);
        this.result.value = a+b;
    }
    render(){
        //如果ref等于一个函数，表示当元素被挂载到页面中之后会立即调用此函数，并传入渲染后的DOM元素
        return (
            //经过React封装可以onChange可以写在div上
            <div onChange={this.handleChange}> 
                <input type="text" ref={ref=>this.a=ref} /> +  //这里ref等于一个函数,参数名不是一定是要为ref
                <input type="text" ref={ref=>this.b=ref} /> = 
                <input type="text" ref={ref=>this.result=ref} />
            </div>
            //this指当前类的实例,a表示当前实例的属性，此时this.a就是input这个DOM元素
            //input是非受控组件，因为不受状态控制
        )
    }
}

ReactDOM.render(<Sum/>,window.app)
```

以下代码看上去感觉input是受控组件，但是如果 input 的 value 是 **undefined** ，则这个input是**非受控组件**。



```tsx
<input type="text" value={this.state.index===-1?undefined:'1'} />
```

#### 如果一个非受控组件被变成受控组件，浏览器会警告用户

![img](https:////upload-images.jianshu.io/upload_images/18883049-ffd98a7b6b0ed26a.png?imageMogr2/auto-orient/strip|imageView2/2/w/640/format/webp)

警告用户在 input 生命周期内不可以在非受控组件和受控组件之间切换

代码如下



```jsx
import React,{Component} from 'react';
import jsonp from 'jsonp';
export default class Suggest extends Component{
    constructor(){
        super();
        this.state = {
            words:[],
            index:-1, //索引
        };
    }
    /**
     * https://www.baidu.com/su?wd=a&cb=cb  //联想接口
     * https://www.baidu.com/s?wd=a  //搜索接口
     */
    handleChange=(event)=>{
        let wd = event.target.value;
        this.wd = wd; //缓存搜索的关键字 this.wd是当前实例的自有属性
        jsonp(`https://www.baidu.com/su?wd=${wd}`,{
            param:'cb'
        },(err,data)=>{
            this.setState({
                words:data.s
            })
        })
    }
    handleKeyDown=(event)=>{
        let code = event.keyCode;
        if(code===38 || code===40){
            let index = this.state.index;
            if(code===38){
                index--;
                if(index<-1){
                    index=this.state.words.length-1
                }
            }else if(code===40){
                index++;
                if(index>=this.state.words.length){
                    index=-1
                }
            }
            this.setState({index})
        }else if(code===13){
            window.location.href=`https://www.baidu.com/s?wd=${event.target.value}`
        }
    }
    render(){
        return (
            <div className="container">
                <div className="row">
                    <div className="col-sm-8 col-sm-offset-2">
                        <div className="panel panel-default">
                            <input type="text" value={this.state.index===-1?this.wd:this.state.words[this.state.index]} className="form-control" onChange={this.handleChange} onKeyDown={this.handleKeyDown} />
                        </div>
                        <div className="panel-body">
                            <ul className="list-group">
                                {
                                    this.state.words.map((word,index)=>(
                                        <li key={index} className={"list-group-item "+(index===this.state.index?'active':'')}>{word}</li>
                                    ))
                                }
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
```

##### 原因：

因为this.state.index默认是-1，所以input的默认值是this.wd，this.wd是在handleChange函数中被赋值的，而handleChange又是在input的值发生改变后被调用的，所以页面在渲染的时候this.wd为undefined，也就是input的value值为undefined，则这个组件为非受控组件，当输入内容时，this.wd不为undefined了，则input由非受控组件变为受控组件，于是浏览器报如上错误。

##### 解决方案：

防止 input 的初始值为 undefined



```jsx
import React,{Component} from 'react';
import jsonp from 'jsonp';
export default class Suggest extends Component{
    constructor(){
        super();
        this.state = {
            words:[],
            index:-1, //索引
            wd:''
        };
    }
    /**
     * https://www.baidu.com/su?wd=a&cb=cb  //联想接口
     * https://www.baidu.com/s?wd=a  //搜索接口
     */
    handleChange=(event)=>{
        let wd = event.target.value;
        this.setState({wd})
        jsonp(`https://www.baidu.com/su?wd=${wd}`,{
            param:'cb'
        },(err,data)=>{
            this.setState({
                words:data.s
            })
        })
    }
    handleKeyDown=(event)=>{
        let code = event.keyCode;
        if(code===38 || code===40){
            let index = this.state.index;
            if(code===38){
                index--;
                if(index<-1){
                    index=this.state.words.length-1
                }
            }else if(code===40){
                index++;
                if(index>=this.state.words.length){
                    index=-1
                }
            }
            this.setState({index})
        }else if(code===13){
            window.location.href=`https://www.baidu.com/s?wd=${event.target.value}`
        }
    }
    render(){
        return (
            <div className="container">
                <div className="row">
                    <div className="col-sm-8 col-sm-offset-2">
                        <div className="panel panel-default">
                            <input type="text" value={this.state.index===-1?this.state.wd:this.state.words[this.state.index]} className="form-control" onChange={this.handleChange} onKeyDown={this.handleKeyDown} />
                        </div>
                        <div className="panel-body">
                            <ul className="list-group">
                                {
                                    this.state.words.map((word,index)=>(
                                        <li key={index} className={"list-group-item "+(index===this.state.index?'active':'')}>{word}</li>
                                    ))
                                }
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
```

