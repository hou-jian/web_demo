console.log('service worker 注册成功')

importScripts('./strategy.js')
importScripts('./Router.js')
const router = new Router()

router.registerRoute(/\.(html|css|js)$/, networkFirst())
router.registerRoute(/\.(jpe?g|png|gif|webp)$/, cacheFirst())




