<script setup lang="ts">
import { useRouteStore } from "./stores/route";

const route = useRouteStore();

const getCurrentView = () => {
  return route.route;
}
</script>

<template>
  <header @click="route.home()">
    <img class="logo" src="./assets/android-chrome-512x512.png" />
    <h1 class="site-title">Adventure runner</h1>
  </header>

  <main>
    <component :is="getCurrentView()" />
  </main>
</template>

<style scoped>
header {
  padding: 8px;
  display: flex;
  align-items: center;
  box-shadow: 0px 0px 6px #9d9d9d;
  position: relative;
}

header .logo {
  max-width: 50px;
  max-height: 50px;
  margin-right: 12px;
}
</style>
