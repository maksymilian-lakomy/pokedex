import Vue from 'vue';
import Component from 'vue-class-component'

import { EventBus } from "@/events/EventBus";

@Component
export class AsyncFlags extends Vue {
    created() {
        EventBus.$on(
            "loading-species-list",
            (event: boolean) => (this.flags.loadingSpeciesList = event)
        );
        EventBus.$on(
            "loading-species",
            (event: boolean) => (this.flags.loadingSpecies = event)
        );
    }

    flags: Record<string, boolean> = {
        loadingSpeciesList: false,
        loadingSpecies: false
    };

    canPerformAsyncOperation(): boolean {
        for (const flag in this.flags) {
            if (this.flags[flag])
                return false;
        }
        return true;
    }
}
