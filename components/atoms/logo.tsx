import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
}

export function Logo({ className }: LogoProps) {
  return (
    <div className={cn(
      "font-black text-2xl text-primary tracking-tighter",
      className
    )}>
      StreamHub
    </div>
  )
}
