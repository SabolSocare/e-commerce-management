// Form validation utilities

import { VALIDATION_RULES } from '@/constants'

/**
 * Validate product form data
 * @param {Object} values - Form values
 * @returns {Object} Errors object
 */
export const validateProductForm = (values) => {
  const errors = {}

  // Title validation
  if (!values.title?.trim()) {
    errors.title = 'Product name is required'
  } else if (values.title.trim().length < 3) {
    errors.title = 'Product name must be at least 3 characters'
  }

  // Category validation
  if (!values.category) {
    errors.category = 'Category is required'
  }

  // Price validation
  if (!values.price) {
    errors.price = 'Base price is required'
  } else if (isNaN(values.price)) {
    errors.price = 'Price must be a valid number'
  } else if (Number(values.price) <= VALIDATION_RULES.MIN_PRICE) {
    errors.price = 'Price must be greater than 0'
  }

  // Discount percentage validation
  if (values.discountPercentage) {
    if (isNaN(values.discountPercentage)) {
      errors.discountPercentage = 'Discount must be a valid number'
    } else {
      const discount = Number(values.discountPercentage)
      if (discount < VALIDATION_RULES.MIN_DISCOUNT_PERCENTAGE) {
        errors.discountPercentage = 'Discount cannot be negative'
      } else if (discount > VALIDATION_RULES.MAX_DISCOUNT_PERCENTAGE) {
        errors.discountPercentage = 'Discount cannot exceed 100%'
      }
    }
  }

  // SKU validation
  if (!values.sku?.trim()) {
    errors.sku = 'SKU is required'
  }

  // Stock validation
  if (values.stock === '' || values.stock === null || values.stock === undefined) {
    errors.stock = 'Quantity is required'
  } else if (isNaN(values.stock)) {
    errors.stock = 'Quantity must be a valid number'
  } else if (Number(values.stock) < VALIDATION_RULES.MIN_STOCK) {
    errors.stock = 'Quantity cannot be negative'
  }

  return errors
}

/**
 * Sanitize form values before submission
 * @param {Object} values - Form values
 * @returns {Object} Sanitized values
 */
export const sanitizeProductForm = (values) => {
  const sanitized = {
    title: values.title?.trim(),
    description: values.description?.trim() || '',
    category: values.category,
    price: Number(values.price),
    sku: values.sku?.trim(),
    stock: parseInt(values.stock, 10),
  }

  if (values.discountPercentage) {
    sanitized.discountPercentage = Number(values.discountPercentage)
  }

  return sanitized
}

/**
 * Check if email is valid
 * @param {string} email - Email address
 * @returns {boolean} Is valid
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Check if phone number is valid (basic validation)
 * @param {string} phone - Phone number
 * @returns {boolean} Is valid
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^\+?[\d\s-()]{10,}$/
  return phoneRegex.test(phone)
}
