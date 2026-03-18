import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('@/views/Home.vue')
    },
    {
      path: '/history',
      name: 'History',
      component: () => import('@/views/History.vue')
    },
    {
      path: '/summary/:id',
      name: 'SummaryDetail',
      component: () => import('@/views/SummaryDetail.vue')
    }
  ]
})

export default router