
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
