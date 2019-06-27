var log = function() {
    console.log.apply(console, arguments)
}
var ensure = function(condition, message) {
    if (!condition) {
        console.log(message)
    }
}
// 用于: 获取单个元素
// 参数: css选择器
var e = function(selector) {
    return document.querySelector(selector)
}
// 用于: 获取所有元素
// 参数: css选择器
var es = function(selector) {
    return document.querySelectorAll(selector)
}
/*
*============下方为用的较少的函数=============
*/
// 用于: 开关
// 参数: 在element(自己获取),检查是否有某个className,有删除,没有则添加
var toggleClass =  function(element, className) {
    if (element.classList.contains(className)) {
        element.classList.remove(className)
    } else {
        element.classList.add(className)
    }
}
// 用于: 序列化(保存数据)
// 参数: array数组，name是变量(自己取)
var save = function(array, name) {
    var s = JSON.stringify(array)
    localStorage.name = s
}
// 用于: 反序列化(读取数据)
// 参数: 要读取的localStorage.name (name为自己取的变量名)
var load = function(name) {
    var s = localStorage.name
    return JSON.parse(s)
}
