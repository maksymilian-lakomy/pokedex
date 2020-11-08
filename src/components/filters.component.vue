<template>
  <div class="filters">
    <v-checkbox>Yellow</v-checkbox>
    <v-checkbox>Red</v-checkbox>
    <v-checkbox>Pink</v-checkbox>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import CheckboxComponent from "./checkbox.component.vue";

export default Vue.extend({
  components: {
    'v-checkbox': CheckboxComponent
  }
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
