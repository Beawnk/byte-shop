import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/produtos',
      name: 'products',
      component: () => import('@/views/ProductsView.vue'),
    },
    {
      path: '/produtos/:id',
      name: 'product',
      component: () => import('@/views/ProductView.vue'),
      props: true
    },
    {
      path: '/conta',
      name: 'account',
      component: () => import('@/views/AccountView.vue'),
    }
  ],
})

export default router
