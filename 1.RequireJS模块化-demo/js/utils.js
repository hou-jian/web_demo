define(function() {
    return {
        log: function() {
            console.log.apply(console, arguments)
        },
        e: function(selector) {
            return document.querySelector(selector)
        },
        es: function(selector) {
            return document.querySelectorAll(selector)
        }
    }
})
