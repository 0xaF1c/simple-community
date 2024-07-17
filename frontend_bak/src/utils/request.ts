import axios, { AxiosInstance, CreateAxiosDefaults } from 'axios'
import { useAppSelector } from '../store'


let api: AxiosInstance | null = null

type IUseApiReturn = {
  api: AxiosInstance
}

export function useApi(): IUseApiReturn {
  const token = useAppSelector(state => state.storage.auth.token)
  const config: CreateAxiosDefaults = {
    headers: {
      'Authorization': token,
    },
    timeout: 10 * 1000,
    baseURL: '/api',
  }
  if (api === null) {
    api = axios.create(config)
    api.interceptors.response.use(res => res.data)
  }


  return {
    api
  }
}
