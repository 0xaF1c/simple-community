<template>
  <n-avatar object-fit="cover" :src="userData?.avatarUrl" :size="size"
    style="margin: 0 auto;cursor: pointer;" @click="$router.push({
      path: `/profile?id=${userData.id}`,
      name: 'profile',
      query: { id: userData.id }
    })" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {
  NAvatar
} from 'naive-ui'

export default defineComponent({
  components: {
    NAvatar
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