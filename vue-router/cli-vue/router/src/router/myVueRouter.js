/**
  Vue.use = function(plugin){
    const installedPlugins = (this._installedPlugins || (this._installedPlugins = []));
    if(installedPlugins.indexOf(plugin)>-1){
      return this;
    }
    <!-- 其他参数 -->
    const args = toArray(arguments,1);
    args.unshift(this);
    if(typeof plugin.install === 'function'){
      plugin.install.apply(plugin, args);
    }else if(typeof plugin === 'function'){
      plugin.apply(null,plugin, args);
    }
    installedPlugins.push(plugin);
    return this;
  }
  Vue use:
  1、在Vue.js上新增了use方法，并接收一个参数plugin。
  2、首先判断插件是不是已经别注册过，如果被注册过，则直接终止方法执行，此时只需要使用indexOf方法即可。
  3、toArray方法我们在就是将类数组转成真正的数组。使用toArray方法得到arguments。除了第一个参数之外，
    剩余的所有参数将得到的列表赋值给args，然后将Vue添加到args列表的最前面。这样做的目的是保证install方法被执行时第一个参数是Vue，
    其余参数是注册插件时传入的参数。
  4、由于plugin参数支持对象和函数类型，所以通过判断plugin.install和plugin哪个是函数，即可知用户使用哪种方式注册的插件，
    然后执行用户编写的插件并将args作为参数传入。
  5、最后，将插件添加到installedPlugins中，保证相同的插件不会反复被注册。
 */
/**
 * $route 和 $router 有什么区别？
 * $router是VueRouter实例对象
 * $route是当前路由对象
 * 也就是说$route是$router的一个属性
 */
let Vue = null
class HistoryRoute {
  constructor () {
    this.current = null
  }
}
class VueRouter {
  constructor (options) {
    this.mode = options.mode || 'hash'
    this.routes = options.routes || []
    this.routesMap = this.createMap(this.routes)
    console.log(this.routesMap)
    this.history = new HistoryRoute()
    this.init()
  }
  init () {
    if (this.mode === 'hash') {
      // 先判断用户打开时有没有hash值，没有的话跳转到#/
      location.hash ? '' : location.hash = '/'
      window.addEventListener('load', () => {
        this.history.current = location.hash.slice(1)
      })
      window.addEventListener('hashchange', () => {
        this.history.current = location.hash.slice(1)
      })
    } else {
      location.pathname ? '' : location.pathname = '/'
      window.addEventListener('load', () => {
        this.history.current = location.pathname
      })
      window.addEventListener('popstate', () => {
        this.history.current = location.pathname
      })
    }
  }
  createMap (routes) {
    return routes.reduce((pre, current) => {
      pre[current.path] = current.component
      return pre
    }, {})
  }
}
/**
 * 父组件和子组件的执行顺序？
 * 父beforeCreate-> 父created -> 父beforeMounte -> 子beforeCreate ->子create ->子beforeMount ->子 mounted -> 父mounted
 */
VueRouter.install = function (v) {
  Vue = v
  Vue.mixin({
    // 为什么是beforeCreate而不是created呢？因为如果是在created操作的话，$options已经初始化好了。
    beforeCreate() {
      if (this.$options && this.$options.router) { // 如果是根组件
        this._root = this // 把当前实例挂载到_root上
        this._router = this.$options.router
      } else { // 如果是子组件
        this._root = this.$parent && this.$parent._root
      }
      Object.defineProperty(this, '$router', {
        get () {
          return this._root._router
        }
      })
    },
  })
  Vue.component('router-link', {
    render (h) {
      return h('a', {}, '首页')
    }
  })
  Vue.component('router-view', {
    render (h) {
      return h('h1', {}, '首页视图')
    }
  })
}
export default VueRouter