import Vue from 'vue'
import VueRouter from './myVueRouter'
// import VueRouter from 'vue-router'
import Home from '../view/Home.vue'
import About from '../view/About.vue'
Vue.use(VueRouter)
const routes = [
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: About
  }
]
const router = new VueRouter({
  mode: 'history',
  routes
})
export default router