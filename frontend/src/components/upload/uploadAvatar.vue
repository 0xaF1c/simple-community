<template>
  <n-tooltip>
    {{ $t('upload_avatar') }}
    <template #trigger>
      <n-upload
        accept="image/*"
        :multiple="false"
        name="image"
        :show-file-list="false"
        :headers="headers"
        @finish="onUploadFinish"
        action="/api/image/upload"
        class="container"
      >
        <n-avatar
          class="trigger"
          circle
          :size="100"
          :src="preview ?? url"
          object-fit="cover"
        ></n-avatar>
        <div class="mask">
          <n-icon :size="35">
            <ArrowUpload24Filled />
          </n-icon>
        </div>
      </n-upload>
    </template>
  </n-tooltip>
</template>

<style scoped>
.container {
  position: relative;
  cursor: pointer;
}
.mask {
  position: absolute;
  left: 0;
  top: 0;
  width: 100px;
  height: 100px;
  border-radius: 1000000px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  background: #000;
  opacity: 0;
  transition: all 0.15s;
  color: #eee;
}
.container:hover .mask {
  opacity: 0.55;
}
</style>

<script lang="ts" setup>
import {
  NUpload,
  NAvatar,
  NTooltip,
  NIcon,
  UploadFileInfo
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
