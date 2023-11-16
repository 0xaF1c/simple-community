<template>
  <n-thing>
    <template #header>
      <n-space align="center">
        <n-avatar :src="comment.publisher.avatarUrl" :size="50"
          style="display: flex; justify-content: center; align-items: center;" />
        <n-text>{{ comment.publisher.name }}@{{ comment.publisher.account }}</n-text>
      </n-space>
    </template>
    {{ comment.content }}
    <template #footer>
      <n-space>
        <n-button text>
          <n-icon :size="15" v-show="!liked" :component="Heart24Regular"></n-icon>
          <n-icon :size="15" v-show="liked" :component="Heart24Filled"></n-icon>
          {{ comment.likeCount }}
        </n-button>
        <n-button text>
          <n-icon :size="15" v-show="!commentShow" :component="Comment24Regular"></n-icon>
          <n-icon :size="15" v-show="commentShow" :component="Comment24Filled"></n-icon>
        </n-button>
      </n-space>
    </template>
  </n-thing>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

import {
  NThing,
  NButton,
  NIcon,
  NSpace,
  NText,
  NEl,
  NAvatar,
} from 'naive-ui'
import {
  Comment24Regular,
  Comment24Filled,
  Heart24Regular,
  Heart24Filled
} from '@vicons/fluent'

export default defineComponent({
  props: {
    comment: {
      required: true,
      type: Object as any
    },
  },
  components: {
    NThing,
    NButton,
    NIcon,
    NSpace,
    NText,
    NEl,
    NAvatar
  },
  setup() {
    const commentShow = ref(false)
    const liked = ref(false)
    return {
      commentShow,
      liked,
      Comment24Regular,
      Comment24Filled,
      Heart24Regular,
      Heart24Filled
    }
  }
})

</script>