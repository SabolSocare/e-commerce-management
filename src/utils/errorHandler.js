// Error Handling Utility

import { logger } from './logger'

export class APIError extends Error {
  constructor(message, statusCode, data = null) {
    super(message)
    this.name = 'APIError'
    this.statusCode = statusCode
    this.data = data
  }
}

export const handleAPIError = (error) => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response
    logger.error('API Error:', {
      status,
      message: data?.message || error.message,
      url: error.config?.url,
    })

    return new APIError(
      data?.message || 'Server error occurred',
      status,
      data
    )
  } else if (error.request) {
    // Request was made but no response
    logger.error('Network Error:', error.message)
    return new APIError('Network error. Please check your connection.', 0)
  } else {
    // Something else happened
    logger.error('Unexpected Error:', error.message)
    return new APIError('An unexpected error occurred', 0)
  }
}

export const getErrorMessage = (error) => {
  if (error instanceof APIError) {
    return error.message
  }
  
  if (error?.response?.data?.message) {
    return error.response.data.message
  }

  if (error?.message) {
    return error.message
  }

  return 'An unexpected error occurred'
}
