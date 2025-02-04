import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
const router = useRouter()
const baseURL = 'http://localhost:8083/'
 
 
const instance = axios.create({
  // TODO 1. 基础地址，超时时间
  baseURL,
  timeout: 10000 //十秒内未收到响应则取消请求
})
 
// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // const userStore = useUserStore()
    // TODO 2. 携带token 
    // TODO: 先不带任何token
    // if (userStore.token) {
    //   config.headers.Authorization = userStore.token
    // }
    return config
  },
  (err) => Promise.reject(err)
)
 
// 响应拦截器
instance.interceptors.response.use(
  (res) => {
    // TODO 4. 摘取核心响应数据
    if (res.data.code === 200) {
      return res
    }
    // TODO 3. 处理业务失败
    // 处理业务失败, 给错误提示，抛出错误
    ElMessage.error(res.data.message || '服务异常')
    return Promise.reject(res.data)
  },
  (err) => {
    // TODO 5. 处理401错误
    // 错误的特殊情况 => 401 权限不足 或 token 过期 => 拦截到登录
    if (err.response?.status === 401) {
      router.push('/login')
    }
 
    // 错误的默认情况 => 只要给提示
    ElMessage.error(err.response?.data.message || '服务异常')
    return Promise.reject(err)
  }
)
 
export default instance
export { baseURL }