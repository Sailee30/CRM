// Centralized error handling and recovery
export type ErrorSeverity = "critical" | "high" | "medium" | "low"

export interface AppError {
  code: string
  message: string
  severity: ErrorSeverity
  stack?: string
  context?: Record<string, any>
  timestamp: Date
  resolved: boolean
}

export class ErrorHandler {
  private errors: Map<string, AppError> = new Map()
  private errorListeners: Array<(error: AppError) => void> = []

  // Log error with context
  logError(code: string, message: string, severity: ErrorSeverity, context?: Record<string, any>): AppError {
    const error: AppError = {
      code,
      message,
      severity,
      context,
      timestamp: new Date(),
      resolved: false,
    }

    // Capture stack trace in development
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(error, this.logError)
    }

    this.errors.set(code, error)
    this.notifyListeners(error)

    console.error(`[${severity.toUpperCase()}] ${code}: ${message}`, context)

    return error
  }

  // Handle API errors
  handleApiError(error: any, endpoint: string): AppError {
    const status = error?.status || error?.statusCode || 500
    const message = error?.message || "An API error occurred"

    let code = "API_ERROR"
    let severity: ErrorSeverity = "medium"

    if (status === 401) {
      code = "AUTH_ERROR"
      severity = "high"
    } else if (status === 403) {
      code = "PERMISSION_ERROR"
      severity = "high"
    } else if (status === 404) {
      code = "NOT_FOUND"
      severity = "medium"
    } else if (status >= 500) {
      code = "SERVER_ERROR"
      severity = "critical"
    }

    return this.logError(code, message, severity, { endpoint, status })
  }

  // Handle session/auth errors
  handleAuthError(error: any): AppError {
    return this.logError("AUTH_FAILED", "Authentication failed. Please log in again.", "high", {
      originalError: error?.message,
    })
  }

  // Handle data sync errors
  handleDataSyncError(error: any): AppError {
    return this.logError("SYNC_ERROR", "Failed to sync data. Retrying...", "medium", {
      originalError: error?.message,
    })
  }

  // Handle UI crashes with recovery
  handleUIError(component: string, error: any): AppError {
    return this.logError("UI_ERROR", `Component ${component} encountered an error`, "high", {
      component,
      originalError: error?.message,
    })
  }

  // Retry logic for failed operations
  async retryOperation<T>(operation: () => Promise<T>, maxRetries = 3, delayMs = 1000): Promise<T> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation()
      } catch (error) {
        if (attempt === maxRetries) {
          throw error
        }

        // Exponential backoff
        const delay = delayMs * Math.pow(2, attempt - 1)
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }

    throw new Error("Max retries exceeded")
  }

  // Resolve error
  resolveError(code: string, resolution: string): void {
    const error = this.errors.get(code)
    if (error) {
      error.resolved = true
      console.log(`[RESOLVED] ${code}: ${resolution}`)
    }
  }

  // Subscribe to errors
  onError(callback: (error: AppError) => void): void {
    this.errorListeners.push(callback)
  }

  private notifyListeners(error: AppError): void {
    for (const listener of this.errorListeners) {
      try {
        listener(error)
      } catch (e) {
        console.error("Error in error listener:", e)
      }
    }
  }

  // Get error history
  getErrorHistory(severity?: ErrorSeverity): AppError[] {
    const errors = Array.from(this.errors.values())
    return severity ? errors.filter((e) => e.severity === severity) : errors
  }

  // Clear old errors
  clearOldErrors(ageMs: number = 24 * 60 * 60 * 1000): void {
    const now = Date.now()
    for (const [code, error] of this.errors) {
      if (now - error.timestamp.getTime() > ageMs) {
        this.errors.delete(code)
      }
    }
  }
}

export const errorHandler = new ErrorHandler()
