import { Info, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

type InfoBoxVariant = "info" | "warning" | "guarantee";

interface InfoBoxProps {
  variant?: InfoBoxVariant;
  children: React.ReactNode;
  className?: string;
}

const variantConfig = {
  info: {
    icon: Info,
    className: "border-l-2 border-l-white/20 border-y border-r-white/[0.06] bg-white/[0.06] text-foreground/80",
    iconClass: "text-primary",
  },
  warning: {
    icon: Info,
    className: "border-l-2 border-l-amber-500/40 border-y border-r-amber-500/[0.06] bg-amber-500/[0.08] text-amber-400",
    iconClass: "text-amber-400",
  },
  guarantee: {
    icon: Shield,
    className: "border-l-2 border-l-primary/40 border-y border-r-primary/[0.06] bg-primary/[0.08] text-foreground/80",
    iconClass: "text-primary",
  },
};

export function InfoBox({ variant = "info", children, className }: InfoBoxProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <div className={cn(
      "rounded-2xl p-4 flex items-start gap-3 border",
      config.className,
      className
    )}>
      <Icon className={cn("w-5 h-5 mt-0.5 flex-shrink-0", config.iconClass)} />
      <p className="text-sm">{children}</p>
    </div>
  );
}
