import './assets/style/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Loader from './components/Loader.vue'
import FieldNotifications from './components/FieldNotifications.vue'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.component('Loader', Loader)
app.component('FieldNotifications', FieldNotifications)

app.mount('#app')
