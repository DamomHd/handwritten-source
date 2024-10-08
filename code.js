
/*** 数组 <=> 树 ***/
// const tree = {
//     id: '1',
//     name: 'a',
//     children: [
//         {
//             id: '2',
//             name: 'b',
//             children: [
//                 {
//                     id: '3',
//                     name: 'c',
//                     children: []
//                 }
//             ]
//         },
//         {
//             id: '4',
//             name: 'd',
//             children: []
//         }
//     ]
// };

// const flatArray = [
//     { id: '1', name: 'a', pid: null },
//     { id: '2', name: 'b', pid: '1' },
//     { id: '3', name: 'c', pid: '2' },
//     { id: '4', name: 'd', pid: '1' },
//     { id: '5', name: 'e', pid: '2' },
//     { id: '6', name: 'f', pid: '3' }
// ];

// 树 => 数组
function treeToArray(tree, parentId = '', result = []) {
  if(tree) {
    const item = {
        pid: parentId,
        id: tree.id,
        name: tree.name
    }
    result.push(item)
    if(tree.children && tree.children.length) {
      for(let child of tree.children) {
        treeToArray(child, tree.id, result)
      }
    }
  }
}

//  数组 => 树
function arrayToTree(arr, parentId = null) {
const tree = []
for(let i = 0; i < arr.length; i++) {
  const item = arr[i]
  if(item.pid == parentId) {
    const children = arrayToTree(item, item.id);
    if(children.length) {
      item.children = children
    }
    tree.push(item)
  }
}
return tree;
}
function arrayToTree1(arr, parentId = null) {
  return arr.filter(item => item.pid === parentId)
    .map(item => ({
      ...item,
      children: arrayToTree1(arr, item.id)
    }))
}

const flatArray = [
    { id: '1', name: 'a', pid: null },
    { id: '2', name: 'b', pid: '1' },
    { id: '3', name: 'c', pid: '2' },
    { id: '4', name: 'd', pid: '1' },
    { id: '5', name: 'e', pid: '2' },
    { id: '6', name: 'f', pid: '3' }
];

function arrayToTree2(list) {
  const map = new Map();
  const roots = [];
  list.forEach(item => {
    map.set(item.id, {...item, children: []})
  });

  list.forEach(item => {
    if(!item.pid) {
      roots.push(map.get(item.id))
    } else {
      if(map.has(item.pid)) {
        map.get(item.pid).children.push(map.get(item.id))
      }
    }
  })

  return roots
}
// 转换为树形结构
const tree = arrayToTree2(flatArray);
console.log(JSON.stringify(tree, null, 2));

/**  手写sleep */
// 1、通过timeout
function sleep(timer) {
	return new Promise((resolve) => {
		setTimeOut(resolve, timer)
	})
}

// 2、完全阻塞
function sleep(delay) {
	let t = Date.now()
	while (Date.now() - t <= delay) continue;
}

(async () => {
	await sleep(3000)
})()



/**
 * @description: 实现最多并发2个
 * @param {*} this
 * @param {*} resolve
 * @param {*} resolve
 * @param {*} time
 * @param {*} order
 * @return {*}
 */
class Scheduler {
  constructor() {
    this.queue =[]; // 当前任务队列
    this.maxCount = 2; // 最多并发数
    this.runingCount = 0; // 当前并发数
  }

  add(promiseCreator) {
    return new Promise((resolve) => {
      this.queue.push({
        promiseCreator,
        resolve
      })
      this.schedule();
    })
  }
  schedule() {
    if(this.runingCount < this.maxCount &&  this.queue.length ) {
      const {promiseCreator, resolve} = this.queue.shift();
      this.runingCount++; // 开始执行新任务
      promiseCreator().then(() => {
        resolve();
        this.runingCount--; //任务执行完毕后
        this.schedule() // 执行下一个任务
      })
      // this.schedule();
    }
  }
}
const timeout = (time) => new Promise(resolve => {
  setTimeout(resolve, time)
})
const scheduler = new Scheduler()
const addTask = (time, order) => {
  scheduler.add(() => timeout(time)).then(() => console.log(order))
}
addTask(500, '1')
addTask(500, '2')
addTask(500, '3')
addTask(500, '4')
// output: 2 3 1 4


