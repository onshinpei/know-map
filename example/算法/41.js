/**
给你一个未排序的整数数组，请你找出其中没有出现的最小的正整数。
示例 1:
输入: [1,2,0]
输出: 3
示例 2:

输入: [3,4,-1,1]
输出: 2
示例 3:

输入: [7,8,9,11,12]
输出: 1
 

提示：
你的算法的时间复杂度应为O(n)，并且只能使用常数级别的额外空间。

 */
/**
 * @param {number[]} nums
 * @return {number}
 */
var firstMissingPositive = function (nums) {
  var increment = 0
  nums = nums.sort(function (a, b) {
    return a - b
  })
  while (nums.length) {
    var num = nums.shift()
    if (num <= 0) {
      continue
    }
    if (nums.length) {
      if (increment + 1 === num) {
        increment += 1
        continue
      } if (increment === num) {
        continue
      } else {
        break
      }
    } else {
      if (increment + 1 === num) {
        increment += 1
      }
    }
  }
  return increment + 1
};

// console.log(firstMissingPositive([1, 2, 0]))
console.log(firstMissingPositive([3, 4, -1, 1]))
// console.log(firstMissingPositive([7, 8, 9, 11, 12]))
// console.log(firstMissingPositive([-1, 4, 2, 1, 9, 10]))


var firstMissingPositive2 = function (nums) {
  let len = nums.length + 2
  for (var i = 1; i < len; i++) {
    if (!nums.includes(i)) {
      return i
    }
  }
  return 1
}

console.log(firstMissingPositive2([1, 2, 3]))