function A(){
}

const a = new A()
console.log(a._proto_ == Object.prototype);	//false
console.log(a._proto_ == A.prototype);	//false
console.log(a instanceof A)	//true
console.log({} == Object.prototype)	//false
console.log(a instanceof Object);	//true
// console.log(a instanceof Object.prototype);	//这个会抛出错误
console.log(Object.getPrototypeOf(a))	//A{}
