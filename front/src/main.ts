import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import axios from 'axios'
import { useAuthStore } from './stores/auth'

// Set base URL for axios
axios.defaults.baseURL = 'http://localhost:8000'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)

// Initialize auth store
const authStore = useAuthStore()
authStore.initialize()

app.mount('#app')
