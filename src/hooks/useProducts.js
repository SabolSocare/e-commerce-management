// Custom hooks for products management

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { productApi } from '@/services/api'
import { QUERY_KEYS, ROUTES } from '@/constants'
import { logger } from '@/utils/logger'

/**
 * Hook to fetch paginated products
 * @param {number} page - Current page number
 * @param {number} limit - Items per page
 * @returns {Object} Query result with products data
 */
export const useProducts = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCTS, page, limit],
    queryFn: () =>
      productApi.getProducts({
        limit,
        skip: (page - 1) * limit,
      }),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook to fetch single product
 * @param {string|number} id - Product ID
 * @param {boolean} enabled - Whether to enable the query
 * @returns {Object} Query result with product data
 */
export const useProduct = (id, enabled = true) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCT, id],
    queryFn: () => productApi.getProduct(id),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000,
  })
}

/**
 * Hook to fetch product categories
 * @returns {Object} Query result with categories data
 */
export const useCategories = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.CATEGORIES],
    queryFn: productApi.getCategories,
    staleTime: 30 * 60 * 1000, // 30 minutes - categories don't change often
  })
}

/**
 * Hook to add a new product
 * @param {Object} options - Mutation options
 * @returns {Object} Mutation result
 */
export const useAddProduct = (options = {}) => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: productApi.addProduct,
    onSuccess: (data) => {
      logger.info('Product added successfully:', data)
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PRODUCTS] })
      
      if (options.onSuccess) {
        options.onSuccess(data)
      } else {
        navigate(ROUTES.PRODUCTS)
      }
    },
    onError: (error) => {
      logger.error('Failed to add product:', error)
      if (options.onError) {
        options.onError(error)
      }
    },
  })
}

/**
 * Hook to update an existing product
 * @param {string|number} id - Product ID
 * @param {Object} options - Mutation options
 * @returns {Object} Mutation result
 */
export const useUpdateProduct = (id, options = {}) => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data) => productApi.updateProduct(id, data),
    onSuccess: (response, variables) => {
      logger.info('Product updated successfully:', response)
      
      // Optimistic update
      queryClient.setQueryData([QUERY_KEYS.PRODUCT, id], (oldData) => ({
        ...oldData,
        ...variables,
        id,
      }))
      
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PRODUCTS] })
      
      if (options.onSuccess) {
        options.onSuccess(response)
      } else {
        navigate(ROUTES.PRODUCTS)
      }
    },
    onError: (error) => {
      logger.error('Failed to update product:', error)
      if (options.onError) {
        options.onError(error)
      }
    },
  })
}

/**
 * Hook to delete a product
 * @param {Object} options - Mutation options
 * @returns {Object} Mutation result
 */
export const useDeleteProduct = (options = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: productApi.deleteProduct,
    onSuccess: (data, productId) => {
      logger.info('Product deleted successfully:', productId)
      
      // Remove from cache
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PRODUCTS] })
      queryClient.removeQueries({ queryKey: [QUERY_KEYS.PRODUCT, productId] })
      
      if (options.onSuccess) {
        options.onSuccess(data)
      }
    },
    onError: (error) => {
      logger.error('Failed to delete product:', error)
      if (options.onError) {
        options.onError(error)
      }
    },
  })
}
