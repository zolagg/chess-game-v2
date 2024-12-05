import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router/index'
import axios from 'axios'
import { useAuthStore } from './stores/auth'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'

// Set base URL for axios
axios.defaults.baseURL = 'http://localhost:8000'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Register PrimeVue components
app.component('TabView', TabView)
app.component('TabPanel', TabPanel)

// Initialize auth store
const authStore = useAuthStore()
authStore.initialize()

app.mount('#app')
