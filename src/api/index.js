import axios from 'axios'

const api = axios.create({
  baseURL: 'http://192.168.103.116:8080/api',
  timeout: 5000,
})

export const login = data => api.post('/user/login', data)
export const register = data => api.post('/user/register', data)
export const updatePassword = data => api.post('/user/update', data)

export const getGoods = page => api.get(`/goods/all?page=${page}`)
export const addGoods = data => api.post('/goods/insert', data)
export const updateGoods = data => api.post('/goods/update', data)
export const deleteGoods = data => api.post('/goods/delete', data)
export const getGoodsPages = () => api.get('/goods/getPage')


export const getContractPages = () => api.get('/contract/getPage')
export const getContracts = page => api.get(`/contract/all?page=${page}`)
export const addContract = data => api.post('/contract/insert', data)
export const updateContract = data => api.post('/contract/update', data)
export const deleteContract = (data) => api.post('/contract/delete', data)


export const getAllRetailers = () => api.get('/retailer/all')
export const getGoodsRetailers = (goodsId) => api.get(`/retailer/all?goodsId=${goodsId}`)
export const updateRetailers = (data) => api.post('/retailer/batchUpdate', data)

