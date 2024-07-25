import axios from 'axios'
import { ref } from 'vue'

const token = ref('')

function login(_token: string) {
  localStorage.setItem('token', _token)
  token.value = localStorage.getItem('token') ?? ''
}
function isLogin() {
  return localStorage.getItem('token') !== ''
}
function logout() {
  localStorage.setItem('token', '')
}
export const headers = {
  'Authorization': localStorage.getItem('token') ?? token.value
}
const http = axios.create({
  headers
})

http.interceptors.response.use((res) => {
  return res.data
})

export {
  http,
  login,
  logout,
  isLogin
}