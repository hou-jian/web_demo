// 教程参考：https://zh.javascript.info/indexeddb
let db
// ## 打开数据库
let openRequest = indexedDB.open('booksDB', 1)

// 没有数据库进行初始化或则版本升级时,触发
openRequest.onupgradeneeded = function() {
  console.log('upgradeneeded')
  db = openRequest.result
  let objectStore
  // ## 创建 objectStore
  if(!db.objectStoreNames.contains('books')) { // 如果没有 books，创建它
    // 参数1：keyPath —— 对象属性的路径，IndexedDB 将以此路径作为键，例如 id。
    // 参数2：autoIncrement —— 如果为 true，则自动生成新存储的对象的键，键是一个不断递增的数字
    objectStore = db.createObjectStore('books', { keyPath: 'id' })
  } else { // 有，则直接取出来
    objectStore = openRequest.transaction.objectStore('books')
  }
  // ## 创建索引（使用见下方“查询数据”部分）
  // 价格不是唯一的，也不是一个数组，所以不用 unique 和 multiEntry。
  objectStore.createIndex('price_idx', 'price')
}

openRequest.onerror = function() {
  console.error("Error", openRequest.error)
}

openRequest.onsuccess = function() {
  console.log('success')
  db = openRequest.result
  // ## 事件委托
  // 每个请求都需要调用 onerror/onsuccess？并不，可以使用事件委托来代替。
  // IndexedDB 事件冒泡：请求 → 事务 → 数据库。
  db.onerror = function(e) {
    let request = e.target // 导致错误的请求
    console.log("db捕获Error", request.error)
  }
  list()
}

// ## 删除数据库
// let deleteRequest = indexedDB.deleteDatabase(name)
// deleteRequest.onsuccess/onerror 追踪（tracks）结果

// ## 事务
// - 添加数据（通过事务）
const add = document.querySelector('.add')
add.onclick = function() {
  // 参数1：需要操作的 objecStore
  // 参数2：readonly 只读；readwrite 读写（会锁定指定的objectStore）
  const transaction = db.transaction("books", "readwrite")
  let books = transaction.objectStore("books")


  let id = prompt("Book name?")
  let price = +prompt("Book price?")
  const request = books.add({ id, price }) // 使用 add id相同会报错。
  // 类似的还可以: 
  // books.put({id: 'js', price: 20, ...})
  // books.delete('js')

  request.onsuccess = function() {
    console.log("书籍成功添加", request.result)
    list()
    // ## 事务的自动提交
    //   注意事务的自动提交，下面代码的正确做法是开一个新的事务。
    //   这样做的原因是，事务应该是短期的，readwrite 会锁定当前 objectStore，
    //   其它想对 objectStore 的操作，会被挂起，如果事务太长会造成一些奇怪的延迟。
    //   (事务是微任务)
    fetch('/').then(response => {
      // let request2 = books.add(/*anotherBook*/) // 这里是无效的，因为事务已经自动提交了
      // request2.onerror = function() {
      //   console.log(request2.error.name) // TransactionInactiveError
      // }
    })
  }

  request.onerror = function(e) {
    // 当前添加book的例子，books.add(book)，因为key相同，
    // 添加第二次就会生成一个 "ConstraInterror" 报错。
    // 正常来讲会中止当前事务，但我们也可以手动处理。
    if(request.error.name == "ConstraintError") {
      console.log('书籍id已经存在')
      e.preventDefault() // 不终止事务
      e.stopPropagation() // 阻止冒泡, 停止它的传播（IndexedDB 事件冒泡：请求 → 事务 → 数据库）
      // 继续做处理。比如修改id，再生成一个新的事务
    } else {
      // 正常中止事务
      console.log("Error", request.error)
    }
  }

}

// ## 查询数据
const query = document.querySelector('.query')
query.onclick = function() {
  // - key查询
  // const transaction = db.transaction("books")
  // const books = transaction.objectStore("books")
  // const request = books.get('js')
  // request.onsuccess = e => {
  //   // 获取到的数据
  //   let object = e.target.result
  //   console.log('查询结果', object)
  // }

  /*
  其他方法：
    store.getAll([query], [count]) —— 搜索所有值。如果 count 给定，则按 count 进行限制。
    store.getKey(query) —— 搜索满足查询的第一个键，通常是一个范围。
    store.getAllKeys([query], [count]) —— 搜索满足查询的所有键，通常是一个范围。如果 count 给定，则最多为 count。
    store.count([query]) —— 获取满足查询的键的总数，通常是一个范围。
   */


  // - 索引查询
  const transaction = db.transaction("books")
  const books = transaction.objectStore("books")
  const priceIndex = books.index("price_idx")
  let price = +prompt("你要查询书籍的价格")
  const request = priceIndex.getAll(price)
  request.onsuccess = function() {
    console.log(request.result)//返回的是一个数组
  }
  // - 范围查询
  //基于索引的范围查找价格 <=100 的书籍
  // const request = priceIndex.getAll(IDBKeyRange.upperBound(100))
  // （略去其他代码）
  /*
  IDBKeyRange 对象是通过下列调用创建的：
    IDBKeyRange.lowerBound(lower, [open]) 表示：≥lower（如果 open 是 true，表示 >lower）
    IDBKeyRange.upperBound(upper, [open]) 表示：≤upper（如果 open 是 true，表示 <upper）
    IDBKeyRange.bound(lower, upper, [lowerOpen], [upperOpen]) 表示: 在 lower 和 upper 之间。如果 open 为 true，则相应的键不包括在范围中。
    IDBKeyRange.only(key) —— 仅包含一个键的范围 key，很少使用。
   */
}

// ## 光标（Cursors）
// 如果 objectStore 非常巨大，用 getAll/getAllKeys 就不可取了

const cursor = document.querySelector('.cursor')
cursor.onclick = function() {
  let transaction = db.transaction("books")
  let books = transaction.objectStore("books")

  let request = books.openCursor()
  // 同样的也可以基于索引查询 let request = priceIdx.openCursor(IDBKeyRange.upperBound(5))

  // 光标找到的每本书，都会触发success
  request.onsuccess = function() {
    let cursor = request.result
    if(cursor) {
      let key = cursor.key // 书的键（id字段）
      let value = cursor.value // 书本对象
      console.log(key, value)
      cursor.continue() // 继续下一本
      // 也可以使用 advance(count) 将光标向前移动 count 次
    } else {
      console.log("No more books")
    }
  }
}


function list() {
  const transaction = db.transaction("books")
  const books = transaction.objectStore("books")
  const request = books.getAll()

  const listElem = document.querySelector('.listElem')
  request.onsuccess = function() {
    const books = request.result
    if(books.length) {
      listElem.innerHTML = books.map(book => `<li>
        name: ${book.id}, price: ${book.price}
      </li>`).join('');
    } else {
      listElem.innerHTML = '<li>No books yet. Please add books.</li>'
    }
  }
}

