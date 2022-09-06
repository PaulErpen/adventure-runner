<script setup lang="ts">
import type { ContentTreeNode } from '../model/ContentTreeNode';
import { useRouteStore } from '@/stores/route';

const route = useRouteStore();

const props = defineProps({
    name: String,
    isPage: Boolean,
    path: { type: String, required: true },
    children: Array<ContentTreeNode>
})

const hasChildren = () => {
    return props && props.children && props.children?.length > 0;
}

const viewContent = () => {
    route.viewContent(props.path)
}
</script>

<template>
    <div class="tree-node">
        <div v-if="!props.isPage" class="directory">
            <div v-if="props.path !== ''" class="directory-name link">{{ props.name }}</div>

            <div class="children-holder" v-if="hasChildren()">
                <TreeNode v-for="node in props.children" :children="(node.children)" :is-page="(node.isPage)"
                    :name="(node.name)" :path="(node.path)" />
            </div>
        </div>
        <div class="page link" v-if="props.isPage" @click="viewContent">{{ props.name }}</div>
    </div>
</template>

<style scoped>
.tree-node .children-holder {
    margin-left: 10px;
}

.tree-node .link {
    padding: 5px;
}
</style>