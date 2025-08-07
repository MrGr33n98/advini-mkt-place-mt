/**
 * Modern Validation & Sanitization System
 * Arquitetura baseada em benchmarks da indústria:
 * - Type-safe validation with Zod
 * - Input sanitization
 * - Custom validators
 * - Async validation
 * - Field-level validation
 * - Form validation
 * - Real-time validation
 */

import { z } from 'zod'
import DOMPurify from 'isomorphic-dompurify'

// ===== TYPES =====
export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
  warnings: ValidationWarning[]
  sanitizedValue?: any
}

export interface ValidationError {
  field: string
  message: string
  code: string
  value?: any
}

export interface ValidationWarning {
  field: string
  message: string
  code: string
  value?: any
}

export interface ValidatorConfig {
  required?: boolean
  trim?: boolean
  sanitize?: boolean
  async?: boolean
  debounce?: number
  dependencies?: string[]
}

export interface FieldValidator {
  name: string
  schema: z.ZodSchema
  config?: ValidatorConfig
  customValidators?: CustomValidator[]
}

export interface CustomValidator {
  name: string
  message: string
  validator: (value: any, context?: any) => boolean | Promise<boolean>
}

export interface ValidationContext {
  formData: Record<string, any>
  fieldName: string
  fieldValue: any
  isSubmitting: boolean
  isDirty: boolean
  isTouched: boolean
}

// ===== CONSTANTS =====
export const VALIDATION_MESSAGES = {
  REQUIRED: 'Este campo é obrigatório',
  INVALID_EMAIL: 'Email inválido',
  INVALID_CPF: 'CPF inválido',
  INVALID_CNPJ: 'CNPJ inválido',
  INVALID_PHONE: 'Telefone inválido',
  INVALID_CEP: 'CEP inválido',
  INVALID_DATE: 'Data inválida',
  INVALID_TIME: 'Horário inválido',
  INVALID_URL: 'URL inválida',
  INVALID_PASSWORD: 'Senha deve ter pelo menos 8 caracteres',
  PASSWORD_MISMATCH: 'Senhas não coincidem',
  MIN_LENGTH: 'Deve ter pelo menos {min} caracteres',
  MAX_LENGTH: 'Deve ter no máximo {max} caracteres',
  MIN_VALUE: 'Deve ser pelo menos {min}',
  MAX_VALUE: 'Deve ser no máximo {max}',
  INVALID_FILE_TYPE: 'Tipo de arquivo inválido',
  FILE_TOO_LARGE: 'Arquivo muito grande',
  INVALID_IMAGE: 'Imagem inválida',
  FUTURE_DATE_REQUIRED: 'Data deve ser futura',
  PAST_DATE_REQUIRED: 'Data deve ser passada',
  BUSINESS_HOURS_ONLY: 'Apenas horário comercial',
  WEEKEND_NOT_ALLOWED: 'Finais de semana não permitidos',
  DUPLICATE_VALUE: 'Valor já existe',
  INVALID_FORMAT: 'Formato inválido',
  NETWORK_ERROR: 'Erro de rede na validação',
  SERVER_ERROR: 'Erro do servidor na validação'
} as const

export const SANITIZATION_OPTIONS = {
  HTML: {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: ['href', 'title', 'target'],
    STRIP_TAGS: true,
    STRIP_COMMENTS: true
  },
  TEXT: {
    TRIM: true,
    NORMALIZE_SPACES: true,
    REMOVE_SPECIAL_CHARS: false,
    LOWERCASE: false,
    UPPERCASE: false
  },
  PHONE: {
    REMOVE_NON_DIGITS: true,
    FORMAT: 'BR'
  },
  CPF_CNPJ: {
    REMOVE_NON_DIGITS: true,
    ADD_FORMATTING: false
  }
} as const

// ===== UTILITY FUNCTIONS =====

// CPF validation
export const isValidCPF = (cpf: string): boolean => {
  const cleanCPF = cpf.replace(/\D/g, '')
  
  if (cleanCPF.length !== 11) return false
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false
  
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i)
  }
  let remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(cleanCPF.charAt(9))) return false
  
  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i)
  }
  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(cleanCPF.charAt(10))) return false
  
  return true
}