//实现深拷贝


/**
 * @description: 组合多个函数
 * @return {*}
 */
function compose(...fns) {
  if(fns.length == 1) return fns[0]
  return fns.reduce((result, fn) => (...args) => result(fn(...args)))
}

// 函数柯里化
function curry(fn, args) {
  let length = fn.length;

  args = args || []
  return function() {
    const newArgs = [...args, ...arguments];
    if(newArgs.legnth >= length) {
      return fn.apply(this, ...newArgs)
    } else {
      return curry(fn, newArgs)
    }
  }
}

// 假定有一个changeName异步请求，有一个很长的name数组，需要做分片请求，要求分片里的更新是并行的，各个分片间是串行的，这个函数接受三个参数，名字列表，分片的数量，每次分片后的等待时间。

const changeName = name => new Promise((resolve, reject) => {
   setTimeout(() => resolve(name), 1000);
 });
 const sleep = secs => new Promise((resolve, reject) => {
    setTimeout(resolve, secs);
 });

const slicePostTask = async(names, chunkSize, waitingSecs) => {
  for(let i = 0; i < names.length; i + chunkSize -1) {
    await sleep(waitingSecs)
    const runArr = names.splice(i, chunkSize)
    const fn = runArr.map(name => changeName(name))
    const res = await Promise.all(fn)
    console.log(res)
  }
};

slicePostTask(['aa', 'bb', 'cc', 'dd', 'ee', 'ff', 'gg', 'hh'], 2, 2000);
// =>  [ 'aa', 'bb' ]
// waiting 2 seconds
// =>  [ 'cc', 'dd' ]
// waiting 2 seconds
// => [ 'ee', 'ff' ]
// waiting 2 seconds
// => [ 'gg', 'hh' ]




function timeout(time) {
  return new Promise(resolve => {
      setTimeout(() => {
          resolve();
      }, time);
   });
}
function addTask(time, name) {
  superTask.add(() => timeout(time)).then(() => {
      console.log(`任务${name}完成`);
  });
}



class SuperTask {
  constructor() {
    this.limit = 2;
    this.count = 0; // 当前执行任务数
    this.tasks = [];
  }

  add(task) {
    this.tasks.push(task);
    this.runTask()
  }

  runTask() {
    if(this.limit > this.count){
      this.count++;
      const task = this.tasks.shift();
      task().then(() => {
        this.count--;
        this.runTask()
      })
    }
  }
}
const superTask = new SuperTask();

addTask(10000, 1); // 10000ms后输出 任务1完成
addTask(5000, 2); // 5000ms后输出 任务1完成
addTask(3000, 3); // 8000ms后输出 任务3完成
addTask(4000, 4); // 11000ms后输出 任务4完成
addTask(5000, 5); // 15000ms后输出 任务5完成



/**
 * @description: 微信发红包伪代码
 * @param {*} totalAmount
 * @param {*} numPeople
 * @return {*}
 */
function generateRandomAmount(totalAmount, numPeople) {
  let min = 1; // 每个人至少能领取1分钱
  let result = [];

  for (let i = 0; i < numPeople - 1; i++) {
      // 生成一个介于min和max之间的随机数
      let max = totalAmount - numPeople + i + 1; // 更新max的计算方式  至少保证每个人都能有1分钱
      let amount = Math.floor(Math.random() * (max - min + 1)) + min;
      result.push(amount);
      totalAmount -= amount;
  }

  // 最后一个人领取剩下的金额
  result.push(totalAmount);
  return result;
}

console.log(generateRandomAmount(100, 5));




/**
 * @description: 实现loadsh get方法
 * @param {*} obj
 * @param {*} path
 * @param {*} defaultValue
 * @return {*}
 */
function loadshGet(obj, path, defaultValue) {

  let keys = typeof path === 'string' ? path.split('.') : path;

  let result = obj;

  for(let k of keys) {
    if(result[k]) {
      result = result[k]
    } else {
      result = defaultValue
    }
  }
  return result
}
var object = { a: { b: { c: 3 } } };;
console.log(loadshGet(object, ['a','b','c']), loadshGet(object, 'a.b.c'))


