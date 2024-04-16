/**求重复子串的最大长度 'aaaabbbbbccddd' */
function getRepeatStrLen1(s) {
  let map = new Map();
  let max = 0, curentKey = '';
  for(let t of s) {
    if(map.has(t) && curentKey === t){
      map.set(t, map.get(t) + 1)
    } else {
      curentKey = t
      map.set(t, 1)
    }
    max = Math.max(max, map.get(t))
  }

  return max
}

function getRepeatStrLen2(s) {
  let max = 1
  let currentMax = 1
  for(let i = 0; i < s.length - 1; i++ ){
    if(s[i] == s[i + 1]) {
      currentMax++;
    } else {
      currentMax = 1
    }
    max = Math.max(max, currentMax)
  }
  return max
}
console.log(getRepeatStrLen1('aaaaaabbbbb'))


/**爬楼梯 */
/**
 * @description: 
 * @param {*} n
 * @return {*}
 */
function getFlightLen(n) {
  const dp = [];
  dp[0] = 1; // 兜底第2阶
  dp[1] = 1;
  for(let i = 2; i <= n; i++) {
    //dp[2] = dp[1]+dp[0] => 2 = 1 + 1
    dp[i] = dp[i-1] + dp[i-2]
  }

  return dp[n]
}
console.log(getFlightLen(3));


/**
 * @description: 快排
 * @param {*} arr
 * @param {*} right
 * @param {*} pivot
 * @param {array} quickSort
 * @return {*}
 */
function quickSort(arr) {
  if(arr.length <= 1) return arr;

  let pivot = arr[0];
  let left = [], right = [];

  for(let i = 1; i < arr.length; i++) {
    if(arr[i] < pivot) {
      left.push(arr[i])
    } else {
      right.push(arr[i])
    }
  }

  return [...quickSort(left), pivot, ...quickSort(right)]
}


/**
 * @description: 20.有效括号
 * @param {*} s
 * @return {*}
 */
function isValid(s) {
  if(s % 2) return false;
  const stack = []
  const map = new Map([
    ["}", "{"],
    ["]", "["],
    [")", "("]
  ]);

  for(let v of s) {
    if(map.has(v)) {
      if(stack[stack.length - 1] !== map.get(v)) return false
      stack.pop()
    } else {
      stack.push(v)
    }
  }
  return !stack.length;
}
