<script lang="ts" setup>
import { ref } from 'vue';
import draggable from 'vuedraggable';
import { useTrackedCreaturesStore } from '../stores/trackedCreatures';

const newCreatureName = ref("");

const trackedCreatures = useTrackedCreaturesStore();

const addCreature = () => {
    trackedCreatures.addCreature(newCreatureName.value);
    newCreatureName.value = "";
}
</script>

<template>
    <div class="initiative-tracker">
        <h1>Initiative Tracker</h1>
        <draggable v-model="trackedCreatures.trackedCreaturesArray" item-key="id">
            <template #item="{ element }">
                <div class="creature-item">
                    <input class="initiative-input" type="text" v-model="element.initiative" />
                    &nbsp;
                    {{ element.name }}

                    <span class="delete" @click="trackedCreatures.deleteCreature(element.id)">X</span>
                    <span class="hp-display">
                        HP: <input class="hp-input" type="text" v-model="element.hp" />
                    </span>

                </div>
            </template>
        </draggable>
        <span class="add-creature-holder">
            <input type="text" v-model="newCreatureName" />
            <button @click="addCreature()">Add creature</button>
        </span>
    </div>
</template>

<style lang="scss">
.initiative-tracker {
    .creature-item {
        padding: 5px 10px;
        margin: 5px 0;
        border: 1px grey solid;
        border-radius: 5px;

        .hp-display {
            float: right;
        }

        .delete {
            margin-left: 10px;
            margin-top: 1px;
            float: right;

            &:hover {
                color: red;
            }
        }

        input {
            text-align: center;
            width: 30px;
        }
    }

    .add-creature-holder {
        button {
            float: right;
        }
    }
}
</style>