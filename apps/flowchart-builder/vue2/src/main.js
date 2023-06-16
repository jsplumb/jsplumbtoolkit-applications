import Vue from 'vue'
import App from './App.vue'

import { JsPlumbToolkitVue2Plugin, ShapeLibraryPlugin, InspectorPlugin } from '@jsplumbtoolkit/browser-ui-vue2'

import './assets/main.css'

// import Toolkit plugin
Vue.use(JsPlumbToolkitVue2Plugin)
Vue.use(ShapeLibraryPlugin)
Vue.use(InspectorPlugin)

new Vue({
  render: (h) => h(App)
}).$mount('#app')
