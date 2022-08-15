<script setup lang="ts">
const props = defineProps({
    name: String,
    isPage: Boolean,
    path: String,
    children: Array<ContentTreeNode>
})

const hasChildren = () => {
    return props && props.children && props.children?.length > 0;
}
</script>

<template>
<div class="tree-node">
    <div v-if="!props.isPage" class="directory">
        <div v-if="props.name !== ''" class="directory-name">{{props.name}}</div>
        
        <div class="children-holder" v-if="hasChildren()">
            <TreeNode v-for="node in props.children" :children="(node.children)" :is-page="(node.isPage)" :name="(node.name)"
            :path="(node.path)"
            />
        </div>
    </div>
    <span class="page" v-if="props.isPage">{{props.name}}</span>
</div>
</template>