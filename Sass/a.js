function newOperator(target,...args){
	if(typeof target !== 'function'){
		throw new TypeError('type error')
	}

	const obj = Object.create(target.prototype)
	const result = target.apply(obj,args)
	const isObeject = typeof result == 'object' && result != null
	const isFunction = typeof result == 'function'

	return isObeject || isFunction ? result : obj
}

function parsestring(str,obj){
	Object.keys(obj).forEach(key => {
		str = str.replace(new RegExp(`{{${key}}}`,'g'),obj[key])
	})
	return str
}

function debounce(fn,delay){
	let timer = null
	return function(){
		let args = arguments,
			that = this
		if(!timer ){
			clearTimeout(timer)
			timer = setTimeout(fn.apply(that,args),delay)
			timer = null
		}
	}
}

function throttle(fn,delay){
	let previous = 0
	return function(){
		let args = arguments,
			that = this,
			now = new Date()
			if(now - previous > delay){
				fn.apply(that,args)
				previous = now
			}
	}
}

function add(){
	let args = [...arguments]

	let _addr = function(){
		args = args.concat([...arguments])
		return _addr
	}
	_addr.toString = function(){
		args.reduce( (prev,cur) => {
			return prev + cur
		},0)
	}
	return _addr
}


function countFloatNumber(a,b){
	let aa = numSplit(a),
		bb = numSplit(b),
		alen = aa[1].length,
		blen = bb[1].length,
		sum = Number(aa[1])*Number(bb[1])
	sum = sum / 10 **(alen+blen)
	return sum
}

function numSplit(str){
	return str.toString().split('.')
}

function deepClone(target){
	let type = judgeType(target)
	if(type == 'Oject'){
		let obj = {}
	}else if( type == 'Array'){
		let obj = []
	}else{
		return target
	}

	if(obj == 'Object'){
		for(let key in target){
			obj[key] = deepClone(target[key])
		}
	}
	if(obj == 'Array'){
		for(let i = 0 ; i< target.length;i++){
			obj.push(deepClone(target[i]))
		}
	}

	return obj

}

function judgeType(obj){
	return Object.prototype.toString.call(obj).slice(8,-1)
}

(function(){
	let html = document.documentElement,
		clientHeight = html.clientHeight,
		clientWidth = html.clientWidth,
	//假设box是某个div盒子的id对象
		height = box.style.height,
		width = box.style.width

	box.style.position = 'absolute'
	box.style.top = (clientHeight - height)/2 +'px'
	box.style.left = (clientWidth- width) /2 + 'px'
	box.style.textAlign = 'center'

})()


let result = arr.flat(Infinity)

let result1 = []

const arrFlat = (arr) => {
	if(Array.isArray(arr)){
		arrFlat(arr)
	}else{
		result1.push(arr)
	}
}

arrFlat(arr)

let arr =[1,2,3,[4,5,6,[7,8,9]]]

const reduceFlat = (arr) =>{
	return  arr.reduce((prev,cur)=>{

	return prev.concat(Array.isArray(cur) ? reduceFlat(cur) : cur)
},[])
}

JSON.parse(JSON.stringify(str).replace(/\[|\]/g,'').split(','))

arr = arr.toString().split(',')

Array.prototype.myForEach = function(fn){
	let arr = this,
		len = arr.length,
		args = arguments[1] || window
	for(let i = 0 ;i < len ;i++){
		fn.apply(args,[arr[i],i,arr])
	}
}

Array.prototype.myMap =function(fn){
	let arr = this,
		len = arr.length,
		args = arguments[1] || window,
		newArr = [],
		item
		for(let i = 0 ;i < len;i++){
			item = deepClone(arr[i])
			newArr.push(fn.apply(args,[item,i,arr]))
		}
		return newArr
}

Array.prototype.myFilter = function(fn){
	let arr = this,
		len = arr.length,
		args = arguments[1] || window,
		newArr = [],
		item
	for(let i = 0 ;i < len ;i++){
		item = deepClone(arr[i])
		fn.apply(args,[item,i,arr]) ? newArr.push(item) : ""
	}
	return newArr
}


Array.prototype.myReduce = function(fn,initValue){
	let arr = this,
		len = arr.length.
		args =arguments[2] || window,
		newArr = [],
		item
		for(let i = 0 ;i < len ;i++){
			item = deepClone(arr[i])
			initValue = fn.apply(args,[args,item,i,arr])
		}
		return initValue
}


function find(arr){
	let i = 0 ,newArr = [],len=arr.length
	while(i < len){
		let s = i+1,temp = []
		temp.push(arr[i])
		while(s < len && arr[i] == arr[s] -1){
			temp.push(arr[s])
			++s
			++i
		}
		newArr.push(temp)
		i = s
	}
	return newArr
}

class EventEmit{
	constructor(){
		this._event = {}
	}
	on(event,callback){
		let callbacks = this._event[event] || []
		callbacks.push(callback)
		this._event[event] = callbacks
		return this
	}
	off(event,callback){
		let callbacks = this._event[event]||[]
		this._event[event] = callbacks && callbacks.filter(fn => fn != callback)
		return this
	}
	emit(...args){
		let event = args[1],
			params = args.slcie(1)
		let callbacks = this._event[event]
		callbacks.forEach(fn => fn.apply(params))
	}
	once(event,callback){
		let wrap = (...args) => {
			callback(...args)
			this.off(event,wrap)
		}
		this.on(event,wrap)
		return this
	}
}

