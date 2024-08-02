<template>
  <n-el style="padding: 0 15px">
    <n-card style="margin-bottom: -10px" :bordered="false">
      <template #header>
        <n-button quaternary circle @click="$router.back()">
          <n-icon :component="ChevronLeft24Filled"></n-icon>
        </n-button>
        {{ renderData.name }}@{{ renderData.account }}
      </template>
      <template #header-extra>
        <n-space align="center">
          {{ posts.length }} {{ $t('post.name') }}
        </n-space>
      </template>
    </n-card>
    <n-card :bordered="false">
      <n-result
        v-if="emtry"
        status="404"
        title="404 资源不存在"
        description="生活总归带点荒谬"
      ></n-result>
      <template #cover>
        <n-image
          :style="{
            width: '100%'
          }"
          v-if="!emtry"
          :src="renderData.backgroundUrl"
        ></n-image>
      </template>
      <template #header>
        <n-space align="center" v-if="!emtry">
          <n-avatar
            circle
            :size="100"
            :src="renderData.avatarUrl"
            object-fit="cover"
          ></n-avatar>
          <n-el>
            <n-el
              >{{ renderData.name }}@{{
                renderData.account
              }}</n-el
            >
            <n-el>{{ renderData.description }}</n-el>
            <n-el style="font-size: 0.9rem; opacity: 0.6">{{
              renderData.email
            }}</n-el>
            <follow-text :id="id"></follow-text>
          </n-el>
        </n-space>
      </template>
      <template #header-extra>
        <follow-button
          :id="renderData.id"
          @_update="update()"
        ></follow-button>
      </template>
      <n-divider title-placement="left">{{
        $t('post.name')
      }}</n-divider>
      <n-el v-for="t in posts" style="margin: 10px 0">
        <post-card :post="t" />
      </n-el>
    </n-card>
  </n-el>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  ref,
  watch
} from 'vue'
import PostCard from '../../components/postCard/postCard.vue'
import FollowButton from '../../components/follow/followButton.vue'
import {
  NCard,
  NEl,
  NAvatar,
  NResult,
  NImage,
  NSpace,
  NDivider,
  NTime,
  NButton,
  NIcon,
  NTooltip
} from 'naive-ui'

import { ChevronLeft24Filled } from '@vicons/fluent'
import { useRoute } from 'vue-router'
import { http } from '../../utils/http'
import FollowText from '../../components/follow/text.vue'
import { useAppStore } from '../../store/index'
export default defineComponent({
  components: {
    NCard,
    NEl,
    NAvatar,
    NResult,
    NImage,
    NSpace,
    NDivider,
    PostCard,
    NTime,
    NButton,
    NIcon,
    NTooltip,
    FollowText,
    FollowButton
  },
  setup() {
    const route = useRoute()
    const isSelf = ref(false)
    const renderData = ref<any>({})
    const posts = ref<any>([])
    const emtry = ref(true)
    const id: any = computed(() => route.query.id)
    const req_id = ref(id.value)

    const { followTextUpdate } = useAppStore()

    const update = async () => {
      const res = await http.get('/api/user/status')

      followTextUpdate()
      if (id.value === undefined) {
        isSelf.value = true
        req_id.value = res.data.id
      } else {
        isSelf.value = Number(res.data.id) === Number(id.value)
      }
      if (isSelf.value) {
        renderData.value = res.data
      } else {
        renderData.value = (
          await http.get(`/api/user/profile`, {
            params: { id: id.value }
          })
        ).data
      }
      posts.value =
        (
          await http.get('/api/user/posts', {
            params: {
              id: req_id.value
            }
          })
        ).data?.posts ?? []

      posts.value = posts.value.sort((a: any, b: any) => {
        const t = (v: any) => new Date(v).getTime()
        return t(b.updateTime) - t(a.updateTime)
      })
      emtry.value = JSON.stringify(renderData) === '{}'
    }
    onMounted(() => {
      update()
    })
    watch(
      () => route.query,
      () => {
        update()
      }
    )
    return {
      id,
      renderData,
      isSelf,
      posts,
      update,
      emtry,
      ChevronLeft24Filled
    }
  }
})
</script>
