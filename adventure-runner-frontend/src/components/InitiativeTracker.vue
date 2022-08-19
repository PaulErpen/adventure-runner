<script lang="ts" setup>
import { ref } from 'vue';
import Draggable from "vue3-draggable";

const trackedCreatures = ref([
    {
        name: "Blalala",
        id: 1
    },
    {
        name: "12312",
        id: 2
    },
    {
        name: "BlHelloHelloalala",
        id: 3
    }
]);
</script>

<template>
    <h1>Initiative Tracker</h1>
    <draggable v-model="trackedCreatures">
        <template v-slot:item="{ item }">
            <div>
                {{ item.name }}
            </div>
        </template>
    </draggable>
</template>