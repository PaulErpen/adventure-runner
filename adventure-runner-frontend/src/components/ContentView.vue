<script setup lang="ts">
import { useRouteStore } from '@/stores/route';
import { ref, onMounted } from 'vue'

const content = ref("");

const route = useRouteStore();

const fetchContent = async () => {
    content.value = await (await fetch("/api/content/" + route.contentPath)).text();
}

onMounted(() => {
    fetchContent();
});
</script>

<template>
    <div class="content" v-html="content"/>
</template>