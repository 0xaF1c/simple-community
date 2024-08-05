<template>
  <n-modal
    :show="show"
    @update:show="_ => $emit('update:show', _)"
    preset="card"
    :style="{ width: '550px' }"
    size="huge"
    :bordered="true"
  >
    <template #cover>
      <n-image :src="userData.backgroundUrl"></n-image>
    </template>
    <n-form>
      <n-upload>
        <n-button
          circle
          size="large"
          :style="{
            width: `182px`,
            height: `182px`,
            padding: '0',
            borderRadius: '10000px'
          }"
        >
          <template #icon>
            <n-avatar
              circle
              :size="100"
              :src="userData.avatarUrl"
              object-fit="cover"
              :img-props="{
                style: {
                  width: `180px`,
                  height: `180px`,
                  margin: 0
                }
              }"
              :style="{
                margin: 0,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'absolute',
                width: `180px`,
                height: `180px`
              }"
            ></n-avatar>
          </template>
        </n-button>
      </n-upload>
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
        <n-button type="primary">{{ $t('confirm.name') }}</n-button>
        <n-button secondary>{{ $t('cancel.name') }}</n-button>
      </n-space>
    </n-form>
    {{ userData }}
  </n-modal>
</template>

<script setup lang="ts">
import {
  NForm,
  NFormItemRow,
  NInput,
  NButton,
  NInputGroup,
  NImage,
  NUpload,
  NAvatar,
  NModal,
  NSpace
} from 'naive-ui'
import { onMounted } from 'vue'

const emits = defineEmits<{
  (e: 'update:show', value: boolean): void
}>()

const props = defineProps<{
  userData: any
  show: boolean
}>()

const update = () => {
  console.log(props.userData)
}

onMounted(() => {
  update()
})
</script>
