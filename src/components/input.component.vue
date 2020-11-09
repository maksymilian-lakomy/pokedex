<template>
  <label class="input" :class="{ 'input--center': center }">
    <input
      :type="type"
      :value="value"
      :placeholder="placeholder"
      @change="$emit('change', $event.target.value)"
      @input="$emit('input', $event.target.value)"
    />
  </label>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  name: 'InputComponent',
  props: {
    value: {
      type: [String, Number],
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    center: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: 'text',
    },
  },
});
</script>

<style lang="scss" scoped>
@import '@/styles/style';

.input {
  @include transition(NULL, border-color);

  $block-name: &;
  $inputs: "input[type='text'], input[type='number']";

  border: 2px solid #e5e5e5;
  padding: 0.5rem;
  border-radius: 0.5rem;
  display: block;

  #{$inputs} {
    @include transition(NULL, opacity);

    border: unset;
    font: inherit;
    outline: none;
    background: unset;
    color: #707070;
    opacity: 0.75;
    width: inherit;
    display: block;
    padding: unset;
    
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      appearance: none;
    }

    &::placeholder {
      color: inherit;
      font-style: italic;
    }

    &:focus {
      opacity: 1;
    }
  }

  &:focus-within {
    border-color: #707070;
    opacity: 1;
  }

  &#{$block-name}--center {
    #{$inputs} {
      text-align: center;
    }
  }
}
</style>
