import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://dummyjson.com'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const productApi = {
  // Get list of products with pagination
  getProducts: async ({ limit = 10, skip = 0, select = 'title,price,sku,stock,category,thumbnail,meta' } = {}) => {
    const response = await apiClient.get('/products', {
      params: { limit, skip, select },
    })
    return response.data
  },

  // Get single product
  getProduct: async (id) => {
    const response = await apiClient.get(`/products/${id}`)
    return response.data
  },

  // Add new product
  addProduct: async (productData) => {
    const response = await apiClient.post('/products/add', productData)
    return response.data
  },

  // Update product
  updateProduct: async (id, productData) => {
    const response = await apiClient.put(`/products/${id}`, productData)
    return response.data
  },

  // Delete product
  deleteProduct: async (id) => {
    const response = await apiClient.delete(`/products/${id}`)
    return response.data
  },

  // Get categories
  getCategories: async () => {
    const response = await apiClient.get('/products/category-list')
    return response.data
  },
}

export default apiClient
