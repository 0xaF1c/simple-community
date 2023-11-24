<template>
  <n-tooltip>
    <template #trigger>
      <n-tag :bordered="false" style="cursor: pointer;" @click="$router.push({
        path: '/tag/detail',
        query: {
          id: tag.id
        }
      })">
        {{ tag.title }}
        <template #avatar>
          <n-avatar :src="tag.poster"></n-avatar>
        </template>
      </n-tag>
    </template>
    {{ tag.description }}
  </n-tooltip>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import {
  NButton,
  NTooltip,
  NImage,
  NSpace,
  NIcon,
  NEllipsis,
  NTag,
  NAvatar
} from 'naive-ui'
import {
  Dismiss24Filled
} from '@vicons/fluent'

export default defineComponent({
  components: {
    NButton,
    NTooltip,
    NImage,
    NSpace,
    NIcon,
    NEllipsis,
    NTag,
    NAvatar
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