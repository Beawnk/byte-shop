import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useUserStore } from '@/stores/UserState'

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
      props: true,
      meta: { requiresAuth: true },
    },
    {
      // Target of the password reset email link (supabase-js turns the link into a session).
      path: '/usuario/alterar-senha',
      name: 'change-password',
      component: () => import('@/views/AccountView.vue'),
    },
    {
      // Logged out, this page shows login / sign up / forgot password; logged in, the account area.
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
          path: 'favoritos',
          name: 'favorites',
          component: () => import('@/views/user/UserFavoritesView.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: 'produtos',
          name: 'user-products',
          component: () => import('@/views/user/UserProductsView.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: 'pedidos',
          name: 'orders',
          component: () => import('@/views/user/UserOrdersView.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: 'vendas',
          name: 'sales',
          component: () => import('@/views/user/UserSalesView.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: 'avaliacoes',
          name: 'reviews',
          component: () => import('@/views/user/UserReviewsView.vue'),
          meta: { requiresAuth: true },
        },
      ]
    },
  ],
})

router.beforeEach(async (to) => {
  const userStore = useUserStore()
  // Wait for the session to be restored, otherwise a reload on a private page always goes to login.
  await userStore.ready

  if (to.meta.requiresAuth && !userStore.logged) {
    return { name: 'user', query: { page: 'login', redirect: to.fullPath } }
  }
})

export default router
