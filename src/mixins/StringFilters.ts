import Vue from 'vue';
import Component from 'vue-class-component'


@Component({
    filters: {
        name(value: string) {
            if (typeof value !== "string") return;
            return value.charAt(0).toUpperCase() + value.slice(1);
        },
        id(value: string | number) {
            let id: string = value.toString();
            while (id.length < 3) id = `0${id}`;
            return id;
        }
    }
})
export class StringFilters extends Vue {
}



