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
      path: '/comprar/:id',
      name: 'buy',
      component: () => import('@/views/BuyView.vue'),
      props: true
    },
    {
      path: '/usuario',
      name: 'user',
      component: () => import('@/views/AccountView.vue'),
      children: [
        {
          path: '',
          name: 'data',
          component: () => import('@/views/user/UserDataEditView.vue'),
        },
        {
          path: 'produtos',
          name: 'user-products',
          component: () => import('@/views/user/UserProductsView.vue'),
        },
        {
          path: 'pedidos',
          name: 'orders',
          component: () => import('@/views/user/UserOrdersView.vue'),
        },
        {
          path: 'vendas',
          name: 'sales',
          component: () => import('@/views/user/UserSalesView.vue'),
        },
        {
          path: 'avaliacoes',
          name: 'reviews',
          component: () => import('@/views/user/UserReviewsView.vue'),
        },
        {
          path: 'alterar-senha',
          name: 'change-password',
          component: () => import('@/views/user/UserChangePassView.vue'),
        }
      ]
    }
  ],
})

export default router
