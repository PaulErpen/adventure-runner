import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import PageTree from "./components/PageTree.vue";
import ContentView from "./components/ContentView.vue";

import "./assets/main.css";

import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  { path: '/', component: PageTree },
  { path: '/content/:path(.*)*', component: ContentView },
]

const router = createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: createWebHashHistory(),
  routes: routes, // short for `routes: routes`
})

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount("#app");
