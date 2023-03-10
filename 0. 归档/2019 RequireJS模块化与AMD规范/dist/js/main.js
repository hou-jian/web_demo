define('iviv',{
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
;
define('todo',['iviv'], function(iviv) {
      // 通过遍历DOM的方式，获取并保存所有的todo数据
      var saveTask = function() {
        var todoAll = iviv.es('.todo-task')
        var arr = []
        for(var i = 0; i < todoAll.length; i++) {
            var boolean = todoAll[i].classList.contains('done')
            var taskValue = todoAll[i].querySelector('.todo-task-value').innerHTML
            var data = {
                done: boolean,
                task: taskValue
            }
            arr.push(data)
        }

        iviv.save(arr, 'todos')
    }
    // 载入本地缓存的todo
    var loadTodos = function() {
        if(typeof localStorage.todos !== 'undefined') {

            var todos = iviv.load('todos')
            for(var i = 0; i < todos.length; i++) {
                addTodoList(todos[i].task, todos[i].done)
            }
        }
    }
    // 返回任务css
    var getTodoTask = function(value, done) {
        if(done) {
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
        } else if(!done) {
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
        // 返回列表dom结构
        var li = getTodoTask(Value, done)
        // 根据完成状态添加到未完成/已完成列表
        if(!done) {
            var todoList = iviv.e('.todo-List')
            todoList.insertAdjacentHTML('beforeend', li)

        } else if(done) {
            var todoAccomplish = iviv.e('.todo-accomplish')
            todoAccomplish.insertAdjacentHTML('beforeend', li)
        }

    }
    // 点击添加Todo
    var addClickTodo = function() {
        var addTask = iviv.e('.add-task')
        addTask.addEventListener('click', function(event) {
            var target = event.target
            var form = target.parentElement
            if(target.type === 'button') {
                // 获取input的值
                var input = form.children[0]
                var inputValue = input.value
                if(inputValue === '') {
                    return
                }
                addTodoList(inputValue, false)
                saveTask()
                input.value = ''
            }
        })
    }
    // 回车添加todo
    var addKeydownTodo = function() {
        var addInput = iviv.e('.add-task input')
        addInput.addEventListener('keydown', function(event) {
            var key = event.key
            if(key === 'Enter') {
                var inputValue = addInput.value
                if(inputValue === '') {
                    return
                }
                addTodoList(inputValue, false)
                saveTask()
                addInput.value = ''
            }
        })
    }

    // 删除todo
    var removeTodo = function() {
        // 给todo绑定事件托管
        var todoList = iviv.e('.todo-List')
        var todoAcc = iviv.e('.todo-accomplish')
        // 未完成任务列表
        todoList.addEventListener('click', function(event) {
            var target = event.target
            // 删除掉
            if(target.classList.contains('remove')) {
                var targetLi = target.parentElement.parentElement
                targetLi.remove()
                // 保存
                saveTask()
            }
        })
        // 已完成任务列表
        todoAcc.addEventListener('click', function(event) {
            var target = event.target
            // 删除掉
            if(target.classList.contains('remove')) {
                var targetLi = target.parentElement.parentElement
                targetLi.remove()
                // 保存
                saveTask()
            }
        })

    }
    // 点击完成按钮，切换todo完成状态，并移入完成列表
    var accomplishTodo = function() {
        var todoList = iviv.e('.todo-List')
        var todoContainer = iviv.e('.todo-accomplish')
        todoList.addEventListener('click', function(event) {
            var target = event.target
            var todoLi = target.parentElement.parentElement
            if(target.classList.contains('achieve')) {
                var taskValue = todoLi.querySelector('.todo-task-value').innerHTML
                addTodoList(taskValue, true)
                todoLi.remove()
                saveTask()
            }
        })
    }
    // 在已完成任务列表，点击完成按钮恢复的todo状态，并移入未完成列表
    var accomplishTodo2 = function() {
        var todoAcc = iviv.e('.todo-accomplish')
        todoAcc.addEventListener('click', function(event) {
            var target = event.target
            var todoLi = target.parentElement.parentElement
            if(target.classList.contains('achieve')) {
                var taskValue = todoLi.querySelector('.todo-task-value').innerHTML
                addTodoList(taskValue, false)
                todoLi.remove()
                saveTask()
            }
        })
    }
    return {
        loadTodos: loadTodos,
        addKeydownTodo: addKeydownTodo,
        addClickTodo: addClickTodo,
        removeTodo: removeTodo,    
        accomplishTodo: accomplishTodo,
        accomplishTodo2: accomplishTodo2,
    }
})
  ;
require(['todo'], function(todo) {

    // 在localStorage读取todos对象，
    // 并遍历调用addTodoList()添加到页面
    todo.loadTodos()
    // 回车获取数据，调用addTodoList()添加,
    // 调用saveTask()把新的todos对象保存
    todo.addKeydownTodo()
    // 点击...(同上)
    todo.addClickTodo()
    // 点击删除按钮(未完成/已完成列表均需要绑定)删除任务，并调用saveTask()保存
    todo.removeTodo()
    // 点击完成按钮，切换todo完成状态，并移入完成列表
    todo.accomplishTodo()
    // 在已完成任务列表，点击完成按钮恢复的todo状态，并移入未完成列表
    todo.accomplishTodo2()

})

;
define("main", function(){});

