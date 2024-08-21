/*
 * @Descripttion: Vincent
 * @version: v1.0
 * @Author: hongda_huang
 * @Date: 2020-11-16 11:20:25
 * @LastEditors: Damom Hd 33109486+DamomHd@users.noreply.github.com
 * @LastEditTime: 2024-08-21 07:30:13
 * @description:
 */

/**
 * @description: ES5实现数组map方法
 * @param {*}
 * @return {*}
 * @Date: 2020-11-16 11:22:21
 */
Array.prototype.myMap = function (fn, context) {
    var arr = Array.prototype.slice.call(this) //
    var mapArr = []
    for (var i = 0; i < arr.length; i++) {
        mapArr.push(fn.call(context, arr[i], i, this))
    }
    return mapArr
}

/**
 * @description: ES5实现数组的reduce方法
 * @param {*}
 * @return {*}
 * @Date: 2020-11-16 11:30:25
 */
Array.prototype.myReduce = function (fn, initVal) {
    var arr = Array.prototype.slice.call(this)
    var res, startIndex
    res = initVal ? initVal : arr[0]
    startIndex = initVal ? 0 : 1
    for (var i = startIndex; i < arr.length; i++) {
        res = fn.call(null, res, arr[i], i, this)
    }
    return res
}

/**
 * @description: 实现call
 * @param {*}
 * @return {*}
 * @Date: 2020-11-16 11:43:32
 */
Function.prototype.myCall = function (context = window, ...args) {
    //将当前调用的方法定义在func上 为了能以对象调用的形式绑定this
    context.func = this
    //以对象调用的形式调用func，此时this指向context 也就是传入的需要绑定的this指向
    const res = context.func(...args)
    //删除方法 不然会影响引入的对象
    delete context.func

    return res
}

/**
 * @description: 实现apply
 * @param {*}
 * @return {*}
 * @Date: 2020-11-16 11:43:32
 */
Function.prototype.myApply = function (context = window, args) {
    //将当前调用的方法定义在func上 为了能以对象调用的形式绑定this
    context.func = this
    //以对象调用的形式调用func，此时this指向context 也就是传入的需要绑定的this指向
    const res = context.func(args)
    //删除方法 不然会影响引入的对象
    delete context.func

    return res
}

/**
 * @description: 实现bind方法
 * 普通函数 绑定this指向
 * 构造函数 保证原函数的原型对象上的属性不能丢失
 * @return {*}
 * @Date: 2020-11-16 11:54:28
 */
Function.prototype.myBind = function (context = window, ...args) {
    context.fnc = this;
    return function () {
        const res = context.fnc(...args, ...arguments)
        delete context.fnc;
        return res
    }
}

/**
 * @description: 实现Object.create
 * @param {*}
 * @return {*}
 * @Date: 2020-11-16 15:14:49
 */
function objectCreate(proto) {
    function F() {}
    F.prototype = proto
    F.prototype.constructor = F
    return new F()
}

/**
 * @description: 实现new关键字
 * 创建一个全新对象  对象的__proto__指向构造函数的原型对象
 * 执行构造函数
 * 返回为object类型则作为new方法的返回值返回  否则返回上述全新对象
 * @Date: 2020-11-16 15:18:00
 */
function myNew(fn, ...args) {
    let instance = Object.create(fn.prototype)
    let res = fn.apply(instance, args)
    return typeof res === 'object' ? res : instance
}

/**
 * @description: 实现instanceof
 * @param {*} left
 * @param {*} right
 * @return {*}原型链向上查找
 * @Date: 2020-12-01 19:47:32
 */
function myInstanceof(left, right) {
    if (typeof left !== 'object' || left === null) return false
    let proto = Object.getPrototypeOf(left)
    while (true) {
        if (proto === null) return false
        if (proto === right.prototype) return true
        proto = Object.getPrototypeOf(proto)
    }
}
/**
 * @description: 实现单例模式（核心要点: 用闭包和Proxy属性拦截）
 * @param {*} func
 * @return {*}
 * @Date: 2020-12-01 20:00:42
 */
function proxy(func) {
    let instance
    let handle = {
        construct(target, args) {
            if (!instance) {
                instance = Reflect.construct(func, args)
            }
            return instance
        },
    }
    return new Proxy(func, handle)
}
/**
 * @description: 防抖（如果在定时器的时间范围内再次触发，则重新计时。）
 * @param {*} fn
 * @param {*} delay 延时
 * @return {*}
 * @Date: 2020-12-01 20:04:54
 */
