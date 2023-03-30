importScripts('./Router.js')

const router = new Router()
console.log('service worker 注册成功')

self.addEventListener('install', () => {

  // 安装回调的逻辑处理
  console.log('service worker 安装成功')
})

self.addEventListener('activate', () => {
  // 激活回调的逻辑处理
  console.log('service worker 激活成功')
})

// 参数一 rule：可以是url匹配、正则匹配、自定义匹配
// 参数二 handler函数：
// - 函数返回 Response
// - 也可以返回 Promise，这个 Promise 再返回 Response
router.registerRoute(
  '/data.txt',
  () => new Response('hello txt')
)
router.registerRoute(
  /\/data\.json/,
  () => new Promise(
    (resolve, reject) => {
    // ...一些异步操作
    resolve(new Response('hello json'))
  })
)

router.registerRoute(
  request => request.url.indexOf('/user.json') > 0,
  request => new Response(JSON.stringify({
    success: true,
    username: 'monkey',
    url: request.url,
  }))
)