import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "index",
    redirect: "home",
    component: () => import("../views/IcxorIndex.vue"),
    children: [
      {
        path: "home",
        name: "home",
        component: () => import("../views/basic/IcxorHome.vue"),
      },
      {
        path: "importer",
        name: "importer",
        component: () => import("../views/basic/IcxorImporter.vue"),
      },
      {
        path: "view",
        name: "viewer",
        component: () => import("../views/basic/IcxorViewer.vue"),
      },
      {
        path: "poly",
        name: "polyer",
        component: () => import("../views/basic/IcxorPolyer.vue"),
      },
      {
        path: "settings",
        name: "settings",
        component: () => import("../views/setting/IcxorSettings.vue"),
      },
      {
        path: "about",
        name: "about",
        component: () => import("../views/setting/IcxorSettings.vue"),
      },
      {
        path: "pixiv",
        name: "pixiv",
        component: () => import("../views/basic/IcxorPixiv.vue"),
      },
      {
        path: "pixiv/illust/:pid/:page",
        name: "pixivIllust",
        component: () => import("../views/basic/IcxorPixiv.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