function debouce(fn, delay) {
    let timer = null
    return (...args) => {
        clearTimeout(timer) //不断触发则清空重新计时
        timer = setTimeout(() => {
            fn.apply(this, args)
        }, delay)
    }
}
/**
 * @description: 防抖 支持立即执行
 * @param {*} fn
 * @param {*} wait
 * @param {*} immidate
 * @return {*}
 * @Date: 2021-03-19 15:48:06
 */
function doubouce1(fn,wait,immidate){
    let timer = null;

    return function (){
        let args = arguments;
        let context = this;
        //每次触发 先清空定时器重新计算时间
        timer&&clearTimeout(timer)
        // 如果存在首次执行字段
        if(immidate){
            // 判断当前是否第一次执行过了 
            let callNow = !timer;
            // 执行一次空的定时器  如果清空过程中再次执行了 则清空掉
            timer = setTimeout(function(){
                timer = null;
            },wait)
            // 如果是第一次执行 则直接执行回调hook
            if(callNow){
                fn.apply(context,args)
            }
        }
        else{
            timer = setTimeout(function(){
                fn.apply(context,await)
            })
        }
    }
}

/**
 * @description: 节流（如果在定时器的时间范围内再次触发，则不予理睬，等当前定时器完成，才能启动下一个定时器。）
 * @param {*} fn
 * @param {*} delay
 * @return {*}
 * @Date: 2020-12-01 20:10:38
 */
function throttle1(fn, delay) {
    let flag = true
    return (...args) => {
        if (!flag) return //定时器执行中，直接返回 等待
        flag = false
        setTimeout(() => {
            fn.apply(this, args)
            flag = true
        }, delay)
    }
}
/**
 * @description: 节流
 * @param {*} fn
 * @param {*} delay
 * @return {*}
 * @Date: 2021-03-19 11:27:10
 */
function throttle2(fn,delay = 500){
    let timer = null;   
    let startTime = Date.now();
    return function(...args){
        let context = this;
        let curTime = Date.now();
        let remaining = delay - (curTime - startTime); //距离下一次执行还需要多久  小于0说明已经过了设定的延迟时间 直接执行回调 大于0则
        timer&&clearTimeout(timer);
        if(remaining<=0){
            fn.apply(context,args)
            startTime = Date.now()
        }
        else{
            timer = setTimeout(fn,remaining)
        }
    }
}
/**
 * @description: 符合Promise A+规范
 * @param {*} fn
 * @return {*}
 * @Date: 2020-12-07 16:30:04
 */
const PEDNING = 'pending' //等待
const FULFILLED = 'fulfilled' //成功
const REJECTED = 'rejected' //失败
function myPromise(fn) {
    //缓存当前promise原型
    let self = this
    self.status = PEDNING
    self.onFulfilledCallbacks = [] //成功
    self.onRejectedCallbacks = [] //失败

    const resolve = (value) => {
        if (status !== PEDNING) return
        setTimeout(() => {
            self.status = FULFILLED
            self.value = value
            self.onFulfilledCallbacks.forEach((callback) =>
                callback(self.status)
            ) //执行resolve成功回调
        })
    }

    const reject = (error) => {
        if (status !== PEDNING) return
        setTimeout(() => {
            self.status = REJECTED
            self.error = error
            self.onRejectedCallbacks.forEach((callback) => callback(self.error)) //执行resolve成功回调
        })
    }

    fn(resolve, reject)
}
function resolvePromise(bridgePromise, promise, resolve, reject) {
    if (promise instanceof myPromise) {
        if (promise.status === PEDNING) {
            promise.then(
                (x) => {
                    resolvePromise(bridgePromise, x, resolve, reject)
                },
                (error) => {
                    reject(error)
                }
            )
        } else {
            promise.then(resolve, reject)
        }
    } else {
        resolve(promise)
    }
}
myPromise.prototype.then = function (onFulfilled, onRejected) {
    let { status, value, error } = this
    let self = this
    let bridgePromise
    onFulfilled =
        typeof onFulfilled === 'function' ? onFulfilled : (value) => value
    onRejected =
        typeof onRejected === 'function'
            ? onRejected
            : (error) => {
                  throw error
              }
    if (status === PEDNING) {
        this.onFulfilledCallbacks.push(onFulfilled)
        this.onRejectedCallbacks.push(onRejected)

        return (bridgePromise = new myPromise((resolve, reject) => {
            self.onFulfilledCallbacks.push((value) => {
                try {
                    resolve(onFulfilled(value))
                } catch (e) {
                    reject(e)
                }
            })

            self.onRejectedCallbacks.push((error) => {
                try {
                    resolve(onRejected(error))
                } catch (e) {
                    reject(e)
                }
            })
        }))
    } else if (status === FULFILLED) {
        return (bridgePromise = new myPromise((resolve, reject) => {
            //模拟微任务
            setTimeout(() => {
                try {
                    let x = onFulfilled(value)
                    resolvePromise(bridgePromise, x, resolve, reject)
                } catch (e) {
                    reject(e)
                }
            })
        }))
    } else {
        return (bridgePromise = new myPromise((resolve, reject) => {
            //模拟微任务
            setTimeout(() => {
                try {
                    let x = onRejected(error)
                    resolvePromise(bridgePromise, x, resolve, reject)
                } catch (e) {
                    reject(e)
                }
            })
        }))
    }
}