// CNPJ validation
export const isValidCNPJ = (cnpj: string): boolean => {
  const cleanCNPJ = cnpj.replace(/\D/g, '')
  
  if (cleanCNPJ.length !== 14) return false
  if (/^(\d)\1{13}$/.test(cleanCNPJ)) return false
  
  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  
  let sum = 0
  for (let i = 0; i < 12; i++) {
    sum += parseInt(cleanCNPJ.charAt(i)) * weights1[i]
  }
  let remainder = sum % 11
  const digit1 = remainder < 2 ? 0 : 11 - remainder
  
  if (digit1 !== parseInt(cleanCNPJ.charAt(12))) return false
  
  sum = 0
  for (let i = 0; i < 13; i++) {
    sum += parseInt(cleanCNPJ.charAt(i)) * weights2[i]
  }
  remainder = sum % 11
  const digit2 = remainder < 2 ? 0 : 11 - remainder
  
  return digit2 === parseInt(cleanCNPJ.charAt(13))
}

// Phone validation (Brazilian format)
export const isValidPhone = (phone: string): boolean => {
  const cleanPhone = phone.replace(/\D/g, '')
  return /^(\d{10}|\d{11})$/.test(cleanPhone)
}

// CEP validation
export const isValidCEP = (cep: string): boolean => {
  const cleanCEP = cep.replace(/\D/g, '')
  return /^\d{8}$/.test(cleanCEP)
}

// Strong password validation
export const isStrongPassword = (password: string): boolean => {
  return (
    password.length >= 8 &&
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /\d/.test(password) &&
    /[!@#$%^&*(),.?":{}|<>]/.test(password)
  )
}

// Business hours validation
export const isBusinessHours = (time: string): boolean => {
  const [hours, minutes] = time.split(':').map(Number)
  const totalMinutes = hours * 60 + minutes
  const startTime = 8 * 60 // 08:00
  const endTime = 18 * 60 // 18:00
  return totalMinutes >= startTime && totalMinutes <= endTime
}

// Weekend validation
export const isWeekend = (date: Date): boolean => {
  const day = date.getDay()
  return day === 0 || day === 6 // Sunday or Saturday
}

// Future date validation
export const isFutureDate = (date: Date): boolean => {
  return date > new Date()
}

// Past date validation
export const isPastDate = (date: Date): boolean => {
  return date < new Date()
}

// ===== SANITIZATION FUNCTIONS =====

// Sanitize HTML
export const sanitizeHTML = (html: string, options = SANITIZATION_OPTIONS.HTML): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: options.ALLOWED_TAGS,
    ALLOWED_ATTR: options.ALLOWED_ATTR,
    STRIP_COMMENTS: options.STRIP_COMMENTS
  })
}

// Sanitize text
export const sanitizeText = (text: string, options = SANITIZATION_OPTIONS.TEXT): string => {
  let sanitized = text
  
  if (options.TRIM) {
    sanitized = sanitized.trim()
  }
  
  if (options.NORMALIZE_SPACES) {
    sanitized = sanitized.replace(/\s+/g, ' ')
  }
  
  if (options.REMOVE_SPECIAL_CHARS) {
    sanitized = sanitized.replace(/[^\w\s]/gi, '')
  }
  
  if (options.LOWERCASE) {
    sanitized = sanitized.toLowerCase()
  }
  
  if (options.UPPERCASE) {
    sanitized = sanitized.toUpperCase()
  }
  
  return sanitized
}

// Sanitize phone
export const sanitizePhone = (phone: string, options = SANITIZATION_OPTIONS.PHONE): string => {
  let sanitized = phone
  
  if (options.REMOVE_NON_DIGITS) {
    sanitized = sanitized.replace(/\D/g, '')
  }
  
  if (options.FORMAT === 'BR' && sanitized.length === 11) {
    sanitized = sanitized.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  } else if (options.FORMAT === 'BR' && sanitized.length === 10) {
    sanitized = sanitized.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
  }
  
  return sanitized
}

// Sanitize CPF/CNPJ
export const sanitizeCPFCNPJ = (value: string, options = SANITIZATION_OPTIONS.CPF_CNPJ): string => {
  let sanitized = value
  
  if (options.REMOVE_NON_DIGITS) {
    sanitized = sanitized.replace(/\D/g, '')
  }
  
  if (options.ADD_FORMATTING) {
    if (sanitized.length === 11) {
      // CPF format
      sanitized = sanitized.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
    } else if (sanitized.length === 14) {
      // CNPJ format
      sanitized = sanitized.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
    }
  }
  
  return sanitized
}

