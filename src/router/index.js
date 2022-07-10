import { createRouter, createWebHashHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'

const routes = [
  // {
  //   path: '/',
  //   name: 'home',
  //   component: HomeView
  // },
  {
    path: '/',
    name: 'index',
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
      }
    ]
  },
  // {
  //   path: '/about',
  //   name: 'about',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  // }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
