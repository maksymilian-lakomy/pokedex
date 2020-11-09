<template>
  <div class="form-field">
    <h2 class="form-field__headline">{{ headline }}</h2>
    <div class="form-field__wrapper">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  name: 'FormFieldComponent',
  props: {
    headline: String,
  },
});
</script>

<style lang="scss" scoped>
.form-field {
  $block-name: &;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0 0.5rem;
  width: calc(100% - 2 * 0.5rem);

  #{$block-name}__headline {
    margin: .5rem 0;
    &::first-letter {
      text-transform: uppercase;
    }
  }

  #{$block-name}__wrapper {
    width: 100%;

    & > *:not(:last-child) {
      margin-bottom: 0.5rem;
    }
  }
}
</style>
