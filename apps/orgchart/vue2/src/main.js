import Vue from 'vue'
import App from './App.vue'

import './assets/main.css'

import { JsPlumbToolkitVue2Plugin } from "@jsplumbtoolkit/browser-ui-vue2"

Vue.use(JsPlumbToolkitVue2Plugin)


new Vue({
  render: (h) => h(App)
}).$mount('#app')