// ===== ZOD SCHEMAS =====

// Base schemas
export const baseSchemas = {
  email: z.string().email(VALIDATION_MESSAGES.INVALID_EMAIL),
  
  cpf: z.string().refine(isValidCPF, {
    message: VALIDATION_MESSAGES.INVALID_CPF
  }),
  
  cnpj: z.string().refine(isValidCNPJ, {
    message: VALIDATION_MESSAGES.INVALID_CNPJ
  }),
  
  phone: z.string().refine(isValidPhone, {
    message: VALIDATION_MESSAGES.INVALID_PHONE
  }),
  
  cep: z.string().refine(isValidCEP, {
    message: VALIDATION_MESSAGES.INVALID_CEP
  }),
  
  password: z.string().min(8, VALIDATION_MESSAGES.INVALID_PASSWORD),
  
  strongPassword: z.string().refine(isStrongPassword, {
    message: 'Senha deve conter pelo menos 8 caracteres, incluindo maiúscula, minúscula, número e símbolo'
  }),
  
  url: z.string().url(VALIDATION_MESSAGES.INVALID_URL),
  
  futureDate: z.date().refine(isFutureDate, {
    message: VALIDATION_MESSAGES.FUTURE_DATE_REQUIRED
  }),
  
  pastDate: z.date().refine(isPastDate, {
    message: VALIDATION_MESSAGES.PAST_DATE_REQUIRED
  }),
  
  businessHours: z.string().refine(isBusinessHours, {
    message: VALIDATION_MESSAGES.BUSINESS_HOURS_ONLY
  }),
  
  nonWeekend: z.date().refine(date => !isWeekend(date), {
    message: VALIDATION_MESSAGES.WEEKEND_NOT_ALLOWED
  })
}

// Complex schemas
export const complexSchemas = {
  user: z.object({
    name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
    email: baseSchemas.email,
    phone: baseSchemas.phone,
    cpf: baseSchemas.cpf,
    password: baseSchemas.strongPassword,
    confirmPassword: z.string()
  }).refine(data => data.password === data.confirmPassword, {
    message: VALIDATION_MESSAGES.PASSWORD_MISMATCH,
    path: ['confirmPassword']
  }),
  
  appointment: z.object({
    patientId: z.string().uuid('ID do paciente inválido'),
    doctorId: z.string().uuid('ID do médico inválido'),
    date: baseSchemas.futureDate.refine(date => !isWeekend(date), {
      message: VALIDATION_MESSAGES.WEEKEND_NOT_ALLOWED
    }),
    time: baseSchemas.businessHours,
    type: z.enum(['consultation', 'exam', 'procedure']),
    notes: z.string().max(500, 'Observações devem ter no máximo 500 caracteres').optional()
  }),
  
  address: z.object({
    street: z.string().min(5, 'Endereço deve ter pelo menos 5 caracteres'),
    number: z.string().min(1, 'Número é obrigatório'),
    complement: z.string().optional(),
    neighborhood: z.string().min(2, 'Bairro deve ter pelo menos 2 caracteres'),
    city: z.string().min(2, 'Cidade deve ter pelo menos 2 caracteres'),
    state: z.string().length(2, 'Estado deve ter 2 caracteres'),
    cep: baseSchemas.cep
  }),
  
  payment: z.object({
    amount: z.number().positive('Valor deve ser positivo'),
    method: z.enum(['credit_card', 'debit_card', 'pix', 'cash']),
    installments: z.number().int().min(1).max(12).optional(),
    cardNumber: z.string().optional(),
    cardName: z.string().optional(),
    cardExpiry: z.string().optional(),
    cardCvv: z.string().optional()
  }).refine(data => {
    if (data.method === 'credit_card' || data.method === 'debit_card') {
      return data.cardNumber && data.cardName && data.cardExpiry && data.cardCvv
    }
    return true
  }, {
    message: 'Dados do cartão são obrigatórios',
    path: ['cardNumber']
  })
}

// ===== VALIDATION CLASS =====
export class ValidationSystem {
  private validators: Map<string, FieldValidator> = new Map()
  private customValidators: Map<string, CustomValidator> = new Map()
  