Function.prototype.myCall = function(context = window,...args){
	if(typeof this != 'function'){
		throw new TypeError('type error')
	}
	let fn = Symbol('fn')
	context[fn] = this
	const result = context[fn](args)
	delete context[fn]
	return result

}

Function.prototype.myApply = function(context=window,...args){
	if(typeof this != 'function'){
		throw new TypeError('type error')
	}
	let fn = Symbol('fn')
	context[fn] = this
	const result = context[fn](args)
	delete context[fn]
	return result
}


Function.prototype.myBind = function(context=window,...args){
	if(typeof this != 'function'){
		throw new TypeError('type error')
	}
	let self = this
	return function F(){
		if(this instanceof F){
			return new self([...args,...arguments])
		}
		return self.apply(context,[...args,...arguments])
	}
}

function myInstanceOf(left,right){
	left = left._proto_
	right = right.prototype
	while(left){
		if(left === null){
			return false
		}
		if(left === right){
			return true
		}
		left = left._proto_
	}
}

function Parent(name,age){
	this.name = name
	this.age = age
}
Parent.prototype.say = function(){
	console.log(this.name,this,age);
}

//借用构造函数继承
function Child(name,age,sum){
	Parent.call(name,age)
	this.sum = sum
}

function Child1(){

}
Child.prototype = new Parent()

function Child2(name,age,sum){
	Parent.call(name,age)
	this.sum = sum
}

Child2.prototype = new Parent()

function inherit(obj){
	function F(){}
	F.prototype = obj
	return new F()
}

function Child3(sum){
	this.sum = sum
	let temp = inherit(new Parent())
	temp.say()
}

//寄生继承
function inheit(obj){
	function F(){}
	F.prototype = obj
	return new F()
}

function container(obj){
	let temp = inheit(obj)
	temp.name = 'hello'
	return temp
}

let c = container(new Parent())

//寄生组合
function inherit(obj){
	function F(){}
	F.prototype = obj
	return new F()
}
let c = inherit(Parent.prototype)
function Child4(name,age){
	Parent.call(this,name,age)
}
Child4.prototype = c
c.constructor = Child4

const is = (x,y) =>{
	if(x === y){
		return x !== 0 || y !== 0 || 1/x == 1/y
	}else{
		return x !==x && y !== y
	}
}

class MyPromise{
	constructor(callback){
		this.status = 'pending'
		this.s_result = null
		this.f_result = null
		this.query = []
		callback(
			(args) => {
				this.status = 'fulfilled'
				this.s_result = args
				this.query.forEach( item => {
					item.resolve(args)
				})
			},
			(args) => {

				this.status = 'rejected'
				this.f_result = args
				this.query.forEach(item => {
					item.reject(args)
				})
			})
	}
	then(resolve,reject){
		if(this.status == 'fulfilled'){
			resolve(this.s_result)
		}else if(this.status == 'rejected'){
			reject(this.f_result)
		}else{
			this.query.push({resolve,reject})
		}
	}
}

class Scheduler{
	constructor(){
		this.queue = []
		this.maxCount = 2 
		this.runcount = 0
	}
	add(task){
		this.queue.push(task)
	}
	start(){
		for(let i = 0 ;i <maxCount;i++){
			this.requst()
		}
	}
	request(){
		if(!this.queue || this.queue.length ||this.runcount > this.maxCount ){
			return 
		}
		this.queue.unshift()().then( () =>{
			this.runcount--
			this.request()
		})
	}
}
const timer = delay => new Promise((resolve,reject) => {
	setTimeout(resolve,delay)
})
const s = new Scheduler()
const addTask = (delay,order) => {
	s.add(() =>{
		timer(delay).then( ()=>{
			console.log(order);
		})
	})
}
addTask(1000, '1')
addTask(500, '2')
addTask(300, '3')
addTask(400, '4')

scheduler.taskStart()
Prmise.prototype.myRace = function(promiseArr){
	return new Promise((resolve,reject) => {
		promiseArr.forEach(p =>{
			Promise.resolve(p).then(val => resolve(val),err=>reject(err))
		})
	})
}

Promise.prototype.myAll =function(promiseArrr){
	return new Promise( (resolve,reject) => {
		let ans = [],index = 0
		for(let i =0 ;i < promiseArr.length;i++){
			promiseArr[i].then(result =>{
				ans[i] = result
				index++
				if(index == promiseArr.length){
					resolve(ans)
				}
			})
			.catch(err =>{
				reject(err)
			})
		}
	})
}

function findkthLargetset(nums,k){
	targetquick(nums,nums.length-k)
}
function targetquick(nums,k) {
	return quickSort(nums,0,nums.length-1,k)
}

function quickSort(nums,left,right,k){
	let index
	if(left <right){
		if(index == k){
			return nums[index]
		}else if(index <k){
			quickSort(nums,index+1,k)
		}
	}
}