import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import ArchitectureList from '../views/ArchitectureList.vue'
import ArchitectureDetail from '../views/ArchitectureDetail.vue'
import Timeline from '../views/Timeline.vue'
import Interactive from '../views/Interactive.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/architecture',
    name: 'ArchitectureList',
    component: ArchitectureList
  },
  {
    path: '/architecture/:id',
    name: 'ArchitectureDetail',
    component: ArchitectureDetail,
    props: true
  },
  {
    path: '/timeline',
    name: 'Timeline',
    component: Timeline
  },
  {
    path: '/interactive',
    name: 'Interactive',
    component: Interactive
  }
]

const router = createRouter({
  history: createWebHashHistory(), // 这里已经改为Hash模式
  routes
})

export default router
