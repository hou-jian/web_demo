// 网络优先
function networkFirst({
  fetchOptions,
  cacheName = 'runtime-cache',
  matchOptions
} = {}) {
  // ...（定义getCachedResponse、fetchAndCatch）

  return async request => {
    let response

    try {
      // 优先发起网络请求，并将请求返回结果缓存到本地
      response = await fetchAndCatch(request, cacheName, fetchOptions)
    } catch(e) { }

    if(response == null) {
      // 网络资源请求失败时，从本地缓存中读取缓存
      response = await getCachedResponse(request, cacheName, matchOptions)
    }

    return response
  }
}
// 使用
// router.registerRoute(/\/api/, networkFirst()) // 对 /api 接口实现网络优先

// 缓存优先
function cacheFirst({
  fetchOptions,
  cacheName = 'runtime-cache',
  matchOptions
} = {}) {
  // ...（定义 getCachedResponse、fetchAndCatch）
  return async request => {
    let response
    try {
      // 优先匹配本地缓存
      response = await getCachedResponse(request, cacheName, matchOptions)
    } catch(e) { }
    // 匹配不到缓存或者缓存读取出现异常时，再去发起网络请求
    // 并且将请求成功的资源写入缓存中
    if(response == null) {
      response = await fetchAndCatch(request, cacheName, fetchOptions)
    }
    return response
  }
}
// 使用
// router.registerRoute(
//   'https://code.jquery.com/jquery-3.3.1.min.js',
//   cacheFirst({
//     fetchOptions: {
//       mode: 'cors'
//     }
//   })
// )

// 仅网络
function networkOnly({
  fetchOptions
} = {}) {
  return request => fetch(request, fetchOptions)
}

// 仅缓存
function cacheOnly({
  cacheName = 'runtime-cache',
  matchOptions
} = {}) {
  // ...（定义 getCachedResponse）

  return async request => {
    let response = await getCachedResponse(request, cacheName, matchOptions)
    return response
  }
}

// 优先读取缓存，再发送请求更新缓存。没有缓存则等待，网络返回。
function staleWhileRevalidate({
  fetchOptions,
  cacheName = 'runtime-cache',
  matchOptions
} = {}) {
  // ...（定义 getCachedResponse、fetchAndCatch）

  return async request => {
    let response
    // 首先读取本地缓存
    try {
      response = await getCachedResponse(request, cacheName, matchOptions)
    } catch(e) { }
    // 发起网络请求并更新缓存
    let fetchPromise = fetchAndCatch(request, cacheName, fetchOptions)
    // 有缓存不等待网络请求，直接返回 response。没有缓存则等待。
    if(response) {// 静默更新，无需报错
      fetchPromise.catch(e => { })
    } else {// 将网络请求到的资源返回
      response = await fetchPromise
    }

    return response
  }
}

// ## 公用方法

// 往缓存中写入资源
const cacheResponse = async (request, response, cacheName) => {
  // 使用 cacheName 参数打开缓存
  let cache = await caches.open(cacheName)
  await cache.put(request, response)
}

// 从缓存中查找资源并返回
const getCachedResponse = async (request, cacheName, matchOptions) => {
  let cache = await caches.open(cacheName)
  return cache.match(request, matchOptions)
}

// 发起网络请求，并且把成功响应的对象存入缓存中
const fetchAndCatch = async (request, cacheName, fetchOptions) => {
  let response = await fetch(request.clone(), fetchOptions)
  // 请求资源失败时直接返回
  if(!response.ok) {
    return
  }
  // 网络请求成功后，将请求响应结果复制一份存入缓存中
  // 更新缓存过程无需阻塞函数执行
  cacheResponse(request, response.clone(), cacheName)
    // 同时缓存更新行为只需静默执行即可
    .catch(() => { })

  // 返回响应结果
  return response
}
