<template>
  <n-modal
    :show="show"
    @update-show="(v: any) => $emit('update:show', v)"
    preset="card"
    :style="{
      width: '550px',
    }"
    size="huge"
    :bordered="true"
    :segmented="{
      content: 'soft',
      footer: 'soft',
    }"
  >
    <template #header>
      {{ $t('post_pub.name') }}
    </template>
    <template #default>
      <n-space vertical>
        <n-input
          v-model:value="title"
          type="text"
          :placeholder="$t('input_post_title.name')"
        ></n-input>
        <n-input
          v-model:value="content"
          type="textarea"
          :placeholder="$t('share_your_ideas.name')"
        ></n-input>
      </n-space>
    </template>
    <template #footer>
      <n-space>
        <n-button
          :loading="loading"
          :disabled="loading"
          @click="submit"
          type="primary"
          >{{ $t('submit.name') }}</n-button
        >
        <n-button>{{ $t('draft.name') }}</n-button>
      </n-space>
    </template>
  </n-modal>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { headers, http } from '../../utils/http'
import {
  NModal,
  NInput,
  NButton,
  NSpace,
  NUpload,
  NDynamicTags,
  NDivider,
  NEl,
  NIcon,
  useMessage,
} from 'naive-ui'
import { CaretDown24Filled } from '@vicons/fluent'
import selectTag from '../tag/selectTag.vue'
import myTag from '../tag/tag.vue'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
export default defineComponent({
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:show'],
  components: {
    NModal,
    NInput,
    NButton,
    NSpace,
    NUpload,
    NDynamicTags,
    NDivider,
    NEl,
    NIcon,
    selectTag,
    myTag,
  },
  setup(_, { emit }) {
    const { error, success } = useMessage()
    const { t } = useI18n()
    const title = ref('')
    const content = ref('')
    const loading = ref(false)
    const submit = () => {
      if (title.value.length <= 0) return
      if (content.value.length <= 0) return

      loading.value = true
      http
        .post('/api/tag/create', {
          title: title.value,
          description: content.value,
        })
        .then(result => {
          success(t('publish_post_success.name'))
          setTimeout(() => {
            loading.value = false
            emit('update:show', false)
          }, 200)
        })
        .catch(err => {
          error(err.name)
          setTimeout(() => {
            loading.value = false
          }, 200)
        })
    }
    const onUploadRemove = ({ file }: { file: UploadFileInfo }) => {
      uploadsImage.delete(file.id)
    }
    const onUploadFinish = ({
      file,
      event,
    }: {
      file: UploadFileInfo
      event?: ProgressEvent
    }) => {
      console.log(file)
      const { data } = JSON.parse(
        (event?.target as XMLHttpRequest).responseText,
      )
      uploadsImage.set(file.id, data.key)
    }
    return {
      uploadShow,
      addTagsShow,
      choosedTag,
      headers,
      title,
      content,
      loading,
      submit,
      onUploadFinish,
      onUploadRemove,
      CaretDown24Filled,
    }
  },
})
</script>
