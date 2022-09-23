<script setup lang="ts">
import type { SpellDescData } from '@/model/SpellDescData';

const props = defineProps({
    spell: Object as () => SpellDescData,
});
</script>

<template>
    <div :v-if="props.spell" class="spell-container">
        <h3>{{spell?.name}}</h3>
        <p>{{spell?.desc}}</p>
    </div>
</template>

<style lang="scss">
.spell-container {
    p {
        margin: 0;
    }
}
</style>