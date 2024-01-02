<template>
  <n-avatar
    object-fit="cover"
    :src="userData?.avatarUrl ?? '/defaultAvatar.jpg'"
    :size="size"
    :fallback-src="'/defaultAvatar.jpg'"
    style="margin: 0 auto; cursor: pointer;"
    @click="onAvatarClick"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {
  NAvatar
} from 'naive-ui'

import { useAuthModal } from '../authModal/useAuthModal'
import { useRouter } from 'vue-router';

export default defineComponent({
  components: {
    NAvatar
  },
  setup(props) {
    const { showLoginModal } = useAuthModal()
    const router = useRouter()
    return {
      fallbackSrc: '/defaultAvatar.jpg',
      noAvatarSrc: '/public/avatar/default.jpg',
      onAvatarClick() {
        if (!props.userData) {
          showLoginModal()
        } else {
          router.push({
            path: `/profile?id=${props.userData.id}`,
            name: 'profile',
            query: { id: props.userData.id }
          })
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