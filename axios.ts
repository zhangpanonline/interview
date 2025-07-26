import axios, { AxiosRequestConfig } from 'axios'
import { showError } from './message'
import { useUserStore } from '@/stores/user'
import { useAppStore } from '@/stores/app'

// 请求缓存
const cacheMap = new Map<string, any>()
const enableCache = true // 可切换是否启用缓存

// 重复请求记录（防止重复提交）
const pendingMap = new Map<string, AbortController>()

// 创建实例
const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
  timeout: 10000
})

// 生成唯一 key（方法 + url + body）
function getRequestKey(config: AxiosRequestConfig) {
  const { method, url, params, data } = config
  return [method, url, JSON.stringify(params), JSON.stringify(data)].join('&')
}

// 请求拦截器
service.interceptors.request.use(config => {
  const userStore = useUserStore()
  const appStore = useAppStore()

  // 开启全局 loading
  appStore.setLoading(true)

  // 设置 token
  const token = userStore.token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  // 防重复请求：AbortController 取消
  const key = getRequestKey(config)
  if (pendingMap.has(key)) {
    pendingMap.get(key)?.abort()
    pendingMap.delete(key)
  }
  const controller = new AbortController()
  config.signal = controller.signal
  pendingMap.set(key, controller)

  // 请求缓存处理
  if (enableCache && config.method === 'get' && cacheMap.has(key)) {
    config.adapter = () => {
      return Promise.resolve({
        data: cacheMap.get(key),
        status: 200,
        statusText: 'OK',
        headers: {},
        config
      })
    }
  }

  return config
})

// 响应拦截器
service.interceptors.response.use(
  async response => {
    const appStore = useAppStore()
    const userStore = useUserStore()
    const key = getRequestKey(response.config)

    // 关闭全局 loading + 清理 pendingMap
    appStore.setLoading(false)
    pendingMap.delete(key)

    const res = response.data

    // 缓存响应
    if (enableCache && response.config.method === 'get') {
      cacheMap.set(key, res)
    }

    // 正常返回
    if (res.code === 200) {
      return res.data
    }

    // token 失效（自动续签机制）
    if (res.code === 401 && !response.config._retry) {
      response.config._retry = true
      try {
        const newToken = await userStore.refreshToken() // 你要定义该函数
        userStore.setToken(newToken)
        response.config.headers.Authorization = `Bearer ${newToken}`
        return service(response.config) // 重新发起原请求
      } catch (e) {
        userStore.logout()
        return Promise.reject('登录已过期，请重新登录')
      }
    }

    showError(res.message || '接口错误')
    return Promise.reject(res.message)
  },
  error => {
    const appStore = useAppStore()
    appStore.setLoading(false)

    if (axios.isCancel(error)) {
      console.warn('请求被取消')
    } else {
      showError('网络异常或服务器错误')
    }

    return Promise.reject(error)
  }
)

export default service
