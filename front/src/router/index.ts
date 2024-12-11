import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import Home from '../components/Home.vue'
import Game from '../components/Game.vue'
import Login from '../components/Login.vue'
import History from '../components/History.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: { requiresAuth: true }
    },
    {
      path: '/game/:id',
      name: 'game',
      component: Game,
      props: true,
      meta: { requiresAuth: true }
    },
    {
      path: '/history',
      name: 'history',
      component: History,
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    }
  ]
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated
  const requiresAuth = to.meta.requiresAuth as boolean

  console.log('Route navigation:', {
    to: to.path,
    from: from.path,
    isAuthenticated,
    requiresAuth
  })

  if (requiresAuth && !isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router 