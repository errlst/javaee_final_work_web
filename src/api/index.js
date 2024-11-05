import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 5000,
})

export const login = (data) => api.post('/user/login', data)
export const register = (data) => api.post('/user/register', data)
export const updatePassword = (data) => api.post('/user/update', data)

export const getGoods = (page) => api.get(`/goods/all?page=${page}`)
export const addGoods = (data) => api.post('/goods/insert', data)
export const updateGoods = (data) => api.post('/goods/update', data)
export const deleteGoods = (data) => api.post('/goods/delete', data)

export const getContracts = (page) => api.get(`/contract/all?page=${page}`)
export const addContract = (data) => api.post('/contract/insert', data)
export const updateContract = (data) => api.post('/contract/update', data)
export const deleteContract = (data) => api.post('/contract/delete', data)