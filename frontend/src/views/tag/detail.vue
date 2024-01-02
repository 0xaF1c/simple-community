<template>
  <n-el style="padding: 0 15px;">
    <n-card :bordered="false" style="margin-bottom: -10px;">
      <template #header>
        <n-button quaternary circle @click="$router.back()">
          <n-icon :component="ChevronLeft24Filled"></n-icon>
        </n-button>
        {{ tagDetail?.title }}
      </template>
      <template #header-extra>
        <n-space align="center">
          {{ tweetData.length }} {{ $t('tag.name') }}
        </n-space>
      </template>
    </n-card>
    <n-divider style="margin: 0;"></n-divider>
    <n-card :bordered="false">
      <template #header>
        <n-space align="center">
          <n-image :height="100" :width="100" object-fit="cover" :src="tagDetail?.poster"></n-image>
          <n-el>
            <n-el style="font-size: 2rem;">
              {{ tagDetail?.title }}
            </n-el>
            <n-el>
              {{ tagDetail?.description }}
            </n-el>
          </n-el>
        </n-space>
      </template>
    </n-card>

    <n-empty v-if="tweetData.length === 0" :description="$t('emtry.name')"></n-empty>
    <tweet-card v-for="t in tweetData" :tweet="t"></tweet-card>
  </n-el>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import {
  NCard,
  useLoadingBar,
  useMessage,
  NImage,
  NSpace,
  NEl,
  NEmpty,
  NButton,
  NIcon,
  NDivider
} from 'naive-ui'
import tweetCard from '../../components/tweetCard/tweetCard.vue'
import { ref, watch } from 'vue'
import { http } from '../../utils/http'
import { ChevronLeft24Filled } from '@vicons/fluent'

export default defineComponent({
  components: {
    NCard,
    tweetCard,
    NImage,
    NSpace,
    NEl,
    NEmpty,
    NButton,
    NIcon,
    NDivider,
  },
  setup() {
    const { error } = useMessage()
    const loadingBar = useLoadingBar()
    const route = useRoute()
    const tagData = ref()
    const tagDetail = ref()
    const tweetData = ref<Record<string, any>>([])

    const update = () => {
      http.get('/api/tag/detail', {
        params: {
          id: route.query.id
        }
      })
        .then((res) => {
          tagDetail.value = res.data
        })
        .catch(e => {
          error(e.name)
          loadingBar.error()
        })

      http.get('/api/tag/tweets', {
        params: {
          id: route.query.id
        }
      })
        .then((res) => {
          const task: Array<Promise<any>> = []
          tagData.value = res.data
          tagData.value?.tweets.forEach((tweetId: string) => {
            task.push(http.get('/api/tweet/detail', {
              params: {
                id: tweetId
              }
            }))
          })
          Promise.all(task)
            .then((data) => {
              tweetData.value = data.map(i => i.data)
              loadingBar.finish()
            })
            .catch(e => {
              error(e.name)
              loadingBar.error()
            })

          loadingBar.finish()
        })
        .catch(e => {
          error(e.name)
          loadingBar.error()
        })
    }

    watch(
      () => route.query,
      () => {
        update()
      }
    )
    return {
      tweetData,
      tagData,
      loadingBar,
      tagDetail,
      update,
      ChevronLeft24Filled
    }
  },
  mounted() {
    this.loadingBar.start()
    this.update()
  }
})

</script>