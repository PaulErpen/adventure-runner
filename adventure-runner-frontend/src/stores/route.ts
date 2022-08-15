// stores/counter.js
import ContentView from '@/components/ContentView.vue';
import { defineStore } from 'pinia'
import PageTree from "../components/PageTree.vue";

export const useRouteStore = defineStore('route', {
  state: () => {
    return { route: PageTree, contentPath: "" }
  },
  actions: {
    home() {
      this.route = PageTree
    },
    viewContent(path: string) {
        this.route = ContentView,
        this.contentPath = path
    }
  },
})