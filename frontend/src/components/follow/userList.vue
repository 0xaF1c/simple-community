<template>
  <n-modal :show="show" @update-show="(v: any) => $emit('update:show', v)"  preset="card" :style="{ width: '550px' }">
    <template #header>{{ title }}</template>

    <n-empty v-if="users!.length <= 0" description="empty" />
    <n-list v-if="users!.length > 0">
      <n-list-item v-for="user in users">
        <n-space align="center">
        <n-avatar
          object-fit="cover"
          :src="user?.avatarUrl ?? '/defaultAvatar.jpg'"
          :fallback-src="'/defaultAvatar.jpg'"
          :size="50"
          style="margin: 0 auto; cursor: pointer;"
          @click="onAvatarClick(user)"
        />
          <n-text>{{ user.name }}@{{ user.account }}</n-text>
        </n-space>
      </n-list-item>
    </n-list>

  </n-modal>
</template>

<script lang="ts">
import {
  NModal,
  NSpace,
  NList,
  NListItem,
  NEmpty,
  NText,
  NAvatar
} from 'naive-ui'

import { ref } from 'vue'

import { useRouter } from 'vue-router';
export default {
  components: {
    NModal,
    NSpace,
    NList,
    NListItem,
    NEmpty,
    NText,
    NAvatar 
  },
  props: {
    users: Array<any>,
    show: Boolean,
    title: String
  },
  emits: [
    'update:show'
  ],
  setup(props, context) {
    const list = ref<Array<any>>([])
    const router = useRouter()
    // @ts-ignore
    list.value = props.users!

    return {
      list,
      onAvatarClick(user: any) {
        router.push({
          path: `/profile?id=${user.id}`,
          name: 'profile',
          query: { id: user.id }
        })
        context.emit('update:show', false)
      }
    }
  }
}
</script>