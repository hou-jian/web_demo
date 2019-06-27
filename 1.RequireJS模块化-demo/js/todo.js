// 保存所有的todotask以及完成状态
var saveTask = function() {
    var todoAll = es('.todo-task')
    // log('todoAll', todoAll)
    var arr = []
    for (var i = 0; i < todoAll.length; i++) {
        var boolean = todoAll[i].classList.contains('done')
        var taskValue = todoAll[i].querySelector('.todo-task-value').innerHTML
        // log('执行了吗？')
        var data = {
            done: boolean,
            task: taskValue
        }
        // log('data', data)
        arr.push(data)
    }
    // log('arr保存', save(arr, 'todos'))
    var s = JSON.stringify(arr)
    localStorage.todos = s
}
// 载入本地缓存的todo
var loadTodos = function() {
    if (typeof localStorage.todos !== 'undefined') {
        // log('typeof todos')
        var s = localStorage.todos
        var todos = JSON.parse(s)
        for (var i = 0; i < todos.length; i++) {
            addTodoList(todos[i].task, todos[i].done)
        }
    }
}
// 返回任务css
var getTodoTask = function(value, done) {
    if (done) {
        return `
        <li class="todo-task done">
            <span class='todo-task-value'>${value}</span>
            <div class="button">
                <button class="remove"></button>
                <span></span>
                <button class="achieve"></button>
            </div>
        </li>
        `
    } else if (!done) {
        return `
        <li class="todo-task">
            <span class='todo-task-value'>${value}</span>
            <div class="button">
                <button class="remove"></button>
                <span></span>
                <button class="achieve"></button>
            </div>
        </li>
        `
    }
}
// 添加todo任务
var addTodoList = function(Value, done) {
    var li = getTodoTask(Value, done)
    // log('li', li)
    if (!done) {
        var todoList = e('.todo-List')
        todoList.insertAdjacentHTML('beforeend', li)

    }else if(done) {
        var todoAccomplish = e('.todo-accomplish')
        todoAccomplish.insertAdjacentHTML('beforeend', li)
    }

}
// 点击添加Todo
var addClickTodo = function() {
    var addTask = e('.add-task')
    // log('addTask', addTask)
    addTask.addEventListener('click', function(event){
        var target = event.target
        var form = target.parentElement
        // console.log('target', target);
        if(target.type === 'button'){
            // log('点到button了')
            // 获取input的值
            var input = form.children[0]
            var inputValue = input.value
            addTodoList(inputValue, false)
            saveTask()
            input.value = ''
        }
    })
}
// 回车添加todo
var addKeydownTodo = function() {
    var addInput = e('.add-task input')
    // log('addTask', addTask)
    addInput.addEventListener('keydown', function(event){
        var key = event.key
        // log('key', key)
        if (key === 'Enter') {
            // log('按到了enter')
            var inputValue = addInput.value
            addTodoList(inputValue, false)
            saveTask()
            addInput.value = ''
        }
    })
}

// 删除todo
var removeTodo = function() {
    // 给todo绑定事件托管
    var todoList = e('.todo-List')
    var todoAcc = e('.todo-accomplish')
    todoList.addEventListener('click', function(event){
        var target = event.target
        // 删除掉
        if (target.classList.contains('remove')) {
            var targetLi = target.parentElement.parentElement
            targetLi.remove()
            // 保存
            saveTask()
        }
    })
    todoAcc.addEventListener('click', function(event){
        var target = event.target
        // 删除掉
        if (target.classList.contains('remove')) {
            var targetLi = target.parentElement.parentElement
            targetLi.remove()
            // 保存
            saveTask()
        }
    })

}
// 完成todo
var accomplishTodo = function() {
    var todoList = e('.todo-List')
    var todoContainer = e('.todo-accomplish')
    todoList.addEventListener('click', function(event){
        var target = event.target
        var todoLi = target.parentElement.parentElement
        if (target.classList.contains('achieve')) {
            var taskValue = todoLi.querySelector('.todo-task-value').innerHTML
            addTodoList(taskValue, true)
            todoLi.remove()
            saveTask()
        }
    })
}
// 恢复完成的todo
var accomplishTodo2 = function() {
    var todoAcc = e('.todo-accomplish')
    todoAcc.addEventListener('click', function(event){
        var target = event.target
        var todoLi = target.parentElement.parentElement
        if (target.classList.contains('achieve')) {
            var taskValue = todoLi.querySelector('.todo-task-value').innerHTML
            addTodoList(taskValue, false)
            todoLi.remove()
            saveTask()
        }
    })
}
// 更新todo
var __main = function() {
    loadTodos()
    addKeydownTodo()
    addClickTodo()
    removeTodo()
    accomplishTodo()
    accomplishTodo2()
}
__main()
