<template>
  <n-modal :show="show" @update-show="(v: any) => $emit('update:show', v)"  preset="card" :style="{ width: '550px' }">
    <template #header>{{ title }}</template>

    <n-empty v-if="users!.length <= 0" description="empty" />
    <n-list v-if="users!.length > 0">
      <n-list-item v-for="user in users">
        <n-space align="center">
          <avatar-link :user-data="user.avatarUrl"></avatar-link>
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
  NText
} from 'naive-ui'

import { ref, defineEmits } from 'vue'

import avatarLink from '../link/avatarLink.vue'
export default {
  components: {
    NModal,
    NSpace,
    NList,
    NListItem,
    NEmpty,
    avatarLink,
    NText
  },
  props: {
    users: Array<any>,
    show: Boolean,
    title: String
  },
  setup(props) {
    const list = ref<Array<any>>([])

    const emits = defineEmits<{
      (e: 'update:show', item: any): void
    }>()
    // @ts-ignore
    list.value = props.users!

    return {
      list,
      emits
    }
  }
}
</script>