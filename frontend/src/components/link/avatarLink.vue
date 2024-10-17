<template>
  <n-avatar
    object-fit="cover"
    :src="userData?.avatarUrl ?? '/public/avatar/default.jpg'"
    :size="size"
    :fallback-src="'/public/avatar/default.jpg'"
    :img-props="{
      style: {
        width: `${size}px`,
        height: `${size}px`,
        margin: 0,
      },
    }"
    :style="{
      margin: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: '2.4px',
      cursor: 'pointer',
    }"
    @click="onAvatarClick"
  />
  <user-card v-model:show="cardShow" :user-data="userData"></user-card>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { NAvatar, NButton } from 'naive-ui'
import userCard from './userCard.vue'

import { useAuthModal } from '../authModal/useAuthModal'

export default defineComponent({
  components: {
    NAvatar,
    userCard,
    NButton,
  },
  setup(props) {
    const { showLoginModal } = useAuthModal()
    const cardShow = ref(false)
    return {
      cardShow,
      fallbackSrc: '/defaultAvatar.jpg',
      noAvatarSrc: '/public/avatar/default.jpg',
      onAvatarClick() {
        if (props.onClick) {
          props.onClick()
        } else {
          if (!props.userData) {
            showLoginModal()
          } else {
            cardShow.value = !cardShow.value
          }
        }
      },
    }
  },
  props: {
    userData: {
      type: Object as any,
      required: true,
    },
    size: {
      type: Number,
      required: false,
      default: 50,
    },
    onClick: {
      type: Function,
      required: false,
    },
  },
})
</script>
