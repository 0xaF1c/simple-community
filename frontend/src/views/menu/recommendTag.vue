<template>
  <n-card :bordered="false">
    <n-el style="font-size: 1.3rem">{{ $t('tag_recommend.name') }}</n-el>
    <n-space vertical style="margin-top: 10px">
      <n-ellipsis :tooltip="false">
        <tag v-for="t in data" :tag="t" :width="145"</tag>
      </n-ellipsis>
    </n-space>
  </n-card>
</template>

<script lang="ts">
import { defineComponent, type Ref, ref } from 'vue'
import tag from '../../components/tag/tag.vue'
import { http } from '../../utils/http'
import { NEl, NCard, NSpace, NEllipsis } from 'naive-ui'

const getData = async (data: Ref<any>) => {
  data.value = (await http.get('/api/tag/recommend')).data
}
export default defineComponent({
  components: {
    tag,
    NCard,
    NSpace,
    NEl,
    NEllipsis,
  },
  setup() {
    const data = ref<any>([])

    getData(data)

    return {
      data,
    }
  },
})
</script>
