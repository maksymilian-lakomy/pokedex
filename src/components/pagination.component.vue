<template>
  <div class="pagination">
    <v-icon-button>
      <v-arrow-left-icon />
    </v-icon-button>
    <v-input
      class="pagination__input"
      center
      :value="current"
      type="number"
      @change="onPageChange($event)"
    />
    <span class="pagination__count"> of {{ count }}</span>
    <v-icon-button>
      <v-arrow-right-icon />
    </v-icon-button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Route } from 'vue-router';

import InputComponent from '@/components/input.component.vue';
import IconButtonComponent from '@/components/icon-button.component.vue';
import ArrowLeftIcon from '@/components/icons/arrow-left.icon.vue';
import ArrowRightIcon from '@/components/icons/arrow-right.icon.vue';

export default Vue.extend({
  components: {
    'v-input': InputComponent,
    'v-icon-button': IconButtonComponent,
    'v-arrow-right-icon': ArrowRightIcon,
    'v-arrow-left-icon': ArrowLeftIcon,
  },
  methods: {
    onPageChange(newPage: number | string): void {
      const numericPage = +newPage || 1;
      const validPage = Math.min(Math.max(numericPage, 1), this.$props.count);

      this.$emit('pageChange', validPage);
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
  $block-name: &;

  display: flex;
  flex-direction: row;
  align-items: center;

  #{$block-name}__input {
    width: 2rem;
  }

  #{$block-name}__count {
    margin-left: 0.5rem;
    font-weight: bold;
  }
}
</style>
