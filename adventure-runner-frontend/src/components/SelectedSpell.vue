<script setup lang="ts">
import type { SpellDescData } from '@/model/SpellDescData';

const props = defineProps({
    spell: Object as () => SpellDescData,
});
</script>

<template>
    <div v-if="props.spell" class="spell-container">
        <h1>Selected Spell</h1>
        <h2 class="spell-name">{{spell?.name}}</h2>
        <div class="spacer"></div>
        <div class="spell-details-wrapper">
            <div class="spell-detail">
                <h4>Level</h4>
                <span>{{spell?.level}}</span>
            </div>
            <div class="spell-detail">
                <h4>Casting time</h4>
                <span>{{spell?.casting_time}}</span>
            </div>
            <div class="spell-detail">
                <h4>Range/Area</h4>
                <span>{{spell?.range}}</span>
            </div>
            <div class="spell-detail">
                <h4>Components</h4>
                <span>{{spell?.components}}</span>
                <span v-if="spell?.material">&nbsp;({{spell.material}})</span>
            </div>
            <div class="spell-detail">
                <h4>Duration</h4>
                <span>{{spell?.duration}}</span>
            </div>
            <div class="spell-detail">
                <h4>School</h4>
                <span>{{spell?.school}}</span>
            </div>
        </div>
        <div class="spacer"></div>
        <p class="spell-desc">{{spell?.desc}}</p>
    </div>
</template>

<style lang="scss">
.spell-container {
    h2.spell-name {
        margin-bottom: 10px;
    }
    p.spell-desc {
        margin: 10px 0;
    }
    .spell-details-wrapper {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        margin: 10px 0;


        .spell-detail {
            width: 33%;

            h4 {
                margin: 0 0 5px 0;
            }
        }
    }
}
</style>