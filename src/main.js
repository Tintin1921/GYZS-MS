import Vue from 'vue'

import 'normalize.css/normalize.css'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // 全局CSS

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // 图标
import '@/permission' // 权限校验

Vue.use(ElementUI)

// 不允许用户输入特殊字符
Vue.directive('sanitize', {
  bind: function(el) {
    const input = el.tagName === 'INPUT' ? el : el.querySelector('input')
    input.handleInput = function(e) {
      // 定义允许的字符范围（字母、数字、@._-）
      const sanitized = e.target.value.replace(/[^a-zA-Z0-9@._-]/g, '')
      if (e.target.value !== sanitized) {
        e.target.value = sanitized
        e.target.dispatchEvent(new Event('input')) // 触发v-model更新
      }
    }
    input.addEventListener('input', input.handleInput)
  },
  unbind: function(el) {
    const input = el.tagName === 'INPUT' ? el : el.querySelector('input')
    input.removeEventListener('input', input.handleInput)
  }
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
