<template>
  <vue-slider
    class="PlasmaSlider"
    :modelValue="modelValue"
    :height="14"
    :tooltip="'always'"
    :tooltipPlacement="'bottom'"
    :railStyle="{
      backgroundColor: '#eaf5fa',
      borderRadius: 0
    }"
    :processStyle="{
      backgroundColor: '#eaf5fa'
    }"
    :dotSize="[30, 20]"
    :dotStyle="{
      border: 'none',
      borderRadius: 0,
      boxShadow: 'none',
      backgroundColor: 'transparent',
      backgroundImage: 'url(../gui/images/slider-dot.svg)'
    }"
    @update:modelValue="$emit('update:modelValue', $event)"
  >
    <template v-slot:tooltip="{ value }">
      <div class="PlasmaSlider__tooltip">{{ value }}%</div>
    </template>
  </vue-slider>
</template>

<script lang="ts">
import VueSlider from 'vue-slider-component';

import 'vue-slider-component/theme/antd.css';

export default {
  name: 'PlasmaSlider',
  components: {
    VueSlider
  },
  props: {
    modelValue: {
      required: true
    }
  }
};
</script>

<style scoped src="./PlasmaSlider.css"></style>
