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

self.addEventListener('fetch', event => {
  router.registerRoute(
    '/data.txt',
    () => new Response('hello txt')
  )
  router.registerRoute(
    '/data.json',
    () => new Response('hello json')
  )
  router.registerRoute(
    '/user.json',
    () => new Response('hello user')
  )
  // // 完整或相对URL匹配
  // if(match('/data.txt', event.request)) {
  //   return event.respondWith(new Response('完整或相对URL匹配成功'))
  // }
  // // 正则匹配
  // if(match(/\/data\.json/, event.request)) {
  //   return event.respondWith(new Response('正则匹配成功'))
  // }
  // // 自定义匹配
  // if(match(
  //   request => request.url.indexOf('/user.json') > 0,
  //   event.request
  // )) {
  //   return event.respondWith(new Response('自定义匹配成功'))
  // }
})

