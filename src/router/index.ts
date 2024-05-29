import LoginPage from '@/views/LoginPage.vue'
import MainPage from '@/views/MainPage.vue'
import TicketInfoPage from '@/views/TicketInfoPage.vue'
import { createRouter, createWebHistory } from 'vue-router'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'main',
      component: MainPage
    },
    {
      path: '/login',
      name: 'login',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: LoginPage
    },
    {
      path: '/info',
      name: 'ticket-info',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: TicketInfoPage
    }

  ]
})

export default router
