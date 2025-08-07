import React from 'react'
import { Input } from './input'
import { Label } from './label'
import { cn } from '@/lib/utils'
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

interface ValidatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string | null
  isValid?: boolean
  isValidating?: boolean
  description?: string
}

export const ValidatedInput = React.forwardRef<HTMLInputElement, ValidatedInputProps>(
  ({ label, error, isValid, isValidating, description, className, ...props }, ref) => {
    const hasError = error && !isValidating
    const hasSuccess = isValid && !isValidating && !error

    return (
      <div className="space-y-2">
        <Label htmlFor={props.id} className="text-sm font-medium">
          {label}
        </Label>
        <div className="relative">
          <Input
            ref={ref}
            className={cn(
              "pr-10",
              hasError && "border-red-500 focus:border-red-500 focus:ring-red-500",
              hasSuccess && "border-green-500 focus:border-green-500 focus:ring-green-500",
              className
            )}
            {...props}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {isValidating && (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            )}
            {hasError && (
              <AlertCircle className="h-4 w-4 text-red-500" />
            )}
            {hasSuccess && (
              <CheckCircle className="h-4 w-4 text-green-500" />
            )}
          </div>
        </div>
        {description && !error && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
        {hasError && (
          <p className="text-xs text-red-500">{error}</p>
        )}
      </div>
    )
  }
)

ValidatedInput.displayName = "ValidatedInput"