const mypromise = Promise.resolve(Promise.resolve('Promise!'))

function one() {
    setTimeout(() => {
        console.log('timeout 1')
    }, 0)
    mypromise.then(console.log).then(console.log)
    console.log('last line1')
}
async function two() {
    const res = await mypromise
    setTimeout(() => {
        console.log('timeout 2')
    }, 0)
    console.log('two', await res)
    console.log('last line2')
}

two()
one()
// ❌
//last line1
//Promise
//timeout 1
//two
//last line2
//timeout 2

// 正确
//last line1
// Promise!
// two Promise!
// last line2
// timeout 1
//timeout 2


async function async1() {
  console.log('async1 start')
  await async2()
  console.log('async1 end')
}
async function async2() {
  console.log('async2')
}
console.log('script start')
setTimeout(function () {
  console.log('setTimeout')
}, 0)

async1()
new Promise((resolve) => {
  console.log('promise1')
  resolve()
}).then(function () {
  console.log('promise2')
})
console.log('script end')

// ❌
// script start
// async1 start
// promise1
// script end
// async2
// async1 end
// promise2
// setTimeout

//正确
// script start
// async1 start
// async2
// promise1
// script end
// async1 end
// promise2
// setTimeout