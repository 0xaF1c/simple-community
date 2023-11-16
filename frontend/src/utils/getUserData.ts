import { Ref } from 'vue'
import { http } from './http'

export function getUserData(value: Ref, useMessage: Function, t: Function) {
  const { error } = useMessage()
  http.get('/api/user/status')
    .then((res) => {
      if (res?.data === undefined) {
        error(t('token_timeout.name'))
      } else {
        value.value = res?.data
      }
    })
    .catch(() => {
      error(t('unknown_error.name'))
    })
}