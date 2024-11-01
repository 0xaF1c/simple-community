<template>
  {{ $t('reply') }}
  <n-button tag="a" type="primary" text @click="onLinkClick"
    >@{{ userData?.name }}</n-button
  >
  <user-card v-model:show="cardShow" :user-data="userData"></user-card>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { NButton } from 'naive-ui'
import userCard from './userCard.vue'

import { useAuthModal } from '../authModal/useAuthModal'

export default defineComponent({
  components: {
    userCard,
    NButton,
  },
  setup(props) {
    const { showLoginModal } = useAuthModal()
    const cardShow = ref(false)
    return {
      cardShow,
      onLinkClick() {
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
