<template>
  <n-modal
    :show="show"
    @update-show="(v: any) => $emit('update:show', v)"
    preset="card" role="dialog" :style="{ width: '550px' }"
    size="huge"
    :bordered="true"
    style="width: 800px;"
    :closable="false"
    :on-close="userDetail"
  >
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
        <n-avatar circle :size="100" :src="renderData.avatarUrl" object-fit="cover"></n-avatar>
        <n-el>
          <n-el>{{ renderData.name }}@{{ renderData.account }}</n-el>
          <n-el>{{ renderData.description }}</n-el>
          <n-el style="font-size: 0.9rem; opacity: 0.6;">{{ renderData.email }}</n-el>
          <follow-text :id="renderData.id"></follow-text>
        </n-el>
        <follow-button :id="renderData.id" @_update="update()"></follow-button>
      </n-space>
    </template>
    <template #header-extra>
      <n-button text @click="userDetail">{{$t('detailInfo')}}</n-button>
    </template>
  </n-modal>
</template>

<script lang="ts">
import { NModal } from 'naive-ui'
import { defineComponent, ref, watch } from 'vue';
import FollowButton from '../follow/followButton.vue'
import FollowText from '../follow/text.vue'
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

import {
  ChevronRight24Filled
} from '@vicons/fluent'
import { useRoute, useRouter } from 'vue-router'

type IUserCardProps = {
  show: Boolean,
  userData: any
}

export default defineComponent({
  components: {
    NModal,
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
    FollowButton,
    FollowText
  },
  props: {
    show: {
      required: true,
      type: Boolean
    },
    userData: {
      required: true,
    }
  },
  setup(props: IUserCardProps, context) {
    const route = useRoute()
    const isSelf = ref(false)
    const renderData = ref<any>({})
    const posts = ref<any>([])
    const emtry = ref(true)
    const router = useRouter()
    const userDetail = () => {
      router.push({
        path: `/profile?id=${props.userData.id}`,
        name: 'profile',
        query: { id: props.userData.id }
      })
      context.emit('update:show', false)
    }

    const update = async () => {
      // const id = route.query.id
      renderData.value = props.userData

      emtry.value = JSON.stringify(renderData) === '{}'
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
      posts,
      emtry,
      update,
      userDetail,
      ChevronRight24Filled
    }
  },
  mounted() {
    this.update()
  }
})
</script>