function deepClone(obj, map = new WeakMap()) {
  if (typeof obj !== 'object' || obj === null) {
    return obj; // 基本类型直接返回
  }

  if (map.has(obj)) {
    return map.get(obj); // 遇到循环引用，直接返回已复制的对象
  }

  let clone;
  if (Array.isArray(obj)) {
    clone = []; // 复制数组
  } else {
    clone = {}; // 复制对象
  }

  map.set(obj, clone); // 将原始对象和复制对象放入 Map 中

  for (let key in obj) {
    console.log(key)
    if (obj.hasOwnProperty(key)) {
      clone[key] = deepClone(obj[key], map); // 递归复制属性
    }
  }

  return clone;
}

// // 测试
// const obj = [{
//   name: 'John',
//   friend: null
// }];

// obj.friend = obj;

// const copiedObj = deepClone(obj);

// console.log('copiedObj:', JSON.stringify(copiedObj)); // 输出正确的拷贝结果


// 字节 如何让 var [a, b] = {a:1, b:2}
// Object.prototype[Symbol.iterator] = function () {
//   return Object.values(this)[Symbol.iterator]();
// }



// 数组去重的几种方式
/**
 * Set() + Array.form()
 * 两层循环 + splice
 * 数组indexOf
 * includes
 * filter + indexOf
 * Map
 */

//  数组扁平化
/**
 * 递归
 * reduce
 * 扩展运算符
 * toString split
 * es6 flat
 * 正则 json
 */
function flatten(arr) {
  return arr.reduce((p, c) => {
    return p.concat(Array.isArray(c) ? flatten(c): c)
  })
}

//对象扁平化
/* 题目*/
// var entryObj = {
//   a: {
//       b: {
//           c: {
//                   dd: 'abcdd'
//           }
//       },
//       d: {
//           xx: 'adxx'
//       },
//       e: 'ae'
//   }
// }

// // 要求转换成如下对象
// var outputObj = {
// 'a.b.c.dd': 'abcdd',
// 'a.d.xx': 'adxx',
// 'a.e': 'ae'
// }

function flattenObject(obj) {
  const result = {}
  function traverse(obj, prefix = '') {
    for(const key in obj) {
      if(typeof obj[key] === 'object') {
        // 对象 递归
        traverse(obj[key], prefix ? `${prefix}.${key}` : key)
      } else {
        //基本类型
        result[prefix ? `${prefix}.${key}`: key] = obj[key]
      }
    }
  }

  traverse(obj)
  return result
}

var entryObj = {
  a: {
    b: {
      c: {
        dd: 'abcdd'
      }
    },
    d: {
      xx: 'adxx'
    },
    e: 'ae'
  }
};

var outputObj = flattenObject(entryObj);
console.log(outputObj);


// 下划线转驼峰
function camelCase(str) {
  return str.replace(/([-_])(a-z)/g, function(match, group1, group2){
    return group2.toUpperCase();
  })
}


class Log {
  constructor() {

  }

  async log(message) {
    const timestamp = new Date().toLocaleString();;
    console.log(`${message} ${timestamp}`);
    return this;
  }

  sleep(ms) {
    // const d = new Date().getTime();
    // while(true) {
    //   let date = new Date().getTime();
    //   if(date - d === ms) {
    //     return this;
    //   }
    // }
    return new Promise(resolve => setTimeout(resolve, ms)).then(() => this);
  }
}

// 使用示例
const l = new Log();
l.log(1).log(2).sleep(1000).log(3).sleep(500).log(4);


// 实现一串数字转换成 带逗号 小数点的字符串
function formatNumber(number) {
  const numStr = Math.abs(number).toString();
  const [integerPart, decimalPart] = numStr.split('.');
  
  let formattedInteger = '';
  for (let i = 0; i < integerPart.length; i++) {
      if (i > 0 && (integerPart.length - i) % 3 === 0) {
          formattedInteger += ',';
      }
      formattedInteger += integerPart[i];
  }
  const absNum = formattedInteger + (decimalPart ? '.' + decimalPart : '')
  return number < 0 ? '-' + absNum : absNum;
}

console.log(formatNumber(123456789.987))
console.log(formatNumber(-987654321.123))