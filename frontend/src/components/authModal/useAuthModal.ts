import { inject } from 'vue'
import {
  loginApiInjectionKey,
  type loginApiInjection,
} from './authModalProvider.vue'

export function useAuthModal(): loginApiInjection {
  const api = inject(loginApiInjectionKey)

  if (api === undefined) {
    throw new Error('useLoginModal() is called without provider.')
  }

  return api
}
