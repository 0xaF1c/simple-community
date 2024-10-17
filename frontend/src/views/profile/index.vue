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
          objectFit="cover"
          :style="{
            width: '100%',
            height: '400px',
          }"
          :img-props="{
            objecFit: 'cover',
            style: {
              width: '100%',
              height: '400px',
              objecFit: 'cover',
              objectPosition: 'center top',
            },
          }"
          v-if="!emtry"
          :src="renderData.backgroundUrl"
        ></n-image>
      </template>
      <template #header>
        <n-space align="center">
          <n-avatar
            circle
            :size="100"
            :src="renderData.avatarUrl"
            object-fit="cover"
          >
            <!-- <n-icon style="opacity: 0.1;" :component="ChevronLeft24Filled"></n-icon> -->
          </n-avatar>
          <n-el>
            <n-el>
              <span :contenteditable="edit_mode">
                {{ renderData.name }}
              </span>
              @
              <span :contenteditable="edit_mode">
                {{ renderData.account }}
              </span>
            </n-el>
            <n-el :contenteditable="edit_mode">{{
              renderData.description
            }}</n-el>
            <n-el style="font-size: 0.9rem; opacity: 0.6">{{
              renderData.email
            }}</n-el>
            <follow-text :id="id"></follow-text>
          </n-el>
        </n-space>
      </template>
      <template #header-extra>
        <n-space>
          <follow-button :id="renderData.id"></follow-button>
          <n-button
            v-if="isSelf"
            @click="edit_mode = !edit_mode"
            :secondary="!edit_mode"
          >
            <span v-show="!edit_mode">{{ $t('edit') }}</span>
            <span v-show="edit_mode">{{ $t('editCancel') }}</span>
          </n-button>
        </n-space>
      </template>
      <n-divider title-placement="left">{{ $t('post.name') }}</n-divider>
      <n-el v-for="t in posts" style="margin: 10px 0">
        <post-card :post="t" />
      </n-el>
    </n-card>
    <edit-profile
      v-model:show="edit_mode"
      :user-data="renderData"
      @update-profile="update()"
    ></edit-profile>
  </n-el>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from 'vue'
import PostCard from '../../components/postCard/postCard.vue'
import FollowButton from '../../components/follow/followButton.vue'
import editProfile from './editProfile.vue'
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
  NTooltip,
  NInput,
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
    FollowButton,
    NInput,
    editProfile,
  },
  setup() {
    const route = useRoute()
    const isSelf = ref(false)
    const renderData = ref<any>({})
    const posts = ref<any>([])
    const emtry = ref(true)
    const id: any = computed(() => route.query.id)
    const req_id = ref(id.value)
    const edit_mode = ref<boolean>(false)

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
            params: { id: id.value },
          })
        ).data
      }
      posts.value =
        (
          await http.get('/api/user/posts', {
            params: {
              id: req_id.value,
            },
          })
        ).data?.posts ?? []

      posts.value = posts.value.sort((a: any, b: any) => {
        const t = (v: any) => new Date(v).getTime()
        return t(b.updateTime) - t(a.updateTime)
      })

      emtry.value = JSON.stringify(renderData.value) === '{}'
    }
    onMounted(() => {
      update()
    })
    watch(
      () => route.query,
      () => {
        update()
      },
    )
    return {
      id,
      renderData,
      isSelf,
      posts,
      edit_mode,
      emtry,
      update,
      ChevronLeft24Filled,
    }
  },
})
</script>
