<template>
  <n-modal
    :show="show"
    @update:show="_ => $emit('update:show', _)"
    preset="card"
    :style="{ width: '750px' }"
    size="huge"
    :bordered="true"
  >
    <template #cover>
      <n-image
        objectFit="cover"
        :style="{
          width: '100%',
          height: '400px'
        }"
        :img-props="{
          style: {
            width: '100%',
            height: '400px',
            objectPosition: 'center top'
          }
        }"
        :src="userData.backgroundUrl"
      ></n-image>
    </template>
    <n-form>
      <n-space align="center">
        <n-avatar
          circle
          :size="100"
          :src="uploadAvatar"
          object-fit="cover"
        ></n-avatar>
        <n-upload
          accept="image/*"
          :multiple="false"
          name="image"
          :max="1"
          :headers="headers"
          @finish="onUploadFinish"
          action="/api/image/upload"
        >
          <n-button>{{ $t('upload_avatar') }}</n-button>
        </n-upload>
      </n-space>
      <n-form-item-row :label="$t('change_user_name')">
        <n-input
          placeholder=""
          v-model:value="userData.name"
        ></n-input>
      </n-form-item-row>
      <n-form-item-row :label="$t('change_account')">
        <n-input
          placeholder=""
          v-model:value="userData.account"
        ></n-input>
      </n-form-item-row>
      <n-form-item-row :label="$t('change_description')">
        <n-input
          placeholder=""
          v-model:value="userData.description"
        ></n-input>
      </n-form-item-row>
      <n-space>
        <n-button type="primary">{{
          $t('confirm.name')
        }}</n-button>
        <n-button secondary>{{ $t('cancel.name') }}</n-button>
      </n-space>
    </n-form>
  </n-modal>
</template>

<script setup lang="ts">
import {
  NForm,
  NFormItemRow,
  NInput,
  NButton,
  NImage,
  NUpload,
  NAvatar,
  NModal,
  NSpace,
  UploadFileInfo
} from 'naive-ui'
import { onMounted, ref } from 'vue'
import { headers } from '../../utils/http'

const emits = defineEmits<{
  (e: 'update:show', value: boolean): void
}>()

const props = defineProps<{
  userData: any
  show: boolean
}>()
const uploadAvatar = ref(null)

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
  uploadAvatar.value = data.url
  console.log(uploadAvatar.value)
}
const update = () => {
  console.log(props.userData)
}

onMounted(() => {
  uploadAvatar.value = props.userData.avatarUrl
  update()
})
</script>
