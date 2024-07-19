<template>
  <n-avatar
    object-fit="cover"
    :src="userData?.avatarUrl ?? '/defaultAvatar.jpg'"
    :size="size"
    :fallback-src="'/defaultAvatar.jpg'"
    style="margin: 0 auto; cursor: pointer;"
    @click="onAvatarClick"
  />
  <user-card v-model:show="cardShow" :user-data="userData"></user-card>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import {
  NAvatar
} from 'naive-ui'
import userCard from './userCard.vue'

import { useAuthModal } from '../authModal/useAuthModal'

export default defineComponent({
  components: {
    NAvatar,
    userCard
  },
  setup(props) {
    const { showLoginModal } = useAuthModal()
    const cardShow = ref(false)
    return {
      cardShow,
      fallbackSrc: '/defaultAvatar.jpg',
      noAvatarSrc: '/public/avatar/default.jpg',
      onAvatarClick() {
        if (!props.userData) {
          showLoginModal()
        } else {
          cardShow.value = !cardShow.value
        }
      }
    }
  },
  props: {
    userData: {
      type: Object as any,
      required: true
    },
    size: {
      type: Number,
      requird: true
    }
  }
})

</script>