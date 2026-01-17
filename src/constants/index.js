// Application Constants

// Pagination
export const ITEMS_PER_PAGE = 10
export const MAX_VISIBLE_PAGES = 5

// API Configuration
export const API_TIMEOUT = 30000
export const RETRY_ATTEMPTS = 3

// Product Filters
export const PRODUCT_STATUS = {
  ALL: 'all',
  IN_STOCK: 'in-stock',
  OUT_OF_STOCK: 'out-of-stock',
  LOW_STOCK: 'low-stock',
}

// Sort Keys
export const SORT_KEYS = {
  PRODUCT: 'product',
  STOCK: 'stock',
  PRICE: 'price',
  ADDED: 'added',
}

// Sort Directions
export const SORT_DIRECTION = {
  ASC: 'asc',
  DESC: 'desc',
}

// Form Validation
export const VALIDATION_RULES = {
  MIN_PRICE: 0,
  MIN_STOCK: 0,
  MAX_DISCOUNT_PERCENTAGE: 100,
  MIN_DISCOUNT_PERCENTAGE: 0,
}

// Toast Messages
export const TOAST_MESSAGES = {
  PRODUCT_ADDED: 'Product added successfully',
  PRODUCT_UPDATED: 'Product updated successfully',
  PRODUCT_DELETED: 'Product deleted successfully',
  ERROR_GENERIC: 'An error occurred. Please try again.',
  ERROR_NETWORK: 'Network error. Please check your connection.',
}

// Query Keys
export const QUERY_KEYS = {
  PRODUCTS: 'products',
  PRODUCT: 'product',
  CATEGORIES: 'categories',
}

// Routes
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  PRODUCTS: '/products',
  PRODUCTS_ADD: '/products/add',
  PRODUCTS_EDIT: (id = ':id') => `/products/edit/${id}`,
  ORDERS: '/orders',
  CUSTOMERS: '/customers',
  REPORTS: '/reports',
}

// Debounce Delays
export const DEBOUNCE_DELAY = {
  SEARCH: 300,
  INPUT: 500,
}
