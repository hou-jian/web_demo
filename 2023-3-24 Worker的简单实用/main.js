const input = document.querySelector('#factorial-input')
const btn = document.querySelector('#factorial-btn')

btn.addEventListener('click', () => {
  startWorker(parseInt(input.value))
})

function startWorker(number) {
  console.log('计算开始请稍候')
  console.time('worker')
  const worker = new Worker('./worker.js')
  worker.postMessage({
    type: 'factorial',
    payload: { number }
  })
  // 接收 worker 发来的数据
  worker.onmessage = function(e) {
    const data = e.data
    console.log(data)
    if(data.msg = 'factorial计算完成') {
      // 为了节省系统资源，及时关闭 worker
      // Worker 线程用 self.close() 关闭
      worker.terminate()
      console.timeEnd('worker')
    }
  }

  worker.onerror = function(e) {
    console.log([
      'ERROR: Line ', e.lineno,
      ' in ', e.filename,
      ': ', e.message
    ].join(''))
  }
}



