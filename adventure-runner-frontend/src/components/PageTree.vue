<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { ContentTreeNode } from './ContentTreeNode';
import TreeNode from './TreeNode.vue';

const pageTree = ref({} as ContentTreeNode)

const fetchTree = async () => {
    const content = await (await fetch("/api/tree")).json();
    pageTree.value = content as ContentTreeNode;
}

onMounted(() => {
    fetchTree();
})
</script>

<template>
    <div class="page-tree">
        <TreeNode :children="(pageTree.children)" :is-page="(pageTree.isPage)" :name="(pageTree.name)"
            :path="(pageTree.path)" />
    </div>
</template>