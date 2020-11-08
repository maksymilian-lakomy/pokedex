<template>
  <div class="filters">
    <v-form-field
      :headline="filterName"
      v-for="(filterName, i) in filtersName"
      :key="i"
    >
      <v-checkbox
        v-for="(filter, i) in filters.get(filterName)"
        :key="i"
        :value="isActive(filterName, filter)"
        @input="onValueChange(filterName, filter)"
      >
        {{ filter | name }}
      </v-checkbox>
    </v-form-field>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import CheckboxComponent from './checkbox.component.vue';
import FormFieldComponent from './form-field.component.vue';

export default Vue.extend({
  components: {
    'v-checkbox': CheckboxComponent,
    'v-form-field': FormFieldComponent,
  },
  props: {
    filters: {
      required: true,
      type: Map,
    },
    value: {
      required: false,
      type: Map,
      default: () => new Map<string, string[]>(),
    },
  },
  computed: {
    filtersName(): string[] {
      const filters = this.filters as Map<string, string[]>;
      return Array.from(filters.keys());
    },
  },
  methods: {
    onValueChange(filterName: string, filter: string): void {
      const changeMap = new Map(this.$props.value) as Map<string, string[]>;

      if (
        changeMap.has(filterName) &&
        changeMap.get(filterName)!.includes(filter)
      ) {
        const oldFilters = changeMap.get(filterName);

        oldFilters!.length === 1
          ? changeMap.delete(filterName)
          : changeMap.set(
              filterName,
              oldFilters!.filter((_filter) => _filter !== filter)
            );
      } else {
        const oldFilters = changeMap?.get(filterName);
        changeMap.set(
          filterName,
          oldFilters ? [...oldFilters, filter] : [filter]
        );
      }

      this.$emit('input', changeMap);
    },
    isActive(filterName: string, filter: string): boolean {
      const activeFilters = this.$props.value as Map<string, string[]>;

      return (
        activeFilters.has(filterName) &&
        !!activeFilters.get(filterName)?.includes(filter)
      );
    },
  },
  filters: {
    name(value: string) {
      return `${value[0].toUpperCase()}${value.replace('-', ' ').slice(1)}`;
    },
  },
});
</script>

<style lang="scss" scoped>
.filters {
  min-width: 230px;
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
</style>
