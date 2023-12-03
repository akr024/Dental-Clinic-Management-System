import axios from 'axios'

export const Api = axios.create({
  baseURL: import.meta.env.VITE_PATIENT_API_ENDPOINT || 'http://localhost:8080'
})
