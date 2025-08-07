/**
 * Modern Form System
 * Arquitetura baseada em benchmarks da indústria:
 * - React Hook Form + Zod
 * - Type-safe validation
 * - Accessibility First
 * - Performance Optimized
 * - Reusable Field Components
 */

import { z } from 'zod'
import { useForm, UseFormProps, FieldPath, FieldValues, Control } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

// ===== TYPES =====
export type FormFieldType = 
  | 'text' 
  | 'email' 
  | 'password' 
  | 'number' 
  | 'tel' 
  | 'url'
  | 'textarea'
  | 'select'
  | 'multiselect'
  | 'checkbox'
  | 'radio'
  | 'date'
  | 'time'
  | 'datetime'
  | 'file'
  | 'switch'
  | 'slider'
  | 'rating'

export interface FormFieldConfig<T extends FieldValues = FieldValues> {
  name: FieldPath<T>
  type: FormFieldType
  label: string
  placeholder?: string
  description?: string
  required?: boolean
  disabled?: boolean
  options?: Array<{ value: string | number; label: string; disabled?: boolean }>
  validation?: z.ZodSchema
  dependencies?: FieldPath<T>[]
  conditional?: (values: T) => boolean
  transform?: (value: any) => any
  format?: (value: any) => string
}

export interface FormSection<T extends FieldValues = FieldValues> {
  id: string
  title: string
  description?: string
  fields: FormFieldConfig<T>[]
  conditional?: (values: T) => boolean
  collapsible?: boolean
  defaultCollapsed?: boolean
}

export interface FormConfig<T extends FieldValues = FieldValues> {
  schema: z.ZodSchema<T>
  sections?: FormSection<T>[]
  fields?: FormFieldConfig<T>[]
  defaultValues?: Partial<T>
  mode?: 'onChange' | 'onBlur' | 'onSubmit' | 'onTouched' | 'all'
  reValidateMode?: 'onChange' | 'onBlur' | 'onSubmit'
  shouldFocusError?: boolean
  delayError?: number
}

// ===== VALIDATION SCHEMAS =====
export const commonValidations = {
  // Text validations
  required: (message = 'Este campo é obrigatório') => 
    z.string().min(1, message),
  
  minLength: (min: number, message?: string) =>
    z.string().min(min, message || `Mínimo de ${min} caracteres`),
  
  maxLength: (max: number, message?: string) =>
    z.string().max(max, message || `Máximo de ${max} caracteres`),
  
  // Email validation
  email: (message = 'Email inválido') =>
    z.string().email(message),
  
  // Phone validation (Brazilian format)
  phone: (message = 'Telefone inválido') =>
    z.string().regex(
      /^(\+55\s?)?(\(?\d{2}\)?\s?)?\d{4,5}-?\d{4}$/,
      message
    ),
  
  // CPF validation
  cpf: (message = 'CPF inválido') =>
    z.string().regex(
      /^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/,
      message
    ).refine(validateCPF, message),
  
  // CNPJ validation
  cnpj: (message = 'CNPJ inválido') =>
    z.string().regex(
      /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$|^\d{14}$/,
      message
    ).refine(validateCNPJ, message),
  
  // Password validation
  password: (message = 'Senha deve ter pelo menos 8 caracteres, incluindo maiúscula, minúscula e número') =>
    z.string()
      .min(8, 'Senha deve ter pelo menos 8 caracteres')
      .regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
      .regex(/[a-z]/, 'Senha deve conter pelo menos uma letra minúscula')
      .regex(/\d/, 'Senha deve conter pelo menos um número'),
  
  // Confirm password - use with z.object().refine() for cross-field validation
  confirmPassword: (passwordField: string) => z.string(),
  
  // Number validations
  positiveNumber: (message = 'Deve ser um número positivo') =>
    z.number().positive(message),
  
  integerNumber: (message = 'Deve ser um número inteiro') =>
    z.number().int(message),
  
  numberRange: (min: number, max: number, message?: string) =>
    z.number()
      .min(min, message || `Deve ser maior que ${min}`)
      .max(max, message || `Deve ser menor que ${max}`),
  
  // Date validations
  futureDate: (message = 'Data deve ser no futuro') =>
    z.date().refine(date => date > new Date(), message),
  
  pastDate: (message = 'Data deve ser no passado') =>
    z.date().refine(date => date < new Date(), message),
  
  dateRange: (minDate: Date, maxDate: Date) =>
    z.date()
      .min(minDate, `Data deve ser após ${minDate.toLocaleDateString()}`)
      .max(maxDate, `Data deve ser antes de ${maxDate.toLocaleDateString()}`),
  
  // File validations
  fileSize: (maxSizeInMB: number, message?: string) =>
    z.instanceof(File).refine(
      file => file.size <= maxSizeInMB * 1024 * 1024,
      message || `Arquivo deve ter no máximo ${maxSizeInMB}MB`
    ),
  
  fileType: (allowedTypes: string[], message?: string) =>
    z.instanceof(File).refine(
      file => allowedTypes.includes(file.type),
      message || `Tipo de arquivo não permitido. Permitidos: ${allowedTypes.join(', ')}`
    ),
  
  // Array validations
  minItems: (min: number, message?: string) =>
    z.array(z.any()).min(min, message || `Selecione pelo menos ${min} item(s)`),
  
  maxItems: (max: number, message?: string) =>
    z.array(z.any()).max(max, message || `Selecione no máximo ${max} item(s)`),
}

