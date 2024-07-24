<template>
  <n-tooltip>
    <template #trigger>
      <n-button
        quaternary
        @mouseenter="bordered = true"
        @mouseleave="bordered = false"
        :bordered="bordered"
        :style="{
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'left',
          textAlign: 'left',
          padding: '10px 7px',
          width: width?`${width}px`:'',
        }"
        @click="
          $router.push({
            path: '/tag/detail',
            query: {
              id: tag.id
            }
          })
        "
      >
        <!-- <n-avatar :src="tag.poster" object-fit="cover" :size="25"></n-avatar> -->
        <span
          style="
            font-size: large;
            text-align: left;
            overflow: hidden;
            text-overflow: ellipsis;
            width: 100%;
          "
        >
          # {{ tag.title }}
        </span>
      </n-button>
    </template>
    <div>
      {{ tag.title }}
    </div>
    <div>
      {{ tag.description }}
    </div>
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
  NAvatar,
  NText
} from 'naive-ui'
import { Dismiss24Filled } from '@vicons/fluent'

export default defineComponent({
  components: {
    NButton,
    NTooltip,
    NImage,
    NSpace,
    NIcon,
    NEllipsis,
    NTag,
    NAvatar,
    NText
  },
  emits: ['close'],
  props: {
    tag: {
      required: true,
      type: Object as any
    },
    closable: {
      required: false,
      type: Boolean
    },
    width: {
      required: false,
      type: Number
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
