<template>
  <label class="checkbox">
    <span class="checkbox__label">
      <slot />
    </span>
    <input type="checkbox" />
    <span class="checkmark"></span>
  </label>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  name: 'CheckboxComponent',
});
</script>

<style lang="scss">
.checkbox {
  $block-name: &;
  
  display: flex;
  font-size: 1.25rem;
  width: 100%;
  align-items: center;

  #{$block-name}__label {
    
  }

  input {
    margin-left: auto;
  }
}
</style>
