<template>
  <button class="button">
    <slot />
  </button>  
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: "IconButton"
})
</script>

<style lang="scss" scoped>
.button {

}
</style>