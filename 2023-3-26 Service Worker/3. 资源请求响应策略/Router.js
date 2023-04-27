// 在 fetch 事件回调当中主要进行着资源请求匹配和响应结果返回的操作，
// 可以把这个过程当做一个路由分发的问题，
// 因此我们可以封装一个 Router 类来实现对路由的匹配规则和操作分发的统一管理。
// 注意 match 请求拦截 和 respond 请求响应，两个函数的说明，
// 只是为了演示基本的封装逻辑，并没有考虑各种情况。
// 在真实开发中建议使用 Workbox。
class Router {
  constructor() {
    // 存放路由规则
    this.routes = []
    // 注册 fetch 事件拦截
    this.initProxy()
  }

  initProxy() {
    self.addEventListener('fetch', event => {
      // 当拦截到资源请求时，会遍历已注册的路由规则，并执行相应规则所对应的策略
      for(let route of this.routes) {
        // 使用前面封装好的 match 函数进行路由规则匹配
        if(match(route.rule, event.request)) {
          // 使用前面封装好的 respond 方法执行回调操作
          respond(event, route.handler)
          break
        }
      }
    })
  }

  registerRoute(rule, handler) {
    this.routes.push({ rule, handler })
  }
}

// 资源请求判断
// 这里为了简便，没有判断请求方法，默认你用的get，
// 可以用 request.method 获取，在rule传入方法字段再检查。
function match(rule, request) {
  switch(Object.prototype.toString.call(rule)) {
    // url 文本匹配
    case '[object String]':
      // 使用 URL() 将匹配规则传入的路径补全
      // (参数2是参数1为相对路径时的基准，详情：https://developer.mozilla.org/zh-CN/docs/Web/API/URL/URL)
      return request.url === new URL(rule, location).href

    // url 正则匹配
    case '[object RegExp]':
      return request.url.match(rule)

    // 支持自定义匹配
    case '[object Function]':
      return rule(request)
  }
}

// 资源请求响应的错误处理
// 错误返回 500状态码，这里是为了简单才这样封装的
// 可以封装为错误发送fetch请求真实的资源
function respond(event, handler) {
  try {
    // 执行响应处理方法，根据返回结果进行兜底
    let res = handler(event.request)
    // 异步的响应结果兜底
    if(res instanceof Promise) {
      let promise = res.then(response => {
        // 如果返回结果非 Response 对象，抛出错误
        if(!(response instanceof Response)) {
          throw Error('返回结果异常')
        }
        return response
      })
        // 异步响应错误处理，即直接返回状态码为 500 Response 对象
        .catch(() => new Response('Service Worker 出错', { status: 500 }))

      event.respondWith(promise)
      return
    }

    // 同步响应如果出现任何错误
    // 可以选择不调用 event.respondWith(r)
    // 让资源请求继续走浏览器默认的请求流程

    if(res instanceof Response) {
      event.respondWith(res)
    }
  } catch(e) { console.log(e) }
}

// self.addEventListener('fetch', event => {
  
//   // 完整或相对URL匹配
//   if(match('/data.txt', event.request)) {
//     return event.respondWith(new Response('完整或相对URL匹配成功'))
//   }
//   // 正则匹配
//   if(match(/\/data\.json/, event.request)) {
//     return event.respondWith(new Response('正则匹配成功'))
//   }
//   // 自定义匹配
//   if(match(
//     request => request.url.indexOf('/user.json') > 0,
//     event.request
//   )) {
//     return event.respondWith(new Response('自定义匹配成功'))
//   }
// })

