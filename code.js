
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
      this.schedule();
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
addTask(1000, '1')
addTask(500, '2')
addTask(300, '3')
addTask(400, '4')
// output: 2 3 1 4


//实现深拷贝
