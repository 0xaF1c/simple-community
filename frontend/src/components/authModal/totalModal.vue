<template>
  <n-modal :show="show" @update-show="(v: any) => $emit('update:show', v)" preset="card" :style="{ width: '550px' }"
    size="huge" :bordered="true" :segmented="{ content: 'soft', footer: 'soft' }">
    <template #header>
      {{ $t(`${value ?? 'login'}.name`) }}
    </template>
    <template #default>
      <n-tabs animated default-value="login" size="large" justify-content="space-evenly" @update:value="v => value = v">
        <n-tab-pane name="login" :tab="$t('login.name')">
          <loginModal v-show="!useEmail" />
          <loginWithEmail v-show="useEmail" />
        </n-tab-pane>
        <n-tab-pane name="register" :tab="$t('register.name')">
          <registerModal />
        </n-tab-pane>
      </n-tabs>
    </template>
    <template #action>
      <n-space justify="center">
        <n-button @click="useEmail = !useEmail" text>
          {{ useEmail ? $t('use_account_login.name') : $t('use_email_login.name') }}
        </n-button>
      </n-space>
    </template>
  </n-modal>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import {
  NModal,
  NTabs,
  NTabPane,
  NButton,
  NSpace
} from 'naive-ui'
import loginModal from './loginModal.vue'
import registerModal from './registerModal.vue'
import loginWithEmail from './loginWithEmail.vue'

export default defineComponent({
  props: {
    show: {
      required: true,
      type: Boolean
    }
  },
  emits: [
    'update:show'
  ],
  components: {
    NModal,
    NTabs,
    NTabPane,
    loginModal,
    registerModal,
    NButton,
    loginWithEmail,
    NSpace
  },
  setup() {
    return {
      value: ref(),
      useEmail: ref(true)
    }
  }
})
</script>