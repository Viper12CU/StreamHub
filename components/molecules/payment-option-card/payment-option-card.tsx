import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PaymentOptionCardProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  name: string;
  logoFallback: string;
  logo?: ReactNode;
  highlighted?: boolean;
}

export function PaymentOptionCard({
  name,
  logoFallback,
  logo,
  highlighted = false,
  className,
  ...props
}: PaymentOptionCardProps) {
  return (
    <button
      type="button"
      className={cn(
        "group relative min-h-[178px] overflow-hidden rounded-3xl border p-6 text-left transition-all duration-300",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        highlighted
          ? "border-primary/35 bg-primary/15 shadow-2xl shadow-primary/20 hover:border-primary/55 hover:bg-primary/20"
          : "border-white/10 bg-white/[0.035] shadow-xl shadow-black/10 hover:border-primary/35 hover:bg-white/[0.06]",
        className
      )}
      {...props}
    >
      <span
        className={cn(
          "absolute -right-12 -top-16 h-36 w-36 rounded-full blur-3xl transition-opacity duration-300",
          highlighted ? "bg-primary/30 opacity-80" : "bg-primary/20 opacity-0 group-hover:opacity-60"
        )}
        aria-hidden="true"
      />

      <span className="relative flex h-full flex-col justify-between gap-8">
        <span
          className={cn(
            "flex h-20 w-20 items-center justify-center rounded-3xl border text-lg font-black tracking-tight shadow-inner",
            highlighted
              ? "border-primary/35 bg-background/50 text-primary shadow-primary/10"
              : "border-white/15 bg-background/45 text-foreground shadow-white/5"
          )}
        >
          {logo ?? logoFallback}
        </span>

        <span className="space-y-2">
          <span className="block text-2xl font-black leading-none text-foreground">{name}</span>
          <span className="inline-flex items-center rounded-full border border-primary/25 bg-primary/10 px-4 py-2 text-sm font-bold text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
            Comprar ahora
          </span>
        </span>
      </span>
    </button>
  );
}
