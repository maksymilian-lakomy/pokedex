<template>
  <label class="checkbox">
    <input
      type="checkbox"
      :name="name"
      :checked="value"
      @input="$emit('input', $event.target.checked)"
    />
    <div class="checkbox__label">
      <slot />
    </div>
  </label>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  name: 'CheckboxComponent',
  props: {
    name: String,
    value: {
      type: Boolean,
      default: false,
    },
  },
});
</script>

<style lang="scss">
@import '@/styles/style';

.checkbox {
  $block-name: &;

  cursor: pointer !important;
  position: relative;
  z-index: 0;
  width: 100%;
  display: block;

  input[type='checkbox'] {
    display: none;
  }

  #{$block-name}__label {
    @include transition(NULL, color, background-color, opacity);

    display: flex;
    align-items: center;
    width: calc(100% - 2 * 0.5rem);
    padding: 0.25rem 0.5rem;
    border-radius: 0.5rem;
    opacity: 0.5;
  }

  input[type='checkbox']:checked + #{$block-name}__label {
    background-color: #e9e9e9;
    opacity: 1;
  }

  &:hover #{$block-name}__label {
    opacity: 1;
  }
}
</style>
