<template>
  <n-tooltip>
    <template #trigger>
      <n-button
        text
        @mouseenter="bordered = true"
        @mouseleave="bordered = false"
        :bordered="bordered"
        style="
          cursor: pointer;
        "
        @click="$router.push({
          path: '/tag/detail',
          query: {
            id: tag.id
          }
        })"
      >
        <!-- <n-avatar :src="tag.poster" object-fit="cover" :size="25"></n-avatar> -->
        <span
          style="font-size: large; margin-bottom: 10px; text-wrap: wrap; text-align: left;"
        >
          # {{ tag.title }}
        </span>
      </n-button>
    </template>
    {{ tag.description }}
  </n-tooltip>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
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
    const bordered = ref(false)
    return {
      bordered,
      Dismiss24Filled
    }
  }
})
</script>