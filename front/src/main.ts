import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import axios from 'axios'

// Set base URL for axios
axios.defaults.baseURL = 'http://localhost:8000'

const app = createApp(App)
app.use(createPinia())
app.mount('#app')
