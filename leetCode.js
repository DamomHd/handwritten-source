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




// 数组三数最大乘积
var maximumProduct = function(nums) {
  nums.sort((a, b) => a- b);
  const n = nums.length;
  return Math.max(nums[0] * nums[1] * nums[n -1], nums[n-3] * nums[n-2] * nums[n-1])
};
console.log(maximumProduct([-2,-4,-3,2,3]))


// 给你两个按 非递减顺序 排列的整数数组 nums1 和 nums2，另有两个整数 m 和 n ，分别表示 nums1 和 nums2 中的元素数目。
// 请你 合并 nums2 到 nums1 中，使合并后的数组同样按 非递减顺序 排列。
// 注意：最终，合并后数组不应由函数返回，而是存储在数组 nums1 中。为了应对这种情况，nums1 的初始长度为 m + n，其中前 m 个元素表示应合并的元素，后 n 个元素为 0 ，应忽略。nums2 的长度为 n 

// var merge = function(nums1, m, nums2, n) {
//   nums1.splice(m, nums1.length - m, ...nums2)
//   nums1.sort((a,b) => a - b)
// }

var merge = function (nums1, m, nums2, n) {
  let p1 = 0, p2 = 0;
  let sorted = new Array(m + n).fill(0);
  let cur;
  while (p1 < m || p2 < n) {
      if (p1 === m) {
          cur = nums2[p2++]
      } else if (p2 == n) {
          cur = nums1[p1++]
      } else {
          cur = nums1[p1] < nums2[p2] ? nums1[p1++] : nums2[p2++]
      }

      sorted[p1 + p2 - 1] = cur;
  }

  for (let i = 0; i < m + n; i++) {
      nums1[i] = sorted[i]
  }
};


// 移除元素
var removeElement = function(nums, val) {
  let ans = 0;
  for(const num of nums) {
    if(num !== val) {
      nums[ans] = num;
      ans++
    }
  }
  return ans
};


// 19. 删除链表的倒数第N个节点
var removeNthFromEnd = function (head, n) {
  let pre = new ListNode();
  pre.next = head;
  let start = pre, end = pre;

  while(n != 0) {
    start = start.next;
    n--;
  }

  while(start.next != null) {
    start = start.next;
    end = end.next;
  }

  end.next = end.next.next;
  return pre.next
}
