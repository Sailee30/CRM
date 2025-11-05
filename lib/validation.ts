// Input validation and sanitization
export interface ValidationResult {
  valid: boolean
  errors: Record<string, string>
}

export class Validator {
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Phone validation
  static validatePhone(phone: string): boolean {
    const phoneRegex = /^\+?[\d\s\-()]{10,}$/
    return phoneRegex.test(phone)
  }

  // URL validation
  static validateUrl(url: string): boolean {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  // Sanitize HTML to prevent XSS
  static sanitizeHtml(html: string): string {
    const div = document.createElement("div")
    div.textContent = html
    return div.innerHTML
  }

  // Validate object against schema
  static validateObject(
    obj: Record<string, any>,
    schema: Record<string, { type: string; required?: boolean }>,
  ): ValidationResult {
    const errors: Record<string, string> = {}

    for (const [key, rules] of Object.entries(schema)) {
      const value = obj[key]

      if (rules.required && (value === undefined || value === null || value === "")) {
        errors[key] = `${key} is required`
      } else if (value !== undefined && typeof value !== rules.type) {
        errors[key] = `${key} must be of type ${rules.type}`
      }
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors,
    }
  }

  // Trim and normalize input
  static normalizeInput(input: string): string {
    return input.trim().replace(/\s+/g, " ")
  }

  // Validate data within acceptable range
  static validateRange(value: number, min: number, max: number): boolean {
    return value >= min && value <= max
  }
}
