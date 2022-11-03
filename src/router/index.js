import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'index',
    redirect: 'home',
    component: () => import('../views/IcxorIndex.vue'),
    children: [
      {
        path: 'home',
        name: 'home',
        component: () => import('../views/basic/IcxorHome.vue')
      },
      {
        path: 'importer',
        name: 'importer',
        component: () => import('../views/basic/IcxorImporter.vue')
      },
      {
        path: 'view',
        name: 'viewer',
        component: () => import('../views/basic/IcxorPolyer.vue')
      },
      {
        path: 'settings',
        name: 'settings',
        component: () => import('../views/setting/IcxorSettings.vue')
      },
      {
        path: 'exporter',
        name: 'exporter',
        component: () => import('../views/basic/IcxorExporter.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
