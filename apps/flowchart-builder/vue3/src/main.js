import './assets/main.css'

import { JsPlumbToolkitVue3Plugin, ShapeLibraryPlugin, InspectorPlugin } from '@jsplumbtoolkit/browser-ui-vue3'

import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)
app.use(JsPlumbToolkitVue3Plugin, {})
app.use(ShapeLibraryPlugin, {})
app.use(InspectorPlugin, {})
app.mount('#app')
