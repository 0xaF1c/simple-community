<template>
  <n-tooltip trigger="click">
    <n-time :time="new Date(date)" :format="$t('time.format')" type="datetime"></n-time>
    <template #trigger>
      <n-button text>
        <n-time :time="new Date(date)" :to="new Date().getTime()" type="relative"></n-time>
      </n-button>
    </template>
  </n-tooltip>
</template>

<script lang="ts">
import {
  NTime,
  NButton,
  NTooltip
} from 'naive-ui'

export default {
  components: {
    NTime,
    NButton,
    NTooltip
  },
  props: {
    date: {
      required: true,
      type: Date
    }
  }
}
</script>