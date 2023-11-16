import { inject } from 'vue'
import { loginApiInjectionKey } from './authModalProvider.vue'

export function useAuthModal() {
  const api = inject(loginApiInjectionKey)

  if (api === undefined) {
    throw new Error('useLoginModal() is called without provider.')
  }

  return api
}