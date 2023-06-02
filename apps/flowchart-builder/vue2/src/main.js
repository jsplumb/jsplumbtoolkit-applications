import Vue from 'vue'
import App from './App.vue'

import { JsPlumbToolkitVue2Plugin } from '@jsplumbtoolkit/browser-ui-vue2'

import './assets/main.css'

// import Toolkit plugin
Vue.use(JsPlumbToolkitVue2Plugin)

new Vue({
  render: (h) => h(App)
}).$mount('#app')
