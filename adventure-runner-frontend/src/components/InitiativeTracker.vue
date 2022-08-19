<script lang="ts" setup>
import { ref } from 'vue';
import draggable from 'vuedraggable'

const newCreatureName = ref("");

interface TrackedCreature {
    name: string,
    id: number,
    initiative: number,
    hp: number
}

const trackedCreaturesLocalStorageKey = "adv_runner_init_tracker_creatures";

const loadTrackedCreaturesFromLocalStorage = (): Array<TrackedCreature> => {
    const loadedCreatures = window.localStorage.getItem(trackedCreaturesLocalStorageKey);
    if (loadedCreatures) {
        return JSON.parse(loadedCreatures);
    }
    return Array<TrackedCreature>();
}

const trackedCreatures = ref(loadTrackedCreaturesFromLocalStorage());

const saveTrackedCreaturesToLocalStorage = () => {
    window.localStorage.setItem(trackedCreaturesLocalStorageKey, JSON.stringify(trackedCreatures.value));
    setTimeout(() => saveTrackedCreaturesToLocalStorage(), 5000);
}

setTimeout(() => saveTrackedCreaturesToLocalStorage(), 5000);

const addCreature = () => {
    trackedCreatures.value.push({
        name: newCreatureName.value,
        id: trackedCreatures.value.length,
        initiative: Math.min(...trackedCreatures.value.map(c => c.initiative)),
        hp: 0
    });

    newCreatureName.value = "";
}

const deleteCreature = (id: number) => {
    trackedCreatures.value = [...trackedCreatures.value.filter(c => c.id !== id)];
}
</script>

<template>
    <div class="initiative-tracker">
        <h1>Initiative Tracker</h1>
        <draggable v-model="trackedCreatures" item-key="id">
            <template #item="{ element }">
                <div class="creature-item">
                    <input class="initiative-input" type="text" v-model="element.initiative" />
                    &nbsp;
                    {{ element.name }}

                    <span class="delete" @click="deleteCreature(element.id)">X</span>
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