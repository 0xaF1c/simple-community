<template>
  <n-el v-if="comment.replyTo === null" :style="{
    borderLeft: `${theme.borderColor} solid 0.5px`,
    borderTop: `${theme.borderColor} solid 0.5px`,
    padding: '10px 0 0 20px'
  }">
    <comment
      :comment="comment"
      :selected="selectedId === comment.id"
      @on-reply-click="onReplyClick(comment, comment.id)"
      @need-update="$emit('needUpdate')"
    />
    <comment
      :style="{
        borderLeft: `${theme.borderColor} solid 0.5px`,
        borderTop: `${theme.borderColor} solid 0.5px`,
        padding: '10px 20px'
      }"
      :selected="selectedId === c.id"
      v-for="c in reply"
      :comment="c"
      @on-reply-click="onReplyClick(c, comment.id)"
      @need-update="$emit('needUpdate')"
    />
  </n-el>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
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
    }
  },
  emits: ['onSelect', 'needUpdate'],
  setup(_, { emit }) {
    const theme = useThemeVars()
    const selectedId = ref(null)
    return {
      theme,
      selectedId,
      onReplyClick(comment: any, replyId: string) {
        if (selectedId.value === null) {
          selectedId.value = comment.id
          emit('onSelect', {
            at: comment.publisher.name,
            reply: replyId
          })
        } else {
          selectedId.value = null
          emit('onSelect', null)
        }
      }
    }
  }
})
</script>