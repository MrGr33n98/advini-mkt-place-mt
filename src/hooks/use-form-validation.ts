import { useState, useEffect, useMemo, useCallback } from 'react'
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

  // Memoize rules to prevent unnecessary re-renders
  const memoizedRules = useMemo(() => rules, [JSON.stringify(rules)])

  // Initialize validation state
  useEffect(() => {
    const initialValidation: ValidationState = {}
    memoizedRules.forEach(rule => {
      initialValidation[rule.field] = {
        isValid: false,
        error: null,
        isValidating: false
      }
    })
    setValidation(initialValidation)
  }, [memoizedRules])

  // Debounced validation
  useEffect(() => {
    const timeouts: Record<string, NodeJS.Timeout> = {}

    Object.keys(values).forEach(field => {
      const rule = memoizedRules.find(r => r.field === field)
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
  }, [values, memoizedRules, debounceMs])

  // Check if form is valid
  useEffect(() => {
    const allFieldsValid = memoizedRules.every(rule => 
      validation[rule.field]?.isValid === true
    )
    const hasAllRequiredFields = memoizedRules.every(rule => 
      values[rule.field] !== undefined && values[rule.field] !== ''
    )
    
    setIsFormValid(allFieldsValid && hasAllRequiredFields)
  }, [validation, values, memoizedRules])

  const updateField = useCallback((field: string, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }))
  }, [])

  const getFieldValidation = useCallback((field: string) => {
    return validation[field] || { isValid: false, error: null, isValidating: false }
  }, [validation])

  const resetValidation = useCallback(() => {
    const resetValidation: ValidationState = {}
    memoizedRules.forEach(rule => {
      resetValidation[rule.field] = {
        isValid: false,
        error: null,
        isValidating: false
      }
    })
    setValidation(resetValidation)
    setValues({})
  }, [memoizedRules])

  return {
    values,
    validation,
    isFormValid,
    updateField,
    getFieldValidation,
    resetValidation
  }
}