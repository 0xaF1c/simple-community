<template>
  <n-upload
    accept="image/*"
    :multiple="false"
    name="image"
    :show-file-list="true"
    :headers="headers"
    @finish="onUploadFinish"
    action="/api/image/upload"
    class="container"
    directory-dnd
  >
    <n-upload-dragger class="dragger">
      <img
        :src="preview ?? url"
        :style="{
          width: '100%',
          objectPosition: 'center top',
          objectFit: 'cover'
        }"
      />
      <div class="mask">
        <n-icon :size="35">
          <ArrowUpload24Filled />
        </n-icon>
        {{ $t('drag_upload') }}
      </div>
    </n-upload-dragger>
  </n-upload>
</template>

<style scoped>
.container {
  position: relative;
  cursor: pointer;
  width: 100%;
  height: 400px;
  overflow: hidden;
  margin: 0;
  padding: 0;
}
.dragger {
  margin: 0;
  padding: 0;
  border: none;
}
.mask {
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  background: #000;
  opacity: 0;
  transition: all 0.15s;
  width: 100%;
  height: 100%;
  color: #eee;
}
.container:hover .mask {
  opacity: 0.55;
}
</style>

<script lang="ts" setup>
import {
  NUpload,
  NIcon,
  UploadFileInfo,
  NUploadDragger
} from 'naive-ui'
import { headers } from '../../utils/http'
import { ref } from 'vue'
import { ArrowUpload24Filled } from '@vicons/fluent'
const preview = ref(null)

defineProps<{
  url: string
}>()

const emit = defineEmits<{
  (e: 'update-key', value: string): void
  (e: 'update:url', value: string): void
}>()

const onUploadFinish = ({
  file,
  event
}: {
  file: UploadFileInfo
  event?: ProgressEvent
}) => {
  const { data } = JSON.parse(
    (event?.target as XMLHttpRequest).responseText
  )
  // Fxxk Volar
  if (false) console.log(file)
  preview.value = data.preview
  emit('update-key', data.key)
}
</script>
