<template>
  <n-el
    v-if="comment.replyTo === null"
    :style="{
      padding: '10px 0 0 20px',
      borderRadius: theme.borderRadius,
      background: theme.tabColor,
      marginTop: '5px',
    }"
  >
    <comment
      :comment="comment"
      :selected="selectedId === comment.id"
      @on-reply-click="onReplyClick(comment, comment.id)"
      @need-update="$emit('needUpdate')"
    />
    <comment
      :style="{
        padding: '10px 20px',
        marginTop: '5px',
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
import { NEl, useThemeVars } from 'naive-ui'
import comment from './comment.vue'
export default defineComponent({
  components: { comment, NEl },
  props: {
    comment: {
      required: true,
      type: Object as any,
    },
    reply: {
      required: true,
      type: Object as any,
    },
  },
  emits: ['onSelect', 'needUpdate'],
  setup(_, { emit }) {
    const theme = useThemeVars()
    const selectedId = ref(null)
    return {
      theme,
      selectedId,
      onReplyClick(comment: any, replyId: string) {
        const select = () => {
          selectedId.value = comment.id
          emit('onSelect', {
            at: comment.publisher.name,
            reply: replyId,
          })
        }

        if (selectedId.value === null) {
          select()
        } else {
          if (comment.id === selectedId.value) {
            selectedId.value = null
            emit('onSelect', null)
          } else {
            select()
          }
        }
      },
    }
  },
})
</script>
