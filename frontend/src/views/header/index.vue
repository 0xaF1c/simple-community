<template>
  <n-space
    justify="space-between"
    align="center"
    :style="{
      height: `100%`,
      padding: `0 ${headerPadding}px`
    }"
  >
    <n-el class="left" style="left: 20px">
      <n-avatar
        src="/public/logo.svg"
        :style="{
          backgroundColor: '#0000',
          cursor: 'pointer'
        }"
      ></n-avatar>
    </n-el>
    <n-el class="middle"></n-el>
    <n-el class="right">
      <n-space item-style="font-size: 17px;" align="center">
        <n-popselect
          :options="options"
          v-model:value="localeKey"
          trigger="click"
        >
          <n-button quaternary style="cursor: pointer">
            {{ $t('lang.name') }}
          </n-button>
        </n-popselect>
        <n-button
          @click="onThemeToggle"
          quaternary
          circle
          :style="{
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center'
          }"
        >
          <n-icon
            :size="20"
            v-if="!currentThemeBool"
            :component="WeatherSunny24Filled"
          ></n-icon>
          <n-icon
            :size="20"
            v-if="currentThemeBool"
            :component="WeatherMoon24Filled"
          ></n-icon>
        </n-button>
        <n-popover
          placement="bottom"
          trigger="click"
          v-if="loginState"
        >
          <template #trigger>
            <div>
              <avatar-link
                :userData="userData"
                :size="30"
                :on-click="() => {}"
              ></avatar-link>
            </div>
          </template>
          <panel />
        </n-popover>

        <n-button
          align="center"
          v-if="!loginState"
          quaternary
          @click="showLoginModal()"
        >
          {{ $t('login.name') }} / {{ $t('register.name') }}
        </n-button>
      </n-space>
    </n-el>
  </n-space>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import {
  NSpace,
  NButton,
  NAvatar,
  NEl,
  useMessage,
  NIcon,
  NPopselect,
  NPopover
} from 'naive-ui'
import panel from '../menu/panel.vue'
import { useToggleTheme } from '../../utils/toggleTheme'
import {
  WeatherMoon24Filled,
  WeatherSunny24Filled
} from '@vicons/fluent'
import { useI18n } from 'vue-i18n'
import { getLanguage, toggleLocale } from '../../utils/language'
import { useAuthModal } from '../../components/authModal/useAuthModal'
import { http, isLogin } from '../../utils/http'
import avatarLink from '../../components/link/avatarLink.vue'

export default defineComponent({
  components: {
    NSpace,
    NEl,
    NAvatar,
    avatarLink,
    NIcon,
    NPopselect,
    NButton,
    panel,
    NPopover
  },
  methods: {
    onThemeToggle() {
      this.toggleTheme()
      this.$emit('update:theme', this.theme)
    }
  },
  emits: ['update:theme'],
  setup() {
    const userData = ref<any>({})
    const darkMode = ref(false)
    const follower = ref([])
    const following = ref([])
    const localeKey = ref(getLanguage())
    const loginState = ref(isLogin())
    const {
      theme,
      toggleTheme,
      currentTheme,
      currentThemeBool
    } = useToggleTheme()
    const { messages, locale } = useI18n()
    const { showLoginModal, hideLoginModal } = useAuthModal()
    const { error } = useMessage()
    const { t } = useI18n()

    ;(async () => {
      http
        .get('/api/user/status')
        .then(res => {
          if (res?.data === undefined) {
            error(t('token_timeout.name'))
          } else {
            userData.value = res?.data
          }
        })
        .catch(() => {
          error(t('unknown_error.name'))
        })

      follower.value = (
        await http.get('/api/user/following/list')
      ).data
      following.value = (
        await http.get('/api/user/follower/list')
      ).data
    })()

    const options = Object.keys(messages.value).map(k => {
      const t: any = messages.value[k]
      return {
        label: t.lang.name,
        value: k
      }
    })

    return {
      headerPadding: 20,
      darkMode,
      theme,
      follower,
      following,
      toggleTheme,
      toggleLocale() {
        toggleLocale(localeKey.value, locale)
      },
      showLoginModal,
      hideLoginModal,
      loginState,
      currentTheme,
      currentThemeBool,
      options,
      localeKey,
      locale,
      userData,
      WeatherMoon24Filled,
      WeatherSunny24Filled
    }
  },
  watch: {
    localeKey() {
      this.toggleLocale()
    }
  }
})
</script>
