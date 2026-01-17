// Logger Utility for consistent logging across the application

const LOG_LEVELS = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug',
}

class Logger {
  constructor() {
    this.isDevelopment = import.meta.env.MODE === 'development'
    this.isProduction = import.meta.env.MODE === 'production'
  }

  error(message, ...args) {
    console.error(`[ERROR] ${message}`, ...args)
  }

  warn(message, ...args) {
    if (!this.isProduction) {
      console.warn(`[WARN] ${message}`, ...args)
    }
  }

  info(message, ...args) {
    if (this.isDevelopment) {
      console.info(`[INFO] ${message}`, ...args)
    }
  }

  debug(message, ...args) {
    if (this.isDevelopment) {
      console.log(`[DEBUG] ${message}`, ...args)
    }
  }

  group(label, callback) {
    if (this.isDevelopment) {
      console.group(label)
      callback()
      console.groupEnd()
    }
  }

  table(data) {
    if (this.isDevelopment) {
      console.table(data)
    }
  }
}

export const logger = new Logger()
export default logger
