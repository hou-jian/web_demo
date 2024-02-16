// 无需 export 导出

// 计算阶乘
function factorial(n) {
  if(n <= 1) return 1;
  const middle = Math.ceil(n / 2);    //取中间值
  let tmp = middle * middle,
    result = n & 1 == 1 ? middle : middle * n;  //奇偶数的基础乘数规律不同
  for(let i = 1; i <= n - 2; i += 2) {   //连续减奇数得出各项乘数
    tmp -= i;
    result = BigInt(result) * BigInt(tmp);
  }
  return result.toString();
}


