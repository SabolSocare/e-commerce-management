import axios from 'axios'
import { apiConfig } from '@/config/api.config'
import { handleAPIError } from '@/utils/errorHandler'
import { logger } from '@/utils/logger'

// Create axios instance with configuration
const apiClient = axios.create({
  baseURL: apiConfig.baseURL,
  timeout: apiConfig.timeout,
  headers: apiConfig.headers,
})

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Log request in development
    if (apiConfig.debug) {
      logger.debug('API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        params: config.params,
        data: config.data,
      })
    }

    // Add auth token if available
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    logger.error('Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Log response in development
    if (apiConfig.debug) {
      logger.debug('API Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data,
      })
    }
    return response
  },
  (error) => {
    const apiError = handleAPIError(error)
    return Promise.reject(apiError)
  }
)

/**
 * Product API Service
 * Handles all product-related API calls with proper error handling
 */
export const productApi = {
  /**
   * Get list of products with pagination
   * @param {Object} params - Query parameters
   * @param {number} params.limit - Number of items per page
   * @param {number} params.skip - Number of items to skip
   * @param {string} params.select - Comma-separated fields to select
   * @returns {Promise<Object>} Product list with pagination info
   */
  getProducts: async ({ 
    limit = 10, 
    skip = 0, 
    select = 'title,price,sku,stock,category,thumbnail,meta' 
  } = {}) => {
    try {
      const response = await apiClient.get('/products', {
        params: { limit, skip, select },
      })
      return response.data
    } catch (error) {
      logger.error('Failed to fetch products:', error)
      throw error
    }
  },

  /**
   * Get single product by ID
   * @param {string|number} id - Product ID
   * @returns {Promise<Object>} Product details
   */
  getProduct: async (id) => {
    if (!id) {
      throw new Error('Product ID is required')
    }

    try {
      const response = await apiClient.get(`/products/${id}`)
      return response.data
    } catch (error) {
      logger.error(`Failed to fetch product ${id}:`, error)
      throw error
    }
  },

  /**
   * Add new product
   * @param {Object} productData - Product information
   * @returns {Promise<Object>} Created product
   */
  addProduct: async (productData) => {
    if (!productData) {
      throw new Error('Product data is required')
    }

    try {
      const response = await apiClient.post('/products/add', productData)
      logger.info('Product added successfully:', response.data)
      return response.data
    } catch (error) {
      logger.error('Failed to add product:', error)
      throw error
    }
  },

  /**
   * Update existing product
   * @param {string|number} id - Product ID
   * @param {Object} productData - Updated product information
   * @returns {Promise<Object>} Updated product
   */
  updateProduct: async (id, productData) => {
    if (!id) {
      throw new Error('Product ID is required')
    }
    if (!productData) {
      throw new Error('Product data is required')
    }

    try {
      const response = await apiClient.put(`/products/${id}`, productData)
      logger.info(`Product ${id} updated successfully`)
      return response.data
    } catch (error) {
      logger.error(`Failed to update product ${id}:`, error)
      throw error
    }
  },

  /**
   * Delete product by ID
   * @param {string|number} id - Product ID
   * @returns {Promise<Object>} Deletion confirmation
   */
  deleteProduct: async (id) => {
    if (!id) {
      throw new Error('Product ID is required')
    }

    try {
      const response = await apiClient.delete(`/products/${id}`)
      logger.info(`Product ${id} deleted successfully`)
      return response.data
    } catch (error) {
      logger.error(`Failed to delete product ${id}:`, error)
      throw error
    }
  },

  /**
   * Get list of product categories
   * @returns {Promise<Array>} List of category names
   */
  getCategories: async () => {
    try {
      const response = await apiClient.get('/products/category-list')
      return response.data
    } catch (error) {
      logger.error('Failed to fetch categories:', error)
      throw error
    }
  },
}

export default apiClient
