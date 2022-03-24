const Vue = function () {}
Vue.prototype._init = function () {
  initData(this)
  initComputed(this)
  renderHelper(this)
}

const initComputed = function (vm) {
}