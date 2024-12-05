import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router/index'
import axios from 'axios'
import { useAuthStore } from './stores/auth'
import PrimeVue from 'primevue/config'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import ToastService from 'primevue/toastservice'
import Toast from 'primevue/toast'

import 'primevue/resources/themes/lara-light-blue/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'

axios.defaults.baseURL = 'http://localhost:8000'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(PrimeVue)
app.use(ToastService)

app.component('TabView', TabView)
app.component('TabPanel', TabPanel)
app.component('Toast', Toast)

const authStore = useAuthStore()
authStore.initialize()

app.mount('#app')
