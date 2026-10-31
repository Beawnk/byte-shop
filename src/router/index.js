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
      meta: { title: 'Produtos' },
    },
    {
      path: '/produtos/:id',
      name: 'product',
      component: () => import('@/views/ProductView.vue'),
      props: true,
      meta: { title: 'Produto' },
    },
    {
      path: '/comprar/:id',
      name: 'buy',
      component: () => import('@/views/BuyView.vue'),
      props: true,
      meta: { title: 'Finalizar compra', requiresAuth: true },
    },
    {
      path: '/sobre',
      name: 'about',
      component: () => import('@/views/AboutView.vue'),
      meta: { title: 'Sobre o projeto' },
    },
    {
      path: '/carrinho',
      name: 'cart',
      component: () => import('@/views/CartView.vue'),
      meta: { title: 'Carrinho' },
    },
    {
      // Same view as /comprar/:id, buying everything in the cart.
      path: '/finalizar',
      name: 'checkout',
      component: () => import('@/views/BuyView.vue'),
      meta: { title: 'Finalizar compra', requiresAuth: true },
    },
    {
      // Target of the password reset email link (supabase-js turns the link into a session).
      path: '/usuario/alterar-senha',
      name: 'change-password',
      component: () => import('@/views/AccountView.vue'),
      meta: { title: 'Alterar senha' },
    },
    {
      // Logged out, this page shows login / sign up / forgot password; logged in, the account area.
      path: '/usuario',
      name: 'user',
      component: () => import('@/views/AccountView.vue'),
      meta: { title: 'Minha conta' },
      children: [
        {
          path: '',
          name: 'data',
          // No title of its own: logged out this same URL is the login page ("Minha conta" fits both).
          component: () => import('@/views/user/UserDataEditView.vue'),
        },
        {
          path: 'favoritos',
          name: 'favorites',
          component: () => import('@/views/user/UserFavoritesView.vue'),
          meta: { title: 'Favoritos', requiresAuth: true },
        },
        {
          path: 'produtos',
          name: 'user-products',
          component: () => import('@/views/user/UserProductsView.vue'),
          meta: { title: 'Meus produtos', requiresAuth: true },
        },
        {
          path: 'pedidos',
          name: 'orders',
          component: () => import('@/views/user/UserOrdersView.vue'),
          meta: { title: 'Pedidos', requiresAuth: true },
        },
        {
          path: 'vendas',
          name: 'sales',
          component: () => import('@/views/user/UserSalesView.vue'),
          meta: { title: 'Vendas', requiresAuth: true },
        },
        {
          path: 'avaliacoes',
          name: 'reviews',
          component: () => import('@/views/user/UserReviewsView.vue'),
          meta: { requiresAuth: true, title: 'Avaliações' },
        },
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
      meta: { title: 'Página não encontrada' },
    },
  ],
  // Back/forward restores the position; a new page starts at the top.
  scrollBehavior(to, from, savedPosition) {
    return savedPosition ?? { top: 0 }
  },
})

router.beforeEach(async (to) => {
  const userStore = useUserStore()
  // Wait for the session to be restored, otherwise a reload on a private page always goes to login.
  await userStore.ready

  if (to.meta.requiresAuth && !userStore.logged) {
    return { name: 'user', query: { page: 'login', redirect: to.fullPath } }
  }
})

router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} | Byte Shop` : 'Byte Shop'
})

export default router
