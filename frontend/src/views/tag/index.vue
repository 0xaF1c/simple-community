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
          {{ postData.length }} {{ $t('post.name') }}
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

    {{postData}}
    <n-empty v-if="postData.length === 0" :description="$t('emtry.name')"></n-empty>
    <post-card v-for="t in postData" :post="t"></post-card>
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
import postCard from '../../components/postCard/postCard.vue'
import { ref, watch } from 'vue'
import { http } from '../../utils/http'
import { ChevronLeft24Filled } from '@vicons/fluent'

export default defineComponent({
  components: {
    NCard,
    postCard,
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
    const postData = ref<Record<string, any>>([])

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

      http.get('/api/tag/posts', {
        params: {
          id: route.query.id
        }
      })
        .then((res) => {
          const task: Array<Promise<any>> = []
          tagData.value = res.data
          tagData.value?.posts.forEach((postId: string) => {
            task.push(http.get('/api/post/detail', {
              params: {
                id: postId
              }
            }))
          })
          Promise.all(task)
            .then((data) => {
              postData.value = data.map(i => i.data)
              console.log('postData')
              console.log(postData.value)
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
      postData,
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