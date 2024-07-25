<template>
  <n-card bordered>
    <n-space>
      <n-thing>
        <template #header>
          <n-space align="center" justify="center"> </n-space>
        </template>
      </n-thing>
      <n-space item-style="font-size: 17px;">
        <avatar-link
          :userData="userData"
          style="display: flex; justify-items: center"
          :size="32"
        ></avatar-link>
        <n-el>
          <span style="font-size: 1.3rem">{{
            userData?.name
          }}</span>
          <n-button style="font-size: 1rem" text
            >@{{ userData?.account }}</n-button
          >
        </n-el>
        <n-button
          align="center"
          v-if="userData === null"
          quaternary
          @click="showLoginModal()"
        >
          {{ $t('login.name') }} / {{ $t('register.name') }}
        </n-button>
      </n-space>
    </n-space>
  </n-card>
  <n-space item-style="font-size: 17px;" align="center">
    <n-grid :cols="2" item-style="text-align: center">
      <n-gi :span="1">
        <n-statistic
          :label="$t('following.name')"
          :value="following?.length"
        />
      </n-gi>
      <n-gi :span="1">
        <n-statistic
          :label="$t('follower.name')"
          :value="follower?.length"
        />
      </n-gi>
    </n-grid>
  </n-space>
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
  useMessage,
  NThing,
  NGrid,
  NGi,
  NStatistic
} from 'naive-ui'
import { useToggleTheme } from '../../utils/toggleTheme'
import {
  WeatherMoon24Filled,
  WeatherSunny24Filled
} from '@vicons/fluent'
import { useI18n } from 'vue-i18n'
import { getLanguage, toggleLocale } from '../../utils/language'
import { useAuthModal } from '../../components/authModal/useAuthModal'
import { http } from '../../utils/http'
import avatarLink from '../../components/link/avatarLink.vue'
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
    avatarLink
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
    const follower = ref([])
    const following = ref([])
    const localeKey = ref(getLanguage())
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
      darkMode,
      theme,
      toggleTheme,
      follower,
      following,
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
