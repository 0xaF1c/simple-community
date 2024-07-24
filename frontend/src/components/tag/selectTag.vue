<template>
  <n-space>
    <n-button @click="chooseTagShow = !chooseTagShow" quaternary>
      <n-icon :component="Add24Filled"></n-icon>
    </n-button>
    <n-modal
      v-model:show="chooseTagShow"
      preset="card"
      size="huge"
      :bordered="true"
      :style="{
        width: '550px'
      }"
      :segmented="{
        content: 'soft',
        footer: 'soft'
      }"
    >
      <template #header>
        {{ $t('tag_recommend.name') }}
        <n-button quaternary circle @click="updateTag">
          <n-icon :component="ArrowRepeatAll24Regular"></n-icon>
        </n-button>
      </template>
      <n-space style="margin-top: 5px;" item-style="margin-top: 12px">
        <n-tooltip v-for="(tag, i) in data" :style="{
          width: tag.poster ? '100px' : 'auto'
        }">
          <template #trigger>
            <n-checkbox-group
              v-model:value="choosedTagIndex"
            >
              <n-checkbox :value="i" :label="tag.title"></n-checkbox>
            </n-checkbox-group>
          </template>
          <n-space vertical align="center">
            <n-avatar :src="tag.poster" :size="100"></n-avatar>
            {{ tag.description }}
          </n-space>
        </n-tooltip>
      </n-space>
      <template #footer>
        <n-space>
          <n-button @click="confirm" type="primary">{{ $t('confirm.name') }}</n-button>
          <n-button @click="cancel">{{ $t('cancel.name') }}</n-button>
        </n-space>
      </template>
    </n-modal>
  </n-space>
</template>

<script lang="ts">
import {
  NTag,
  NSpace,
  NButton,
  NIcon,
  NModal,
  NCheckbox,
  NTooltip,
  NAvatar,
  NEl,
  NCheckboxGroup
} from 'naive-ui'
import { defineComponent, onMounted, ref } from 'vue'
import { http } from '../../utils/http'
import myTag from './tag.vue'
import {
  Add24Filled,
  ArrowRepeatAll24Regular
} from '@vicons/fluent'

export default defineComponent({
  components: {
    NTag,
    NSpace,
    NButton,
    NIcon,
    myTag,
    NModal,
    NCheckbox,
    ArrowRepeatAll24Regular,
    NTooltip,
    NAvatar,
    NEl,
    NCheckboxGroup
  },
  props: {
    value: {
      type: Array,
      default: []
    }
  },
  emits: [
    'update:value'
  ],
  computed: {
    choosedTag() {
      return this.choosedTagIndex.map((i:any) => this.data[i])
    }
  },
  setup(_props, { emit }) {
    const chooseTagShow = ref(false)
    const choosedTagIndex = ref([])
    const data = ref<any>([])
    const updateTag = async () => {
      data.value = (await http.get('/api/tag/recommend')).data
    }
    const confirm = () => {
      chooseTagShow.value = false
      emit('update:value', choosedTagIndex.value.map((i:any) => data.value[i]))
    }
    const cancel = () => {
      chooseTagShow.value = false
      choosedTagIndex.value = []
      emit('update:value', [])
    }

    onMounted(() => {
      updateTag()
    })

    return {
      choosedTagIndex,
      chooseTagShow,
      data,
      confirm,
      cancel,
      updateTag,
      Add24Filled,
      ArrowRepeatAll24Regular
    }
  }
})

</script>