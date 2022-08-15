<script setup lang="ts">
import { useRouteStore } from "./stores/route";

const route = useRouteStore();

const getCurrentView = () => {
  return route.route;
}
</script>

<template>
  <header>
    <h1 class="site-title">Adventure runner</h1>
  </header>

  <main>
    <component :is="getCurrentView()"/>
  </main>
</template>

<style scoped>
</style>
