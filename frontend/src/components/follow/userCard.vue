<template>
  <n-modal v-model:show="show">
    <n-el style="padding: 0 15px;">
      <n-card style="margin-bottom: -10px;" :bordered="false">
        <template #header>
          <n-button quaternary circle @click="$router.back()">
            <n-icon :component="ChevronLeft24Filled"></n-icon>
          </n-button>
          {{ renderData.name }}@{{ renderData.account }}
        </template>
      </n-card>
    </n-el>
  </n-modal>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
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

import {
  ChevronLeft24Filled
} from '@vicons/fluent'
import { useRoute } from 'vue-router'
import { http } from '../../utils/http'
import FollowText from '../../components/follow/text.vue'

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
    const emtry = ref(true)
    const show = ref(true)

    const update = async () => {
      const id = route.query.id
      const res = await http.get('/api/user/status')      

      isSelf.value = Number(res.data.id) === Number(id)
      if (isSelf.value) {
        renderData.value = res.data
      } else {
        renderData.value = (await http.get(`/api/user/profile`, { params: { id: id } })).data
      }

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
      update,
      emtry,
      show,
      ChevronLeft24Filled
    }
  },
  mounted() {
    this.update()
  }
})

</script>