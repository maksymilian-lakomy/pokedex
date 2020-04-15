import Vue from 'vue';
import Component from 'vue-class-component'


@Component({
    filters: {
        name(value: string) {
            if (typeof value !== "string") return;
            value = value.replace('-', ' ');
            return value.replace(/\w\S*/g, string => string.charAt(0).toUpperCase() + string.substr(1).toLowerCase());
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



