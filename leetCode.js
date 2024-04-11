/**求重复子串的最大长度 'aaaabbbbbccddd' */
function getRepeatStrLen1(s) {
  let map = new Map();
  let max = 0
  for(let t of s) {
    if(map.has(t)){
      map.set(t, map.get(t) + 1)
    } else {
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
console.log(getRepeatStrLen2('aaaabbbbbccddd'))