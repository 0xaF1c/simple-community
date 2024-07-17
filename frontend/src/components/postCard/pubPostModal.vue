<template>
  <n-modal :show="show" @update-show="(v: any) => $emit('update:show', v)" preset="card" :style="{
    width: '550px'
  }" size="huge" :bordered="true" :segmented="{
    content: 'soft',
    footer: 'soft'
  }">
    <template #header>
      {{ $t('post_pub.name') }}
    </template>
    <template #default>
      <n-space vertical>
        <n-input v-model:value="title" type="text" :placeholder="$t('input_post_title.name')"></n-input>
        <n-input v-model:value="content" type="textarea" :placeholder="$t('share_your_ideas.name')"></n-input>

        <n-divider style="margin: 5px 0;" title-placement="left">
          <n-el style="margin-right: 10px;">{{ $t('add_tags.name') }}</n-el>
          <n-button circle quaternary @click="addTagsShow = !addTagsShow">
            <n-icon :style="{
              transition: 'all 0.5s',
              transform: addTagsShow ? 'rotate(180deg)' : 'rotate(0deg)'
            }" :component="CaretDown24Filled"></n-icon>
          </n-button>
        </n-divider>
        <n-space align="center" v-show="addTagsShow">
          <my-tag v-for="t in choosedTag" :tag="t"></my-tag>
          <selectTag v-model:value="choosedTag" />
        </n-space>

        <n-divider style="margin: 5px 0;" title-placement="left">
          <n-el style="margin-right: 10px;">{{ $t('upload_post_image.name') }}</n-el>
          <n-button circle quaternary @click="uploadShow = !uploadShow">
            <n-icon :style="{
              transition: 'all 0.5s',
              transform: uploadShow ? 'rotate(180deg)' : 'rotate(0deg)'
            }" :component="CaretDown24Filled"></n-icon>
          </n-button>
        </n-divider>
        <n-upload accept="image/*" v-show="uploadShow" :default-file-list="[]" list-type="image-card" name="image"
          action="/api/image/upload" :headers="headers" @finish="onUploadFinish" :on-remove="onUploadRemove">
          {{ $t('upload.name') }}
        </n-upload>
      </n-space>
    </template>
    <template #footer>
      <n-space>
        <n-button :loading="loading" :disabled="loading" @click="submit" type="primary">{{ $t('submit.name')
          }}</n-button>
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
  UploadFileInfo,
  useMessage,
} from 'naive-ui'
import {
  CaretDown24Filled,
} from '@vicons/fluent'
import selectTag from '../tag/selectTag.vue'
import myTag from '../tag/tag.vue'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
export default defineComponent({
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  emits: [
    'update:show'
  ],
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
    myTag
  },
  setup(_, { emit }) {
    const { error, success } = useMessage()
    const { t } = useI18n()
    const uploadShow = ref(false)
    const addTagsShow = ref(false)
    const title = ref('')
    const content = ref('')
    const choosedTag = ref<any>([])
    const uploadsImage = new Map()
    const loading = ref(false)
    const submit = () => {
      if (title.value.length <= 0) return
      if (content.value.length <= 0) return
      const images = Array.from(uploadsImage, ([_, value]) => value)
      const tags = choosedTag.value.map((t: any) => t.id)
      loading.value = true
      http.post('/api/post/publish', {
        title: title.value,
        content: content.value,
        tags,
        images,
      })
        .then((result) => {
          console.log(result)
          success(t('publish_post_success.name'))
          setTimeout(() => {
            loading.value = false
            emit('update:show', false)
          }, 200);
        })
        .catch((err) => {
          error(err.name)
          setTimeout(() => {
            loading.value = false
          }, 200);
        })

    }
    const onUploadRemove = ({ file }: { file: UploadFileInfo }) => {
      uploadsImage.delete(file.id)
    }
    const onUploadFinish = ({
      file,
      event
    }: {
      file: UploadFileInfo
      event?: ProgressEvent
    }) => {
      console.log(file);
      const { data } = JSON.parse((event?.target as XMLHttpRequest).responseText)
      uploadsImage.set(file.id, data.url)
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
  }
})
</script>