import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementPlus from "element-plus";
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import './style/element.css'// only .css can be imported in main.js

createApp(App).use(store).use(router).use(ElementPlus).mount("#app");
