<template>
  <n-card bordered>
    <n-space>
      <n-thing>
        <template #header>
          <n-space align="center" justify="center">
            <n-avatar object-fit="cover" :src="userData?.avatarUrl" :size="110"
              style="margin: 0 auto;cursor: pointer;" />
            <n-el>
              <span style="font-size: 1.3rem;">{{ userData?.name }}</span>
              <n-button style="font-size: 1rem;" text>@{{ userData?.account }}</n-button>
            </n-el>
          </n-space>
        </template>
        <template #footer>
          
        </template>
      </n-thing>
      <n-space item-style="font-size: 17px;" align="center" v-if="userData === null">
        <n-button quaternary @click="showLoginModal()">{{ $t('login.name') }} / {{ $t('register.name') }}</n-button>
      </n-space>
    </n-space>
    <n-space item-style="font-size: 17px;" align="center">
      <n-popselect :options="options" v-model:value="localeKey" trigger="click">
        <n-button quaternary style="cursor: pointer;">
          {{ $t('lang.name') }}
        </n-button>
      </n-popselect>
      <n-button @click="onThemeToggle" quaternary circle style="cursor: pointer;display: flex; align-items: center;">
        <n-icon :size="20" v-if="!currentThemeBool" :component="WeatherSunny24Filled"></n-icon>
        <n-icon :size="20" v-if="currentThemeBool" :component="WeatherMoon24Filled"></n-icon>
      </n-button>
    </n-space>
  </n-card>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { NCard, NSwitch, NPopselect, NIcon, NSpace, NButton, NAvatar, NEl, useMessage, NThing } from 'naive-ui'
import { useToggleTheme } from '../../utils/toggleTheme'
import { WeatherMoon24Filled, WeatherSunny24Filled } from '@vicons/fluent'
import { useI18n } from 'vue-i18n'
import { getLanguage, toggleLocale } from '../../utils/language'
import { useAuthModal } from '../../components/authModal/useAuthModal'
import { http } from '../../utils/http'

export default defineComponent({
  components: {
    NCard, NSwitch, NPopselect, NIcon, NSpace, NButton, NAvatar, NEl, NThing
  },
  methods: {
    onThemeToggle() {
      this.toggleTheme()
      this.$emit('update:theme', this.theme)
    }
  },
  emits: ['update:theme'],
  setup() {
    const userData = ref<any>(null)
    const darkMode = ref(false)
    const localeKey = ref(getLanguage())
    const { theme, toggleTheme, currentTheme, currentThemeBool } = useToggleTheme()
    const { messages, locale } = useI18n()
    const { showLoginModal, hideLoginModal } = useAuthModal()
    const { error } = useMessage()
    const { t } = useI18n()

    ;(async () => {
      http.get('/api/user/status')
        .then((res) => {
          if (res?.data === undefined) {
            error(t('token_timeout.name'))
          } else {
            userData.value = res?.data
          }
        })
        .catch(() => {
          error(t('unknown_error.name'))
        })
    } )()

    const options = Object.keys(messages.value).map((k) => {
      const t: any = messages.value[k]
      return {
        label: t.lang.name,
        value: k
      }
    })

    return {
      darkMode,
      theme,
      toggleTheme,
      toggleLocale() {
        toggleLocale(localeKey.value, locale)
      },
      showLoginModal,
      hideLoginModal,
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