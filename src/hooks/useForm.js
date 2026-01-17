// Custom hook for form management

import { useState, useCallback } from 'react'

/**
 * Generic form hook for managing form state and validation
 * @param {Object} initialValues - Initial form values
 * @param {Function} validationFn - Validation function that returns errors object
 * @returns {Object} Form state and handlers
 */
export const useForm = (initialValues = {}, validationFn = null) => {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  /**
   * Handle input change
   */
  const handleChange = useCallback((field, value) => {
    setValues((prev) => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }, [errors])

  /**
   * Handle input blur (mark as touched)
   */
  const handleBlur = useCallback((field) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }, [])

  /**
   * Validate form
   */
  const validate = useCallback(() => {
    if (!validationFn) return true

    const newErrors = validationFn(values)
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [values, validationFn])

  /**
   * Reset form to initial values
   */
  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
    setIsSubmitting(false)
  }, [initialValues])

  /**
   * Set form values programmatically
   */
  const setFormValues = useCallback((newValues) => {
    setValues(newValues)
  }, [])

  /**
   * Set specific field value
   */
  const setFieldValue = useCallback((field, value) => {
    setValues((prev) => ({ ...prev, [field]: value }))
  }, [])

  /**
   * Set specific field error
   */
  const setFieldError = useCallback((field, error) => {
    setErrors((prev) => ({ ...prev, [field]: error }))
  }, [])

  return {
    values,
    errors,
    touched,
    isSubmitting,
    setIsSubmitting,
    handleChange,
    handleBlur,
    validate,
    reset,
    setFormValues,
    setFieldValue,
    setFieldError,
  }
}

export default useForm
