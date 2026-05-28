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
    className: "bg-primary/10 border-primary/20 text-muted-foreground",
    iconClass: "text-primary",
  },
  warning: {
    icon: Info,
    className: "bg-amber-500/10 border-amber-500/20 text-amber-500",
    iconClass: "text-amber-500",
  },
  guarantee: {
    icon: Shield,
    className: "bg-amber-500/10 text-amber-500",
    iconClass: "text-amber-500",
  },
};

export function InfoBox({ variant = "info", children, className }: InfoBoxProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <div className={cn(
      "rounded-xl p-4 flex items-start gap-3 border",
      config.className,
      className
    )}>
      <Icon className={cn("w-5 h-5 mt-0.5 flex-shrink-0", config.iconClass)} />
      <p className="text-sm">{children}</p>
    </div>
  );
}
