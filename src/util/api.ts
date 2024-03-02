import axios from 'axios'
import { setupMockApiResponses } from './mock'
import { useGlobalStore } from '../stores/global-store'
import router from '../router'

const GlobalStore = useGlobalStore()
const API_URL = "https://api.kujungmaru.com/api/v1/";
const axiosInstance = axios.create({
  baseURL: API_URL,
})

setupMockApiResponses(axiosInstance)

export const requestGet = async (url: string, param: any): Promise<any> => {
  return requestApi('GET', url, param)
}

export const requestPost = async (url: string, param: any): Promise<any> => {
  return requestApi('POST', url, param)
}

export const requestPut = async (url: string, param: any): Promise<any> => {
  return requestApi('PUT', url, param)
}

export const requestDelete = async (url: string, param: any): Promise<any> => {
  return requestApi('DELETE', url, param)
}

export const uploadFile = async (file, fileCategory, thumbYb): Promise<any> => {
  try {
    var formData = new FormData()
    formData.append('files', file)
    formData.append('file_category', fileCategory)
    formData.append('thumb_yb', thumbYb)

    GlobalStore.setLoading(true)
    let response = await axiosInstance.post('file', formData, {
      headers: headersForUpload(),
    })
    GlobalStore.setLoading(false)
    return response.data
  } catch (error) {
    GlobalStore.setLoading(false)

    if (isUnauthorized(error)) {
      forceLogin()
      return
    }
    throw error
  }
}

export const uploadFiles = async (files, fileCategory, thumbYb): Promise<any> => {
  try {
    var formData = new FormData()
    files.forEach((file) => formData.append('files', file))
    formData.append('file_category', fileCategory)
    formData.append('thumb_yb', thumbYb)

    GlobalStore.setLoading(true)
    let response = await axiosInstance.post('file', formData, {
      headers: headersForUpload(),
    })
    GlobalStore.setLoading(false)
    return response.data
  } catch (error) {
    GlobalStore.setLoading(false)

    if (isUnauthorized(error)) {
      forceLogin()
      return
    }
    throw error
  }
}

const headers = () => {
  var headers = {
    'Content-Type': 'application/json',
  }

  if (GlobalStore.accessToken !== '') {
    headers['Authorization'] = `Bearer ${GlobalStore.accessToken}`
  }
  console.log('Request Headers:', JSON.stringify(headers))
  return headers
}

const headersForUpload = () => {
  var headers = {
    'Content-Type': 'multipart/form-data',
  }

  if (GlobalStore.accessToken !== '') {
    headers['Authorization'] = `Bearer ${GlobalStore.accessToken}`
  }
  console.log('Upload Headers:', JSON.stringify(headers))
  return headers
}

const requestApi = async (method: string, url: string, param: any): Promise<any> => {
  console.log('Request:', JSON.stringify(param))
  try {
    var config = {
      url: url,
      method: method,
      headers: headers(),
      responseType: 'json',
    }

    if (method === 'GET') {
      config['params'] = param
    } else {
      config['data'] = param
    }

    GlobalStore.setLoading(true)
    let response = await axiosInstance.request(config)
    GlobalStore.setLoading(false)
    return response.data
  } catch (error) {
    GlobalStore.setLoading(false)

    if (isUnauthorized(error)) {
      forceLogin()
      return
    }
    throw error
  }
}

const isUnauthorized = (error) => {
  return error.response.status > 400 && error.response.status < 500
}

const forceLogin = () => {
  GlobalStore.setAccessToken('')
  localStorage.setItem('accessToken', '')

  router.go({ name: '/auth/login' })
}
