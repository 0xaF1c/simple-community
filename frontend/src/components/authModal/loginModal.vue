<script setup lang="ts">
import {
  NForm,
  NSpace,
  NInput,
  NButton,
  useMessage
} from 'naive-ui'
import { ref, inject } from 'vue';
import { http, login } from '../../utils/http';
import { useI18n } from 'vue-i18n';
import { loginApiInjectionKey } from './authModalProvider.vue'
const account = ref('')
const password = ref('')
const loginLoading = ref(false)
const { t } = useI18n()
const { success, error } = useMessage()

const { hideLoginModal } = inject(loginApiInjectionKey)!
const sendLoginReq = () => {
  loginLoading.value = true

  http.post('/api/user/login', {
    account: account.value,
    password: password.value
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
      <n-input aria-autocomplete="on" :placeholder="$t('input_account_or_email.name')" v-model:value="account"></n-input>
      <n-input aria-autocomplete="on" show-password-on="click" type="password" :placeholder="$t('input_password.name')" v-model:value="password"></n-input>
      <n-button @click="sendLoginReq" :loading="loginLoading" :disabled="loginLoading" type="primary" block secondary strong>
        {{ $t('login.name') }}
      </n-button>
    </n-space>
  </n-form>
</template>