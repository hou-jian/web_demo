// 参数一是模块的路径，回调函数在模块加载完毕后执行
require(['utils'], function(utils) {
    var b = utils.e('#btn')
    b.addEventListener('click', function() {
        utils.log('?')
    })
})