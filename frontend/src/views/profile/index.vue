<template>
  <n-el style="padding: 0 15px;">
    <n-card style="margin-bottom: -10px;">
      <template #header>
        <n-button quaternary circle @click="$router.back()">
          <n-icon :component="ChevronLeft24Filled"></n-icon>
        </n-button>
        {{ renderData.name }}@{{ renderData.account }}
      </template>
      <template #header-extra>
        <n-space align="center">
          {{ tweets.length }} {{ $t('tweet.name') }}
        </n-space>
      </template>
    </n-card>
    <n-card bordered>
      <n-result v-if="renderData === null" status="404" title="404 资源不存在" description="生活总归带点荒谬"></n-result>
      <template #cover>
        <n-image :src="renderData.backgroundUrl"></n-image>
      </template>
      <template #header>
        <n-space align="center">
          <n-avatar circle :size="100" :src="renderData.avatarUrl" object-fit="cover"></n-avatar>
          <n-el>
            <n-el>{{ renderData.name }}@{{ renderData.account }}</n-el>
            <n-el>{{ renderData.description }}</n-el>
            <n-el style="font-size: 0.9rem; opacity: 0.6;">{{ renderData.email }}</n-el>
          </n-el>
        </n-space>
      </template>
      <n-divider title-placement="left">{{ $t('tweet.name') }}</n-divider>
      <n-el v-for="t in tweets" style="margin: 10px 0;">
        <n-time :time="new Date(t.updateTime)" type="datetime"></n-time>
        <tweet-card :tweet="t" />
      </n-el>
    </n-card>
  </n-el>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import TweetCard from '../../components/tweetCard/tweetCard.vue'
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
  NIcon
} from 'naive-ui'

import {
  ChevronLeft24Filled
} from '@vicons/fluent'
import { useRoute } from 'vue-router'
import { http } from '../../utils/http'

export default defineComponent({
  components: {
    NCard,
    NEl,
    NAvatar,
    NResult,
    NImage,
    NSpace,
    NDivider,
    TweetCard,
    NTime,
    NButton,
    NIcon
  },
  setup() {
    const route = useRoute()
    const isSelf = ref(false)
    const renderData = ref<any>({})
    const tweets = ref<any>([])

    const update = async () => {
      const id = route.query.id
      const res = await http.get('/api/user/status')
      isSelf.value = Number(res.data.id) === Number(id)
      if (isSelf.value) {
        renderData.value = res.data
      } else {
        renderData.value = (await http.get(`/api/user/profile`, { params: { id: id } })).data        
      }
      tweets.value = (await http.get('/api/user/tweets', {
        params: {
          id: id
        }
      })).data.tweets
      
      tweets.value = tweets.value.sort((a:any, b:any) => {
        const t = (v: any) => new Date(v).getTime()
        return t(b.updateTime) - t(a.updateTime)
      })
    }
    watch(
      () => route.query,
      () => {
        update()
      }
    )
    return {
      renderData,
      isSelf,
      tweets,
      update,
      ChevronLeft24Filled
    }
  },
  mounted() {
    this.update()
  }
})

</script>