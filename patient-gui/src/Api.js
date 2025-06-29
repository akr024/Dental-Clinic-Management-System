import axios from 'axios'
import { jwtDecode } from "jwt-decode"

import { differenceInSeconds } from 'date-fns'

let jwt = null

const Api = axios.create({
  baseURL: import.meta.env.VITE_PATIENT_API_ENDPOINT || 'http://localhost:8080'
})

Api.interceptors.request.use(request => {
  if (jwt) {
    request.headers['Authorization'] = `Bearer ${jwt}`
  }

  return request
})

const AuthApi = axios.create({
  baseURL: import.meta.env.VITE_AUTH_API_ENDPOINT || 'http://localhost:3000/api/auth'
})

AuthApi.interceptors.response.use(response => {
  if (response.config.url.endsWith('/login')) {
    jwt = response.data.token
  }

  return response
})

const getAuthenticatedUserId = () => {
  return jwtDecode(jwt).user._id
}

const getJwtExpDate = () => {
  const decoded = jwtDecode(jwt)
  return new Date(decoded.exp * 1000)
}

const getSecondsBeforeJwtExpires = () => jwt ? differenceInSeconds(getJwtExpDate(), new Date()) : 0

const isAuthenticated = () => jwt !== null && getSecondsBeforeJwtExpires() > 0

const signOut = () => jwt = null

export {
  Api,
  AuthApi,
  getSecondsBeforeJwtExpires,
  isAuthenticated,
  signOut,
  getAuthenticatedUserId
}
