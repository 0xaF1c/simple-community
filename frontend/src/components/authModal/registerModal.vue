<script setup lang="ts">
import {
  NForm,
  NFormItemRow,
  NInput,
  NButton,
  NInputGroup,
  useMessage
} from 'naive-ui'
import { ref, onMounted, inject } from 'vue'
import { loginApiInjectionKey } from './authModalProvider.vue'
import { http, login } from '../../utils/http'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const count = ref(0)

const { success, error } = useMessage()
const email = ref('')
const code = ref('')
const account = ref('')
const name = ref('')
const password = ref('')
const passwordRepeat = ref('')
const description = ref(t('user_description_default.name'))
const { hideLoginModal } = inject(loginApiInjectionKey)!

const sendLoading = ref(false)
const loading = ref(false)
const loadingCount = ref()
const sendCaptch = () => {
  if (email.value !== '') {
    loading.value = true
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
    setTimeout(() => {
      loading.value = false
    }, 200);
  }
}
const sendLoginReq = () => {
  if (password.value !== passwordRepeat.value) {
    error(t('password_repeat_error.name'))
  } else {
    sendLoading.value = true
    http.post('/api/user/register', {
      email: email.value,
      code: code.value,
      account: account.value,
      name: name.value,
      password: password.value,
      description: description.value,
    })
      .then((res) => {
        if (!res.data) {
          // @ts-ignore
          error(res.error.name)
        } else {
          login(res.data.token)
          success(t('register_success.name'))
          hideLoginModal()
          window.location.reload()
        }
        setTimeout(() => {
          sendLoading.value = false
        }, 150)
      })
      .catch((err) => {
        error(err.message)
        setTimeout(() => {
          sendLoading.value = false
        }, 150)
      })
  }
}


onMounted(async () => {
  count.value = (await http.get('/api/user/count')).data + 1
  account.value = `communit_user_${count.value}`
  name.value = `communit_user_${count.value}`
})
</script>
<template>
  <n-form>
    <n-form-item-row :label="$t('input_user_name.name')">
      <n-input v-model:value="name"></n-input>
    </n-form-item-row>
    <n-form-item-row :label="$t('input_account.name')">
      <n-input v-model:value="account"></n-input>
    </n-form-item-row>
    <n-form-item-row :label="$t('description.name')">
      <n-input v-model:value="description"></n-input>
    </n-form-item-row>
    <n-form-item-row :label="$t('input_password.name')">
      <n-input :placeholder="$t('required.name')" type="password" show-password-on="click" v-model:value="password"></n-input>
    </n-form-item-row>
    <n-form-item-row :label="$t('input_password_repeat.name')">
      <n-input :placeholder="$t('required.name')" type="password" show-password-on="click" v-model:value="passwordRepeat"></n-input>
    </n-form-item-row>
    <n-form-item-row :label="$t('verify_email.name')">
      <n-input-group>
        <n-input :placeholder="$t('input_email.name')" v-model:value="email"></n-input>
        <n-button @click="sendCaptch" :loading="loading" :disabled="loading">
          {{ loading ? (loadingCount > 0 ? loadingCount : '') : $t('send.name') }}
        </n-button>
      </n-input-group>
    </n-form-item-row>
    <n-form-item-row :label="$t('input_captcha.name')">
      <n-input :placeholder="$t('input_captcha.name')" v-model:value="code"></n-input>
    </n-form-item-row>
    <n-button :loading="sendLoading" :disabled="sendLoading" type="primary" block secondary strong @click="sendLoginReq">
      {{ $t('register.name') }} / {{ $t('login.name') }}
    </n-button>
  </n-form>
</template>