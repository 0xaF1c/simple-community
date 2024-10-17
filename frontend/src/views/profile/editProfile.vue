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
      <upload-background-component
        :url="userData.backgroundUrl"
        @update-key="key => (uploadBackground = key)"
      ></upload-background-component>
    </template>
    <n-form>
      <n-space align="center">
        <upload-avatar-component
          :url="userData.avatarUrl"
          @update-key="key => (uploadAvatar = key)"
        ></upload-avatar-component>
      </n-space>
      <n-form-item-row :label="$t('change_user_name')">
        <n-input placeholder="" v-model:value="userData.name"></n-input>
      </n-form-item-row>
      <n-form-item-row :label="$t('change_account')">
        <n-input placeholder="" v-model:value="userData.account"></n-input>
      </n-form-item-row>
      <n-form-item-row :label="$t('change_description')">
        <n-input placeholder="" v-model:value="userData.description"></n-input>
      </n-form-item-row>
      <n-space>
        <n-button type="primary" @click="onSubmitClick">{{
          $t('confirm.name')
        }}</n-button>
        <n-button secondary @click="emits('update:show', false)">{{
          $t('cancel.name')
        }}</n-button>
      </n-space>
    </n-form>
  </n-modal>
</template>

<script setup lang="ts">
import { NForm, NFormItemRow, NInput, NButton, NModal, NSpace } from 'naive-ui'

import { onMounted, ref } from 'vue'
import uploadAvatarComponent from '../../components/upload/uploadAvatar.vue'
import uploadBackgroundComponent from '../../components/upload/uploadBackground.vue'
import { http } from '../../utils/http'
const emits = defineEmits<{
  (e: 'update:show', value: boolean): void
  (e: 'update-profile', value: null): void
}>()

const props = defineProps<{
  userData: any
  show: boolean
}>()
const uploadAvatar = ref(null)
const uploadBackground = ref(null)

const onSubmitClick = () => {
  http
    .post('/api/user/profile/update', {
      name: props.userData.name,
      account: props.userData.account,
      description: props.userData.description,
      backgroundUrl: uploadBackground.value,
      avatarUrl: uploadAvatar.value,
    })
    .then(() => {
      emits('update:show', false)
      emits('update-profile', null)
    })
    .catch(console.log)
}
const update = () => {
  // console.log(props.userData)
}

onMounted(() => {
  uploadAvatar.value = props.userData.avatarUrl
  update()
})
</script>
