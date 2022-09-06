import type { TrackedCreature } from '@/model/TrackedCreature';
import { defineStore } from 'pinia';

const trackedCreaturesLocalStorageKey = "adv_runner_init_tracker_creatures";

export const useTrackedCreaturesStore = defineStore('trackedCreatures', {
    state: () => {
        return { trackedCreaturesArray: loadTrackedCreaturesFromLocalStorage() }
    },
    actions: {
        addCreature(newCreatureName: string,) {
            this.trackedCreaturesArray.push({
                name: newCreatureName,
                id: this.trackedCreaturesArray.length,
                initiative: Math.min(...this.trackedCreaturesArray.map(c => c.initiative)),
                hp: 0
            });
            this.saveTrackedCreaturesToLocalStorage();
        },
        deleteCreature(id: number) {
            this.trackedCreaturesArray = this.trackedCreaturesArray.filter(c => c.id !== id);
            this.saveTrackedCreaturesToLocalStorage();
        },
        saveTrackedCreaturesToLocalStorage() {
            window.localStorage.setItem(trackedCreaturesLocalStorageKey, JSON.stringify(this.trackedCreaturesArray));
        }
    }
});

const loadTrackedCreaturesFromLocalStorage = (): Array<TrackedCreature> => {
    const loadedCreatures = window.localStorage.getItem(trackedCreaturesLocalStorageKey);
    if (loadedCreatures) {
        return JSON.parse(loadedCreatures);
    }
    return Array<TrackedCreature>();
}