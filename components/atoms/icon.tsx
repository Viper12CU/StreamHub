import { cn } from "@/lib/utils"
import { forwardRef } from "react"

interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: string
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl"
  className?: string
}

const sizeMap: Record<string, string> = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
  "3xl": "text-3xl",
  "4xl": "text-4xl",
}

const Icon = forwardRef<HTMLSpanElement, IconProps>(
  ({ name, size = "lg", className, style, ...props }, ref) => (
    <span
      ref={ref}
      className={cn("mdi", `mdi-${name}`, sizeMap[size], className)}
      style={style}
      aria-hidden="true"
      {...props}
    />
  )
)

Icon.displayName = "Icon"

export { Icon }
export type { IconProps }
