import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './config/axios'
import PrimeVue from 'primevue/config'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import ToastService from 'primevue/toastservice'
import Toast from 'primevue/toast'

import 'primevue/resources/themes/lara-light-blue/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(PrimeVue)
app.use(ToastService)

app.component('TabView', TabView)
app.component('TabPanel', TabPanel)
app.component('Toast', Toast)

app.mount('#app')
