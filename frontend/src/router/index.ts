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
  {
    path: '/profile',
    name: 'profile',
    component: () => import('../views/profile/index.vue'),
  },
  {
    path: '/tag',
    name: 'tag',
    children: [
      {
        path: '/tag/detail',
        name: 'tagDetail',
        component: () => import('../views/tag/index.vue')
      }
    ]
  }
]
const router = createRouter({
  routes,
  history: createWebHashHistory()
})

export default router