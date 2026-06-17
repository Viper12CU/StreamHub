import { cn } from "@/lib/utils"

interface ButtonSpinnerProps extends React.SVGProps<SVGSVGElement> {
  size?: number
}

function ButtonSpinner({ className, size = 16, ...props }: ButtonSpinnerProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={cn("shrink-0", className)}
      role="status"
      aria-label="Loading"
      {...props}
    >
      <circle cx="4" cy="12" r="3" fill="currentColor">
        <animate
          attributeName="r"
          begin="0;end-0.25s"
          dur="0.75s"
          values="3;.2;3"
        />
      </circle>
      <circle cx="12" cy="12" r="3" fill="currentColor">
        <animate
          attributeName="r"
          begin="0.15s"
          dur="0.75s"
          values="3;.2;3"
        />
      </circle>
      <circle cx="20" cy="12" r="3" fill="currentColor">
        <animate
          attributeName="r"
          begin="0.3s"
          dur="0.75s"
          values="3;.2;3"
        />
      </circle>
    </svg>
  )
}

export { ButtonSpinner }
