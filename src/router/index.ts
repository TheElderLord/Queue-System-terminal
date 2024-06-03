
import MainPage from '@/views/MainPage.vue'
import TicketInfoPage from '@/views/TicketInfoPage.vue'
import TicketsPage from '@/views/TicketsPage.vue'
import QueuePage from '@/views/QueuePage.vue'

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
      path: '/info',
      name: 'ticket-info',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: TicketInfoPage
    },
    {
      path: '/tickets',
      name: 'tickets',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: TicketsPage
    },
    {
      path: '/queue',
      name: 'queue',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: QueuePage
    },
    

  ]
})

export default router