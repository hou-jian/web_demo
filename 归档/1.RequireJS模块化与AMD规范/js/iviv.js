define({
    log: function() {
        console.log.apply(console, arguments)
    },
    // 获取单个元素
    e: function(selector) {
        return document.querySelector(selector)
    },
    // 获取所有元素
    es: function(selector) {
        return document.querySelectorAll(selector)
    },
 
    // 参数: array数组，name是变量(自己取)
    save: function(array, name) {
        var s = JSON.stringify(array)
        localStorage.name = s
    },
    // 用于: 反序列化(读取数据)
    // 参数: 要读取的localStorage.name (name为自己取的变量名)
    load: function(name) {
        var s = localStorage.name
        return JSON.parse(s)
    }
})
