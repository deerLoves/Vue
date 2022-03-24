// https://juejin.cn/post/6998017416252915720
function Vue2 (options) {
  this.$options = options
  initWatch.call(this, options.watch)
  initComputed.call(this, options.computed)
  ininData.call(this, options.data)
}
function initWatch (data) {
  this.watchrList = data
  this.val = null
}

function initComputed (data) {
  this._computedWatchers = {} // 保存computed对应key的缓存
  this._computedAndDataMap = {} // 保存computed对应key 和其回调函数内的 this.xxdata 的映射关系 (如果this.xxdata变更了, 清空对应的this._computedWatchers的缓存)
  this._currentComputedKey = null // 保存computed对应key. 为了上面this._computedAndDataMap能拿到依赖关系

  Object.keys(data).forEach(key => {
    Object.defineProperties(this, key, {
      configurable: true,
      enumerable: true,
      get: function () {
        this._currentComputedKey = key
        // 没有就进行缓存
        if (!this._computedWatchers[key]){
          this._computedWatchers[key] = data[key].call(this)
        }
        // 有就直接干掉
        this._currentComputedKey = null
        return this._computedWatchers[key]
      },
      set: function (n) {
        console.log('computed值不能修改')
      }
    })
  })
}

function initData (data) {
  for (let key in data) {
    let temp // 利用了闭包, 保存了私有的变量 方便get和set的操作, 会常驻内存
    // 如果 data[key] 是一个对象, 递归重写 setter getter
    if (typeof data[key] === 'object') {
      temp = new Object()
      initData.call(temp, data[key]) // 递归 用Object.defineProperty监听data
    } else {
      temp = data[key]
    }
    // 将 data 中的数据直接绑定在 vue 的实例上, 好处是可以 this.x 调用数据了.
    Object.defineProperty(this, key, {
      configurable: true,
      enumerable: true,
      get: function () {
        console.log(key, '的get函数被执行了')
        if (this._currentComputedKey) { // 如果是computed内的回调函数像拿值, 做一个记录, 记录下当前key 对应哪个computed内的属性
          this._computedAndDataMap[key] = this._currentComputedKey
        }
        return temp
      },
      set: function (n) {
        console.log(key, '的----set-----函数被执行了')
        const watcher = this.watcherList[key] // 如果被watch监听了, 执行watch内的回调函数
        if (watcher) {
          watcher(n, this.val) // newVal 和 oldVal
        }
        temp = n
        this._computedWatchers[this._computedAndDataMap[key]] = null // 因为这个依赖改变了, computed对应的值也要刷新
        this.val = n // 保存当前val, 后面会变成oldVal
      }
    })
  }
}

/* 以下是测试用例 和 细节解释： 可以亲手试试一条一条在控制台输出*/
console.log(vm.x) // 会触发this.x的get监听函数
console.log(vm.a.b) // 会触发this.a的get监听函数 和 this.a.b的get监听函数
/* computed的属性C_x是一个函数的返回值, 需缓存这个返回值, 并且收集依赖this.x,
   当this.x改变时, 需要重新跑函数 获得返回值
   跑函数的过程中, 需获取this.x, 会触发this.x的get监听函数 */
console.log(vm.C_x)
console.log(vm.C_x) // computed的属性C_x已经有缓存了, 直接返回缓存, 不会去取this.x的值了, 不会触发this.x的get监听函数
vm.x = 1111 // 会触发watch, 清掉C_x的缓存
vm.x = 22222222 // 会触发watch, 清掉C_x的缓存
console.log(vm.C_x) // computed的属性C_x需重新获取函数的返回值, 会重新触发this.x的  get监听函数
console.log(vm.C_x) // computed的属性C_x已经有缓存了, 直接返回缓存, 不会去取this.x的值了, 不会触发this.x的get监听函数