// Helper function for password confirmation validation
export const passwordConfirmationSchema = (passwordField: string, confirmField: string) => {
  return z.object({}).refine((data: any) => {
    return data[passwordField] === data[confirmField]
  }, {
    message: 'Senhas não coincidem',
    path: [confirmField]
  })
}

// ===== UTILITY FUNCTIONS =====

// CPF validation algorithm
function validateCPF(cpf: string): boolean {
  const cleanCPF = cpf.replace(/\D/g, '')
  
  if (cleanCPF.length !== 11 || /^(\d)\1{10}$/.test(cleanCPF)) {
    return false
  }
  
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
  
  return remainder === parseInt(cleanCPF.charAt(10))
}

// CNPJ validation algorithm
function validateCNPJ(cnpj: string): boolean {
  const cleanCNPJ = cnpj.replace(/\D/g, '')
  
  if (cleanCNPJ.length !== 14 || /^(\d)\1{13}$/.test(cleanCNPJ)) {
    return false
  }
  
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

// Format functions
export const formatters = {
  cpf: (value: string) => {
    const cleaned = value.replace(/\D/g, '')
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  },
  
  cnpj: (value: string) => {
    const cleaned = value.replace(/\D/g, '')
    return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
  },
  
  phone: (value: string) => {
    const cleaned = value.replace(/\D/g, '')
    if (cleaned.length === 11) {
      return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
    } else if (cleaned.length === 10) {
      return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
    }
    return value
  },
  
  currency: (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  },
  
  percentage: (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'percent',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(value / 100)
  },
  
  date: (value: Date) => {
    return new Intl.DateTimeFormat('pt-BR').format(value)
  },
  
  datetime: (value: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(value)
  }
}

// ===== FORM BUILDER =====
export class FormBuilder<T extends FieldValues = FieldValues> {
  private config: FormConfig<T>
  
  constructor(schema: z.ZodSchema<T>) {
    this.config = {
      schema,
      fields: [],
      sections: [],
      mode: 'onBlur',
      reValidateMode: 'onChange',
      shouldFocusError: true,
      delayError: 300
    }
  }
  
  // Add field
  addField(field: FormFieldConfig<T>): this {
    this.config.fields = this.config.fields || []
    this.config.fields.push(field)
    return this
  }
  
  // Add section
  addSection(section: FormSection<T>): this {
    this.config.sections = this.config.sections || []
    this.config.sections.push(section)
    return this
  }
  
  // Set default values
  setDefaultValues(values: Partial<T>): this {
    this.config.defaultValues = values
    return this
  }
  
  // Set validation mode
  setMode(mode: FormConfig<T>['mode']): this {
    this.config.mode = mode
    return this
  }
  
  // Build form hook
  build() {
    return () => useForm<T>({
      resolver: zodResolver(this.config.schema),
      defaultValues: this.config.defaultValues,
      mode: this.config.mode,
      reValidateMode: this.config.reValidateMode,
      shouldFocusError: this.config.shouldFocusError,
      delayError: this.config.delayError
    })
  }
  
  // Get configuration
  getConfig(): FormConfig<T> {
    return this.config
  }
}

// ===== FORM HOOKS =====

// Enhanced form hook with additional features
export function useEnhancedForm<T extends FieldValues>(
  config: FormConfig<T>
) {
  const form = useForm<T>({
    resolver: zodResolver(config.schema),
    defaultValues: config.defaultValues,
    mode: config.mode || 'onBlur',
    reValidateMode: config.reValidateMode || 'onChange',
    shouldFocusError: config.shouldFocusError ?? true,
    delayError: config.delayError || 300
  })
  
  // Auto-save functionality
  const useAutoSave = (
    onSave: (data: T) => Promise<void>,
    delay = 2000
  ) => {
    const { watch } = form
    const watchedValues = watch()
    
    React.useEffect(() => {
      const timeoutId = setTimeout(() => {
        if (form.formState.isValid && form.formState.isDirty) {
          onSave(watchedValues)
        }
      }, delay)
      
      return () => clearTimeout(timeoutId)
    }, [watchedValues, delay, onSave])
  }
  
  // Field visibility logic
  const isFieldVisible = (field: FormFieldConfig<T>) => {
    if (!field.conditional) return true
    return field.conditional(form.watch())
  }
  
  // Section visibility logic
  const isSectionVisible = (section: FormSection<T>) => {
    if (!section.conditional) return true
    return section.conditional(form.watch())
  }
  
  // Get visible fields
  const getVisibleFields = () => {
    return config.fields?.filter(isFieldVisible) || []
  }
  
  // Get visible sections
  const getVisibleSections = () => {
    return config.sections?.filter(isSectionVisible) || []
  }
  
  // Reset form with new data
  const resetWithData = (data: Partial<T>) => {
    form.reset(data)
  }
  
  // Submit with loading state
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  
  const handleSubmit = (onSubmit: (data: T) => Promise<void>) => {
    return form.handleSubmit(async (data) => {
      setIsSubmitting(true)
      try {
        await onSubmit(data)
      } finally {
        setIsSubmitting(false)
      }
    })
  }
  
  return {
    ...form,
    config,
    isSubmitting,
    useAutoSave,
    isFieldVisible,
    isSectionVisible,
    getVisibleFields,
    getVisibleSections,
    resetWithData,
    handleSubmit
  }
}

// ===== COMMON FORM SCHEMAS =====
export const commonSchemas = {
  // User registration
  userRegistration: z.object({
    name: commonValidations.required().pipe(commonValidations.minLength(2)),
    email: commonValidations.email(),
    password: commonValidations.password(),
    confirmPassword: z.string(),
    phone: commonValidations.phone().optional(),
    birthDate: z.date().optional(),
    acceptTerms: z.boolean().refine(val => val === true, 'Você deve aceitar os termos')
  }).refine(data => data.password === data.confirmPassword, {
    message: 'Senhas não coincidem',
    path: ['confirmPassword']
  }),
  
  // Contact form
  contact: z.object({
    name: commonValidations.required().pipe(commonValidations.minLength(2)),
    email: commonValidations.email(),
    subject: commonValidations.required(),
    message: commonValidations.required().pipe(commonValidations.minLength(10)),
    phone: commonValidations.phone().optional()
  }),
  
  // Address form
  address: z.object({
    street: commonValidations.required(),
    number: commonValidations.required(),
    complement: z.string().optional(),
    neighborhood: commonValidations.required(),
    city: commonValidations.required(),
    state: commonValidations.required(),
    zipCode: z.string().regex(/^\d{5}-?\d{3}$/, 'CEP inválido'),
    country: z.string().default('Brasil')
  }),
  
  // Payment form
  payment: z.object({
    cardNumber: z.string().regex(/^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/, 'Número do cartão inválido'),
    cardName: commonValidations.required(),
    expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Data de expiração inválida'),
    cvv: z.string().regex(/^\d{3,4}$/, 'CVV inválido'),
    installments: z.number().int().min(1).max(12)
  })
}

// ===== EXPORTS =====
export {
  useEnhancedForm,
  type FormFieldConfig,
  type FormSection,
  type FormConfig,
  type FormFieldType
}

// React import for hooks
import React from 'react'