"use client"

import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"
import { InputHTMLAttributes, forwardRef } from "react"

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: LucideIcon
  error?: boolean
  valid?: boolean
  rightIcon?: React.ReactNode
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ className, icon: Icon, error, valid, rightIcon, ...props }, ref) => {
    return (
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        )}
        <input
          ref={ref}
          className={cn(
            "w-full bg-[#111827] border-b-2 text-foreground px-4 py-3 focus:outline-none transition-all rounded-t-lg",
            Icon && "pl-11",
            rightIcon && "pr-11",
            error && "border-destructive",
            valid && "border-primary",
            !error && !valid && "border-border focus:border-secondary",
            className
          )}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightIcon}
          </div>
        )}
      </div>
    )
  }
)

FormInput.displayName = "FormInput"
