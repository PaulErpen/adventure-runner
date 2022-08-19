<script lang="ts" setup>
import { ref } from 'vue';
import Draggable from "vue3-draggable";

const newCreatureName = ref("");

const trackedCreatures = ref([
    {
        name: "Blalala",
        id: 1,
        initiative: 0,
        hp: 20
    },
    {
        name: "12312",
        id: 2,
        initiative: 0,
        hp: 20
    },
    {
        name: "BlHelloHelloalala",
        id: 3,
        initiative: 0,
        hp: 20
    }
]);

const addCreature = () => {
    trackedCreatures.value.push({
        name: newCreatureName.value,
        id: trackedCreatures.value.length,
        initiative: Math.max(...trackedCreatures.value.map(c => c.initiative)),
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
        <draggable v-model="trackedCreatures">
            <template v-slot:item="{ item }">
                <div class="creature-item">
                    <input class="initiative-input" type="text" v-model="item.initiative" />
                    &nbsp;
                    {{ item.name }}

                    <span class="delete" @click="deleteCreature(item.id)">X</span>
                    <span class="hp-display">
                        HP: <input class="hp-input" type="text" v-model="item.hp" />
                    </span>

                </div>
            </template>
        </draggable>
        <span class="add-creature-holder">
            <input type="text" v-model="newCreatureName"/>
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