myPromise.prototype.catch = function (onRejected) {
    return this.then(null, onRejected)
}

myPromise.resolve = (param) => {
    if (param instanceof myPromise) return param
    return new myPromise((resolve, reject) => {
        if (param && param.then && typeof param.then === 'function') {
            param.then(resolve, reject)
        } else {
            resolve(param)
        }
    })
}

myPromise.reject = function (resason) {
    return new myPromise((resolve, reject) => {
        reject(resason)
    })
}

//实现 Promise.prototype.finally
myPromise.prototype.finally = function (callback) {
    this.then(
        (value) => {
            return myPromise.resolve(callback()).then(() => {
                return value
            })
        },
        (error) => {
            return myPromise.resolve(callback()).then(() => {
                throw error
            })
        }
    )
}

myPromise.all = function (promises) {
    return new myPromise((resolve, reject) => {
        let res = []
        let index = 0
        let len = promises.length
        if (len === 0) {
            resolve(res)
            return
        }

        for (let i = 0; i < len; i++) {
            myPromise.resolve(promises[i]).then((result) => {
                res[i] = result
                indexi++
                if (index === len) resolve(res)
            }).catch((error) => {
                reject(error)
            })
        }
    })
}

/**
 * @description: 
 * 一旦某个promise触发了resolve或者reject，就直接返回了该状态结果，
 * 并不在乎其成功或者失败
 * @param {*}
 * @return {*}
 * @Date: 2020-12-07 18:54:24
 */
myPromise.race = function(promises) {
    return new myPromise((resolve,reject)=>{
        let len = promises.length
        if(len === 0) return 
        for(let i = 0;i<len;i++){
            myPromise.resolve(promises[i]).then(result=>{
                resolve(result)
                return 
            }).catch(error =>{
                reject(error)
                return 
            })
        }
    })
}
/**
 * @description: 
 * 当Promise列表中的任意一个promise成功resolve则返回第一个resolve的结果状态 
 * 如果所有的promise均reject，则抛出异常表示所有请求失败
 * @param {*}
 * @return {*}
 * @Date: 2020-12-07 18:54:00
 */
myPromise.any = function(promises) {
    return new myPromise((resolve,reject)=>{
        let len = promises.length
        let index = 0
        if(len === 0) return 
        for(let i = 0;i<len;i++){
            myPromise.resolve(promises[i]).then(result=>{
                resolve(result)
                return 
            }).catch(error =>{
                index++
                if (index === len) reject(error)
            })
        }
    })
}


// 测试




// 实现 KOA
const http  = require('http');

function compose(middlewares) {
    return ctx => {
        const dispatch = (i) => {
            const middleware = middlewares[i];
            if(i = middlewares.length) return;

            return  middleware(ctx, () => dispatch(i + 1));
        }

        return dispatch(0)
    }
}

class Context {
    constructor(req, res) {
        this.req = req
        this.res = res
    }
}

class Application {
    constructor() {
        this.middlewares = []
    }

    listen(...args) {
        const server = http.createServer(this.callback())
        server.listen(...args)
    }

    callback(){
        return async (req, res) => {
            const ctx = new Context(req, res);
            const fn = compose(this.middlewares);
            try{
                await fn(ctx)
            } catch(e){
                ctx.res.statusCode = 500;
                ctx.res.end('error')
            }
            ctx.res.end(ctx.body)
        }
    }

    use(middleware) {
        this.middlewares.push(middleware)
    }
}