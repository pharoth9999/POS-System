import './assets/main.css'

import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from './App.vue'
import { i18n } from './locales'
import router from './router'
import { useSettingsStore } from './stores/settingsStore'

const app = createApp(App)

app.use(createPinia())
app.use(i18n)
app.use(router)

// Applies the saved language to vue-i18n and <html lang> before the first render.
useSettingsStore()

app.mount('#app')
