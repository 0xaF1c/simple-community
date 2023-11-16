<script setup lang="ts">
import {
  NForm,
  NSpace,
  NInput,
  NButton,
  NInputGroup,
  useMessage
} from 'naive-ui'
import { http, login } from '../../utils/http'
import { ref, inject } from 'vue'
import { useI18n } from 'vue-i18n'
import { loginApiInjectionKey } from './authModalProvider.vue'

const { t } = useI18n()
const { success, error } = useMessage()

const email = ref()
const code = ref()
const loading = ref(false)
const loadingCount = ref()
const loginLoading = ref(false)
const { hideLoginModal } = inject(loginApiInjectionKey)!

const sendCaptch = () => {
  if (email.value !== '') {
    http.get('/api/user/login/email/send', {
      params: {
        email: email.value
      }
    })
      .then(res => {
        if (!res.data) {
          // @ts-ignore
          error(res.error.name)
        } else {
          loading.value = true
          // 60秒后重试计时器
          let count = 60
          const timer = setInterval(() => {
            loadingCount.value = count--
            if (count <= 0) {
              loading.value = false
              clearInterval(timer)
            }
          }, 1000)
          success('发送成功')
        }
      })
      .catch(err => {
        error(err.message)
      })
  }
}
const sendLoginReq = () => {
  loginLoading.value = true
  http.post('/api/user/login/email', {
    code: code.value,
    email: email.value
  })
    .then((res) => {
      if (!res.data) {
        // @ts-ignore
        error(res.error.name)
      } else {
        login(res.data.token)
        success(t('login_success.name'))
        hideLoginModal()
        window.location.reload()
      }
      setTimeout(() => {
        loginLoading.value = false
      }, 200);
    })
    .catch((err) => {
      error(err.message)
      setTimeout(() => {
        loginLoading.value = false
      }, 200);
    })
}
</script>
<template>
  <n-form>
    <n-space vertical>
      <n-input-group>
        <n-input aria-autocomplete="on" v-model:value="email" :placeholder="$t('input_email.name')"></n-input>
        <n-button @click="sendCaptch" :loading="loading" :disabled="loading">
          {{ loading ? (loadingCount > 0 ? loadingCount : '') : $t('send.name') }}
        </n-button>
      </n-input-group>
      <n-input v-model:value="code" :placeholder="$t('input_captcha.name')"></n-input>
      <n-button @click="sendLoginReq" type="primary" :loading="loginLoading" :disabled="loginLoading" block secondary strong>
        {{ $t('login.name') }}
      </n-button>
    </n-space>
  </n-form>
</template>