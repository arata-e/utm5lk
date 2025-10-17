import axios from 'axios'
import router from './router/index'

const axiosInstance = axios.create({
  baseURL: '/customer_api/',
  timeout: 60000
})

const checkEr = function (err) {
  if (!err.response.status) {
    localStorage.removeItem('sid_customer')
    router.push('/login')
    return Promise.reject(err)
  }
  if (err.response.status === 400) {
    return err.response
  }
  if (err.response.status === 401) {
    localStorage.removeItem('sid_customer')
    router.push('/login')
  }
  if (err.response.status === 502) {
    localStorage.removeItem('sid_customer')
    router.push('/login')
  }
  return Promise.reject(err)
}

axiosInstance.interceptors.response.use(null, checkEr)
axiosInstance.defaults.withCredentials = true

export default axiosInstance
