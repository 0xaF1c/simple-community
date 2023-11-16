<template>
  <n-el v-if="comment.replyTo === null" :style="{
    borderLeft: `${theme.borderColor} solid 0.5px`,
    borderTop: `${theme.borderColor} solid 0.5px`,
    padding: '10px 0 0 10px'
  }">
    <comment :comment="comment" />
    <comment :style="{
      borderLeft: `${theme.borderColor} solid 0.5px`,
      borderTop: `${theme.borderColor} solid 0.5px`,
      padding: '10px 10px'
    }" v-for="c in reply" :comment="c" />
  </n-el>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import {
  NEl,
  useThemeVars
} from 'naive-ui'
import comment from './comment.vue'
export default defineComponent({
  components: { comment, NEl },
  props: {
    comment: {
      required: true,
      type: Object as any
    },
    reply: {
      required: true,
      type: Object as any
    },
  },
  setup() {
    const theme = useThemeVars()
    return {
      theme
    }
  }
})
</script>