<template>
  <n-el style="padding: 0 15px">
    <n-card :bordered="false">
      <template #cover>
        <n-image
          :style="{
            width: '100%'
          }"
          :src="userData.backgroundUrl"
        ></n-image>
      </template>
      <template #header>
        <n-space align="center">
          <n-avatar
            circle
            :size="100"
            :src="userData.avatarUrl"
            object-fit="cover"
          ></n-avatar>
          <n-el>
            <n-el
              >{{ userData.name }}@{{ userData.account }}</n-el
            >
            <n-el>{{ userData.description }}</n-el>
            <n-el style="font-size: 0.9rem; opacity: 0.6">{{
              userData.email
            }}</n-el>
            <follow-text :id="userData.id"></follow-text>
          </n-el>
        </n-space>
      </template>
    </n-card>
  </n-el>
</template>

<script lang="ts" setup>
import { NEl, NCard, NImage, NAvatar, NSpace } from 'naive-ui'
import followText from '../../components/follow/text.vue'
import { onMounted, ref } from 'vue'
import { http } from '../../utils/http'

const userData = ref<any>({})

const update = async () => {
  const res = await http('/api/user/status')

  userData.value = res.data
}

onMounted(() => {
  update()
})
</script>
