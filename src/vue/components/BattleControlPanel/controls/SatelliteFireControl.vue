<template>
  <BaseControl
    :name="'satelliteFire'"
    :active="active"
    :disabled="disabled"
    :cooldown="cooldown"
    :progress="progress"
  />
</template>

<script lang="ts">
import { BaseControl } from './BaseControl';

export default {
  name: 'SatelliteFireControl',
  components: {
    BaseControl,
  },
  props: {
    active: {
      type: Boolean,
    },
    cooldown: {
      type: [Number, null],
    },
    progress: {
      type: Number,
    },
    disabled: {
      type: Boolean,
    }
  }
};
</script>
