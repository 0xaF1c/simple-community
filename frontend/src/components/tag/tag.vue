<template>
  <n-tooltip :style="{
    width: tag.poster ? '100px' : 'auto'
  }">
    <template #trigger>
      <n-button text style="font-size: 1.2rem">
        #{{ tag.title }}
      </n-button>
      <n-button v-if="closable" @click="$emit('close')">
        <n-icon :component="Dismiss24Filled"></n-icon>
      </n-button>
    </template>
    <n-space vertical align="center">
      <n-avatar :src="tag.poster" :size="100"></n-avatar>
      {{ tag.description }}
    </n-space>
  </n-tooltip>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import {
  NButton,
  NTooltip,
  NAvatar,
  NSpace,
  NIcon,
} from 'naive-ui'
import {
  Dismiss24Filled
} from '@vicons/fluent'

export default defineComponent({
  components: {
    NButton,
    NTooltip,
    NAvatar,
    NSpace,
    NIcon
  },
  emits: [
    'close'
  ],
  props: {
    tag: {
      required: true,
      type: Object as any
    },
    closable: {
      required: false,
      type: Boolean,
    }
  },
  setup() {
    return {
      Dismiss24Filled
    }
  }
})
</script>