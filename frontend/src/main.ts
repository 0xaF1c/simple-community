import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import { createPinia } from 'pinia'

import './style.css'
import 'vfonts/Lato.css'

const pinia = createPinia()

createApp(App)
  .use(router)
  .use(i18n)
  .use(pinia)
  .mount('#app')
