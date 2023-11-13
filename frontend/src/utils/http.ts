import axios from 'axios'
import { ref } from 'vue'

const token = ref('')

function login(_token: string) {
  localStorage.setItem('token', _token)
  token.value = localStorage.getItem('token') ?? ''
}

const http = axios.create({
  headers: {
    'Authorization': localStorage.getItem('token') ?? token.value
  }
})

http.interceptors.response.use((res) => {
  return res.data.data
})

export {
  http,
  login
}