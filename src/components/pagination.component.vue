<template>
  <div class="pagination">
    <router-link
      :to="routerDestination(n + surroundingPages[0] - 1)"
      class="pagination__element"
      v-for="n in surroundingPagesAmount + 1"
      :key="n"
    >
      {{ n + surroundingPages[0] - 1 }}
    </router-link>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Route } from 'vue-router';

export default Vue.extend({
  methods: {
    routerDestination(pageNumber: number): Route {
      const currentRoute = { ...this.$route };
      return {
        ...currentRoute,
        query: {
          p: `${pageNumber}`,
        },
      };
    },
  },
  computed: {
    surroundingPages(): number[] {
      const current = this.current;
      let min = Math.max(current - 2, 1);
      let rest = current - min - 2;
      const max = Math.min(current + 2 - rest, this.count);
      rest = Math.abs(max - current - 2);
      min = Math.max(min - rest, 1);

      return [min, max];
    },
    surroundingPagesAmount(): number {
      return this.surroundingPages[1] - this.surroundingPages[0];
    },
  },
  props: {
    count: {
      required: true,
      type: Number,
    },
    current: {
      required: true,
      type: Number,
    },
  },
});
</script>

<style lang="scss" scoped>
.pagination {
  display: flex;
  flex-direction: none;
  list-style: none;

  &__element {
    font-weight: bold;
    font-size: 1.25rem;
    color: inherit;
    text-decoration: unset;

    &:hover {
      cursor: pointer;
    }

    &:not(:last-child) {
      margin-right: 0.5rem;
    }
  }
}
</style>