  // Register field validator
  registerValidator(validator: FieldValidator): void {
    this.validators.set(validator.name, validator)
  }
  
  // Register custom validator
  registerCustomValidator(validator: CustomValidator): void {
    this.customValidators.set(validator.name, validator)
  }
  
  // Validate single field
  async validateField(
    fieldName: string,
    value: any,
    context?: ValidationContext
  ): Promise<ValidationResult> {
    const validator = this.validators.get(fieldName)
    if (!validator) {
      return {
        isValid: true,
        errors: [],
        warnings: []
      }
    }
    
    const errors: ValidationError[] = []
    const warnings: ValidationWarning[] = []
    let sanitizedValue = value
    
    try {
      // Sanitize value if needed
      if (validator.config?.sanitize) {
        sanitizedValue = this.sanitizeValue(fieldName, value)
      }
      
      // Trim if needed
      if (validator.config?.trim && typeof sanitizedValue === 'string') {
        sanitizedValue = sanitizedValue.trim()
      }
      
      // Validate with Zod schema
      const result = await validator.schema.safeParseAsync(sanitizedValue)
      if (!result.success) {
        result.error.errors.forEach(error => {
          errors.push({
            field: fieldName,
            message: error.message,
            code: error.code,
            value: sanitizedValue
          })
        })
      }
      
      // Run custom validators
      if (validator.customValidators) {
        for (const customValidator of validator.customValidators) {
          const isValid = await customValidator.validator(sanitizedValue, context)
          if (!isValid) {
            errors.push({
              field: fieldName,
              message: customValidator.message,
              code: customValidator.name,
              value: sanitizedValue
            })
          }
        }
      }
      
    } catch (error) {
      errors.push({
        field: fieldName,
        message: 'Erro interno de validação',
        code: 'VALIDATION_ERROR',
        value: sanitizedValue
      })
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      sanitizedValue
    }
  }
  
  // Validate multiple fields
  async validateFields(
    data: Record<string, any>,
    fieldNames?: string[]
  ): Promise<Record<string, ValidationResult>> {
    const fieldsToValidate = fieldNames || Object.keys(data)
    const results: Record<string, ValidationResult> = {}
    
    const validationPromises = fieldsToValidate.map(async fieldName => {
      const context: ValidationContext = {
        formData: data,
        fieldName,
        fieldValue: data[fieldName],
        isSubmitting: false,
        isDirty: true,
        isTouched: true
      }
      
      const result = await this.validateField(fieldName, data[fieldName], context)
      return { fieldName, result }
    })
    
    const validationResults = await Promise.all(validationPromises)
    
    validationResults.forEach(({ fieldName, result }) => {
      results[fieldName] = result
    })
    
    return results
  }
  
  // Validate with schema
  async validateWithSchema<T>(
    schema: z.ZodSchema<T>,
    data: any
  ): Promise<ValidationResult> {
    try {
      const result = await schema.safeParseAsync(data)
      
      if (result.success) {
        return {
          isValid: true,
          errors: [],
          warnings: [],
          sanitizedValue: result.data
        }
      }
      
      const errors: ValidationError[] = result.error.errors.map(error => ({
        field: error.path.join('.'),
        message: error.message,
        code: error.code,
        value: error.path.reduce((obj, key) => obj?.[key], data)
      }))
      
      return {
        isValid: false,
        errors,
        warnings: []
      }
      
    } catch (error) {
      return {
        isValid: false,
        errors: [{
          field: 'root',
          message: 'Erro interno de validação',
          code: 'VALIDATION_ERROR'
        }],
        warnings: []
      }
    }
  }
  
  // Sanitize value based on field type
  private sanitizeValue(fieldName: string, value: any): any {
    if (typeof value !== 'string') return value
    
    // Determine sanitization based on field name
    if (fieldName.includes('email')) {
      return sanitizeText(value, { ...SANITIZATION_OPTIONS.TEXT, LOWERCASE: true })
    }
    
    if (fieldName.includes('phone')) {
      return sanitizePhone(value)
    }
    
    if (fieldName.includes('cpf') || fieldName.includes('cnpj')) {
      return sanitizeCPFCNPJ(value)
    }
    
    if (fieldName.includes('html') || fieldName.includes('content')) {
      return sanitizeHTML(value)
    }
    
    return sanitizeText(value)
  }
}

