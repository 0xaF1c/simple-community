<template>
  <n-card
    :bordered="false"
    content-style="padding: 4px 0;"
    style="padding: 0; margin: 0; width: 100%"
  >
    <n-space vertical>
      <n-button quaternary @click="profileClick">
        <template #icon>
          <n-icon
            v-show="!profileShow"
            :component="Home24Regular"
          ></n-icon>
          <n-icon
            v-show="profileShow"
            :component="Home24Filled"
          ></n-icon>
        </template>
        {{ $t('profile') }}
      </n-button>
      <n-button quaternary @click="messageClick">
        <template #icon>
          <n-icon
            v-show="!messageShow"
            :component="Chat24Regular"
          ></n-icon>
          <n-icon
            v-show="messageShow"
            :component="Chat24Filled"
          ></n-icon>
        </template>
        {{ $t('message') }}
      </n-button>
      <n-button quaternary @click="settingsClick">
        <template #icon>
          <n-icon
            v-show="!settingsShow"
            :component="Settings24Regular"
          ></n-icon>
          <n-icon
            v-show="settingsShow"
            :component="Settings24Filled"
          ></n-icon>
        </template>
        {{ $t('settings') }}
      </n-button>
      <n-popconfirm
        @positive-click="logoutClick"
        v-model:show="logoutShow"
        :positive-text="$t('confirm.name')"
        :negative-text="$t('cancel.name')"
      >
        {{ $t('confirm_logout') }}
        <template #trigger>
          <n-button quaternary>
            <template #icon>
              <n-icon
                v-show="!logoutShow"
                :component="PersonArrowLeft24Regular"
              ></n-icon>
              <n-icon
                v-show="logoutShow"
                :component="PersonArrowLeft24Filled"
              ></n-icon>
            </template>
            {{ $t('logout') }}
          </n-button>
        </template>
      </n-popconfirm>
    </n-space>
  </n-card>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import {
  NCard,
  NSwitch,
  NPopselect,
  NIcon,
  NSpace,
  NButton,
  NAvatar,
  NEl,
  NThing,
  NGrid,
  NGi,
  NStatistic,
  useMessage,
  NPopconfirm
} from 'naive-ui'
import {
  WeatherMoon24Filled,
  WeatherSunny24Filled,
  PersonArrowLeft24Regular,
  PersonArrowLeft24Filled,
  Chat24Regular,
  Chat24Filled,
  Settings24Regular,
  Settings24Filled,
  Home24Regular,
  Home24Filled
} from '@vicons/fluent'

import { useAuthModal } from '../../components/authModal/useAuthModal'
import avatarLink from '../../components/link/avatarLink.vue'
import { logout } from '../../utils/http'

export default defineComponent({
  components: {
    NCard,
    NSwitch,
    NPopselect,
    NIcon,
    NSpace,
    NButton,
    NAvatar,
    NEl,
    NThing,
    NGrid,
    NGi,
    NStatistic,
    avatarLink,
    NPopconfirm
  },
  emits: ['update:theme'],
  setup() {
    const profileShow = ref(false)
    const messageShow = ref(false)
    const settingsShow = ref(false)
    const logoutShow = ref(false)
    const { showLoginModal, hideLoginModal } = useAuthModal()
    const { info } = useMessage()

    const profileClick = () => {
      profileShow.value = true
      setTimeout(() => {
        profileShow.value = false
      }, 400)
      info('尚在开发')
    }
    const messageClick = () => {
      messageShow.value = true
      setTimeout(() => {
        messageShow.value = false
      }, 400)
      info('尚在开发')
    }
    const settingsClick = () => {
      settingsShow.value = true
      setTimeout(() => {
        settingsShow.value = false
      }, 400)
      info('尚在开发')
    }
    const logoutClick = () => {
      logout()
      location.reload()
    }

    return {
      logoutShow,
      profileShow,
      messageShow,
      settingsShow,
      profileClick,
      messageClick,
      settingsClick,
      logoutClick,
      showLoginModal,
      hideLoginModal,
      Home24Regular,
      Home24Filled,
      WeatherMoon24Filled,
      WeatherSunny24Filled,
      Chat24Regular,
      Chat24Filled,
      Settings24Regular,
      Settings24Filled,
      PersonArrowLeft24Regular,
      PersonArrowLeft24Filled
    }
  }
})
</script>
