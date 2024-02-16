// worker导入其它模块的方式
importScripts('./utils.js')
// worker 全局对象是 self；
// 监听 message 事件，拿到主线程发送来的数据
// (同样可以通过 addEventListener 监听事件)
self.onmessage = function(e) {
  const { type, payload } = e.data
  switch(type) {
    case 'factorial':
      // 向主线程发送数据
      self.postMessage({
        msg: payload.number + ' 阶乘计算完毕',
        payload: { number: factorial(payload.number) }
      })
      break
    default:
      self.postMessage({
        msg: '未知命令',
        payload: e.data
      })
      break
  }
}