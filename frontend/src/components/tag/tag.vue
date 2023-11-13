<template>
  <n-tooltip style="min-width: 110px;">
    <template #trigger>
      <n-button text style="font-size: 1.2rem">
        #{{ tag.title }}
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
  NSpace
} from 'naive-ui'

export default defineComponent({
  components: {
    NButton,
    NTooltip,
    NAvatar,
    NSpace
  },
  props: {
    tag: {
      required: true,
      type: Object as any
    }
  },
  setup() {

  }
})
</script>