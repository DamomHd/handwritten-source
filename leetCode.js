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
function getFlightLen(n) {
  const dp = [];
  dp[0] = 1;
  dp[1] = 1;
  for(let i = 2; i <= n; i++) {
    //dp[2] = dp[1]+dp[0] => 2 = 1 + 1
    dp[i] = dp[i-1] + dp[i-2]
  }

  return dp[n]
}
console.log(getFlightLen(3));