// ===== DEFAULT INSTANCE =====
export const validationSystem = new ValidationSystem()

// Register common validators
validationSystem.registerValidator({
  name: 'email',
  schema: baseSchemas.email,
  config: { required: true, trim: true, sanitize: true }
})

validationSystem.registerValidator({
  name: 'cpf',
  schema: baseSchemas.cpf,
  config: { required: true, trim: true, sanitize: true }
})

validationSystem.registerValidator({
  name: 'phone',
  schema: baseSchemas.phone,
  config: { required: true, trim: true, sanitize: true }
})

validationSystem.registerValidator({
  name: 'password',
  schema: baseSchemas.strongPassword,
  config: { required: true }
})

// ===== HOOKS =====

// Field validation hook
export const useFieldValidation = (
  fieldName: string,
  value: any,
  options: {
    validateOnChange?: boolean
    validateOnBlur?: boolean
    debounce?: number
  } = {}
) => {
  const [result, setResult] = React.useState<ValidationResult>({
    isValid: true,
    errors: [],
    warnings: []
  })
  const [isValidating, setIsValidating] = React.useState(false)
  
  const {
    validateOnChange = true,
    validateOnBlur = true,
    debounce = 300
  } = options
  
  const validate = React.useCallback(async () => {
    setIsValidating(true)
    try {
      const validationResult = await validationSystem.validateField(fieldName, value)
      setResult(validationResult)
    } finally {
      setIsValidating(false)
    }
  }, [fieldName, value])
  
  // Debounced validation
  const debouncedValidate = React.useMemo(
    () => {
      let timeoutId: NodeJS.Timeout
      return () => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(validate, debounce)
      }
    },
    [validate, debounce]
  )
  
  // Validate on change
  React.useEffect(() => {
    if (validateOnChange && value !== undefined) {
      debouncedValidate()
    }
  }, [value, validateOnChange, debouncedValidate])
  
  const validateOnBlurHandler = React.useCallback(() => {
    if (validateOnBlur) {
      validate()
    }
  }, [validate, validateOnBlur])
  
  return {
    ...result,
    isValidating,
    validate,
    validateOnBlur: validateOnBlurHandler
  }
}

// Form validation hook
export const useFormValidation = <T extends Record<string, any>>(
  schema: z.ZodSchema<T>,
  initialData: T
) => {
  const [data, setData] = React.useState<T>(initialData)
  const [errors, setErrors] = React.useState<Record<string, ValidationError[]>>({})
  const [isValidating, setIsValidating] = React.useState(false)
  const [isValid, setIsValid] = React.useState(false)
  
  const validateForm = React.useCallback(async () => {
    setIsValidating(true)
    try {
      const result = await validationSystem.validateWithSchema(schema, data)
      
      const errorsByField: Record<string, ValidationError[]> = {}
      result.errors.forEach(error => {
        if (!errorsByField[error.field]) {
          errorsByField[error.field] = []
        }
        errorsByField[error.field].push(error)
      })
      
      setErrors(errorsByField)
      setIsValid(result.isValid)
      
      return result
    } finally {
      setIsValidating(false)
    }
  }, [schema, data])
  
  const updateField = React.useCallback((field: keyof T, value: any) => {
    setData(prev => ({ ...prev, [field]: value }))
  }, [])
  
  const updateData = React.useCallback((newData: Partial<T>) => {
    setData(prev => ({ ...prev, ...newData }))
  }, [])
  
  const reset = React.useCallback(() => {
    setData(initialData)
    setErrors({})
    setIsValid(false)
  }, [initialData])
  
  return {
    data,
    errors,
    isValid,
    isValidating,
    updateField,
    updateData,
    validateForm,
    reset
  }
}

// ===== EXPORTS =====
export {
  ValidationSystem,
  validationSystem,
  baseSchemas,
  complexSchemas,
  useFieldValidation,
  useFormValidation,
  sanitizeHTML,
  sanitizeText,
  sanitizePhone,
  sanitizeCPFCNPJ,
  isValidCPF,
  isValidCNPJ,
  isValidPhone,
  isValidCEP,
  isStrongPassword
}

// React import
import React from 'react'