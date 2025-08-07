import { useState, useEffect } from 'react'
import { z } from 'zod'

export interface ValidationRule {
  field: string
  schema: z.ZodSchema
  message?: string
}

export interface UseFormValidationProps {
  rules: ValidationRule[]
  debounceMs?: number
}

export interface ValidationState {
  [field: string]: {
    isValid: boolean
    error: string | null
    isValidating: boolean
  }
}

export function useFormValidation({ rules, debounceMs = 300 }: UseFormValidationProps) {
  const [values, setValues] = useState<Record<string, any>>({})
  const [validation, setValidation] = useState<ValidationState>({})
  const [isFormValid, setIsFormValid] = useState(false)

  // Initialize validation state
  useEffect(() => {
    const initialValidation: ValidationState = {}
    rules.forEach(rule => {
      initialValidation[rule.field] = {
        isValid: false,
        error: null,
        isValidating: false
      }
    })
    setValidation(initialValidation)
  }, [rules])

  // Debounced validation
  useEffect(() => {
    const timeouts: Record<string, NodeJS.Timeout> = {}

    Object.keys(values).forEach(field => {
      const rule = rules.find(r => r.field === field)
      if (!rule) return

      // Set validating state
      setValidation(prev => ({
        ...prev,
        [field]: { ...prev[field], isValidating: true }
      }))

      // Clear existing timeout
      if (timeouts[field]) {
        clearTimeout(timeouts[field])
      }

      // Set new timeout for validation
      timeouts[field] = setTimeout(() => {
        try {
          rule.schema.parse(values[field])
          setValidation(prev => ({
            ...prev,
            [field]: {
              isValid: true,
              error: null,
              isValidating: false
            }
          }))
        } catch (error) {
          if (error instanceof z.ZodError) {
            setValidation(prev => ({
              ...prev,
              [field]: {
                isValid: false,
                error: error.errors[0]?.message || rule.message || 'Campo inválido',
                isValidating: false
              }
            }))
          }
        }
      }, debounceMs)
    })

    return () => {
      Object.values(timeouts).forEach(timeout => clearTimeout(timeout))
    }
  }, [values, rules, debounceMs])

  // Check if form is valid
  useEffect(() => {
    const allFieldsValid = rules.every(rule => 
      validation[rule.field]?.isValid === true
    )
    const hasAllRequiredFields = rules.every(rule => 
      values[rule.field] !== undefined && values[rule.field] !== ''
    )
    
    setIsFormValid(allFieldsValid && hasAllRequiredFields)
  }, [validation, values, rules])

  const updateField = (field: string, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }))
  }

  const getFieldValidation = (field: string) => {
    return validation[field] || { isValid: false, error: null, isValidating: false }
  }

  const resetValidation = () => {
    const resetValidation: ValidationState = {}
    rules.forEach(rule => {
      resetValidation[rule.field] = {
        isValid: false,
        error: null,
        isValidating: false
      }
    })
    setValidation(resetValidation)
    setValues({})
  }

  return {
    values,
    validation,
    isFormValid,
    updateField,
    getFieldValidation,
    resetValidation
  }
}