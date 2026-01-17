// API Configuration

const config = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://dummyjson.com',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
}

// Environment-specific configurations
const environments = {
  development: {
    ...config,
    debug: true,
  },
  production: {
    ...config,
    debug: false,
  },
  test: {
    ...config,
    baseURL: 'http://localhost:3000',
    timeout: 10000,
  },
}

const currentEnv = import.meta.env.MODE || 'development'

export const apiConfig = environments[currentEnv] || environments.development

export default apiConfig
