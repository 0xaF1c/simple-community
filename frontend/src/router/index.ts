import { createRouter, createWebHashHistory } from 'vue-router'

// vue3-router
const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/home/index.vue'),
  },
  {
    path: '/space',
    name: 'space',
    component: () => import('../views/space/index.vue'),
  },
]
const router = createRouter({
  routes,
  history: createWebHashHistory()
})

export default router