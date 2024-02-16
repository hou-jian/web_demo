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

