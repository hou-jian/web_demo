// 处理数据(增删改查)
class Model {
    constructor() {
        this.data = {
            name: '',
            number: 0,
            id: 0
        }

    }
    // 获取数据书籍
    fetch(url) {
        // 假数据
        return axios.get(url)
            .then((response) => {
                this.data = response.data[1]
                return this.data
            })
    }
    // 把最新的数据更新到服务器
    update(data) {
    }
    // ...数据操作
}
// 处理页面
class View {
    constructor() {
        this.elName = "#app"
        this.el = null
        this.template = `
            <div id="__id__">
                <div>
                    书名：《__name__》
                    <span id="number">数量：__number__</span>
                </div>
                <div>
                    <button id="addOne">加1</button>
                    <button id="subtract">减1</button>
                    <button id="reset">归0</button>
                </div>
            </div>
            
        `
        this.init()

    }
    init() {
        this.el = document.querySelector('#app')
    }
    // 渲染函数，把模板渲染到页面
    render(data) {

        var h = this.template

        h = h.replace('__name__', data.name)
        h = h.replace('__number__', data.number)
        h = h.replace('__id__', data.id)
        
        this.el.insertAdjacentHTML('beforeend', h)
    }
}

// 处理页面和数据间的关系
class Controller {
    constructor() {
        this.model = new Model()
        this.view = new View()
        // 请求成功渲染页面
        this.model.fetch('./mock.json').then((data) => { 
            this.view.render(data) 
            // 可以做一些事了
        })
    }

}

// 入口
var app = new Controller()