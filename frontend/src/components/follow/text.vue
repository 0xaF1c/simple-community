<template>
  <n-button text style="margin-right: 10px" @click="followerShow = !followerShow">
    {{ follower.length }} {{ $t('following.name') }}
    <user-list v-model:show="followerShow" :users="follower" :title="$t('following.name')+$t('list')"></user-list>
  </n-button>

  <n-button text  @click="followingShow = !followingShow">
    {{ following.length }} {{ $t('follower.name') }}
    <user-list v-model:show="followingShow" :users="following" :title="$t('follower.name')+$t('list')"></user-list>
  </n-button>
</template>


<script lang="ts">

import { defineComponent, onMounted, ref } from 'vue'
import { http } from '../../utils/http'
import { NButton } from 'naive-ui'

import userList from './userList.vue'
import { useAppStore } from '../../store'
import { watch } from 'vue'
export default defineComponent({
  components: {
    NButton,
    userList
  },
  props: {
    id: [String, Number]
  },
  setup(props) {
    const following = ref([])
    const followingShow = ref(false)
    const follower = ref([])
    const followerShow = ref(false)
    const store = useAppStore()

    const update = async () => {
      if (props?.id === null) {
        following.value = (await http.get('/api/user/following/list')).data
        follower.value = (await http.get('/api/user/follower/list')).data
      } else {
        const params = { params: {id: props.id}}
        following.value = (await http.get('/api/user/following/list', params)).data
        follower.value = (await http.get('/api/user/follower/list', params)).data
      }
    }

    onMounted(() => {
      update()
    })
    watch(
      () => store.followTextUpdateCount,
      () => {
        update()
      }
    )

    return {
      following,
      follower,
      followingShow,
      followerShow
    }
  }
})

</script>