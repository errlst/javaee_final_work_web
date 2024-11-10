import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import LayoutView from '../views/LayoutView.vue'
import GoodsView from '../views/GoodsView.vue'
import ContractView from '../views/ContractView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/',
      name: 'layout',
      component: LayoutView,
      children: [
        {
          path: 'goods',
          name: 'goods',
          component: GoodsView
        },
        {
          path: 'contract',
          name: 'contract',
          component: ContractView
        }
      ]
    }
  ]
})

export default router 