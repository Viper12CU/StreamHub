"use client"

import { FormInput } from "@/components/atoms/form-input"
import { LucideIcon, AlertCircle, CheckCircle2 } from "lucide-react"
import { InputHTMLAttributes } from "react"

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  icon?: LucideIcon
  error?: string
  valid?: boolean
  rightAction?: React.ReactNode
  rightIcon?: React.ReactNode
}

export function FormField({ 
  label, 
  icon, 
  error, 
  valid, 
  rightAction,
  rightIcon,
  ...inputProps 
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-xs font-semibold tracking-wider text-muted-foreground">
          {label}
        </label>
        {rightAction}
      </div>
      <FormInput 
        icon={icon}
        error={!!error}
        valid={valid}
        rightIcon={
          rightIcon || (
            error ? (
              <AlertCircle className="w-5 h-5 text-destructive" />
            ) : valid ? (
              <CheckCircle2 className="w-5 h-5 text-primary fill-primary" />
            ) : null
          )
        }
        {...inputProps}
      />
      {error && (
        <p className="text-destructive text-sm">{error}</p>
      )}
    </div>
  )
}
