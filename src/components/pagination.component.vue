<template>
  <div class="pagination">
    <div v-if="isFirstPageVisible">
      <router-link :to="routerDestination(1)" class="pagination__element">
        1
      </router-link>
      . . .
    </div>
    <router-link
      :to="routerDestination(n)"
      class="pagination__element"
      :class="{ 'pagination__element--active': n === current }"
      v-for="n in surroundingPages"
      :key="n"
    >
      {{ n }}
    </router-link>

    <router-link
      v-if="isLastPageVisible"
      :to="routerDestination(count)"
      class="pagination__element"
    >
      {{ count }}
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
          ...currentRoute.query,
          p: `${pageNumber}`,
        },
      };
    },
  },
  computed: {
    isFirstPageVisible(): boolean {
      return this.surroundingPages[0] !== 1;
    },
    isLastPageVisible(): boolean {
      return (
        this.surroundingPages[this.surroundingPages.length - 1] !== this.count
      );
    },
    surroundingPages(): number[] {
      const current = this.current;
      let min = Math.max(current - 2, 1);
      let rest = current - min - 2;
      const max = Math.min(current + 2 - rest, this.count);
      rest = Math.abs(max - current - 2);
      min = Math.max(min - rest, 1);

      return new Array(max - min + 1).fill(0).map((value, i) => i + min);
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
  flex-direction: row;
  list-style: none;
  width: fit-content;
  margin: 1rem 1rem;
    font-weight: bold;

  &__element {
    transition: opacity ease-out 0.25s;
    font-size: 1.25rem;
    color: inherit;
    text-decoration: unset;
    opacity: 0.5;

    &--active {
      opacity: 1;
    }

    &:hover {
      cursor: pointer;
      opacity: 1;
    }

    &:not(:last-child) {
      margin-right: 0.5rem;
    }
  }
}
</style>
