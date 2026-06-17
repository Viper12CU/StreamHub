import { cn } from "@/lib/utils"
import { ButtonHTMLAttributes, forwardRef } from "react"
import { ButtonSpinner } from "./button-spinner"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "whatsapp"
  size?: "sm" | "md" | "lg"
  loading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading = false, disabled, children, ...props }, ref) => {
    const variantClasses = {
      primary: "bg-primary text-primary-foreground hover:opacity-90 shadow-lg shadow-primary/20",
      secondary: "glass-panel hover:bg-white/5",
      ghost: "bg-transparent hover:bg-white/5",
      whatsapp: "bg-[#25D366] text-white hover:scale-105",
    }

    const sizeClasses = {
      sm: "px-4 py-2 text-xs font-semibold",
      md: "px-6 py-3 text-sm font-semibold",
      lg: "px-16 py-6 text-xl font-semibold",
    }

    return (
      <button
        ref={ref}
        className={cn(
          "rounded-xl transition-all duration-300 inline-flex items-center justify-center gap-2",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <ButtonSpinner />}
        {children}
      </button>
    )
  }
)

Button.displayName = "Button"

export { Button }
