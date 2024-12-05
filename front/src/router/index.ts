import { createRouter, createWebHistory, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { routes } from './routes'

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Update document title
const updateDocumentTitle = (to: RouteLocationNormalized) => {
  const baseTitle = 'Chess App'
  const pageTitle = to.meta.title as string
  document.title = pageTitle ? `${pageTitle} - ${baseTitle}` : baseTitle
}

// Navigation guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated
  const requiresAuth = to.meta.requiresAuth as boolean

  updateDocumentTitle(to)

  if (requiresAuth && !isAuthenticated) {
    next({ 
      name: 'Login',
      query: { redirect: to.fullPath }
    })
  } else if (to.name === 'Login' && isAuthenticated) {
    next({ name: 'Home' })
  } else {
    next()
  }
})

export default router 