<template>
  <button
    class="StartGameBotButton"
    @click="$emit('click')"
  >Play with<br>bot
  </button>
</template>


<script lang="ts">
export default {
  name: 'StartGameBotButton',
  emits: ['click']
};
</script>

<style scoped src="./StartGameBotButton.css"></style>
