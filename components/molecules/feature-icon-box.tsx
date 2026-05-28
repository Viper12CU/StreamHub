import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface FeatureIconBoxProps {
  icon: LucideIcon;
  label: string;
  className?: string;
}

export function FeatureIconBox({ icon: Icon, label, className }: FeatureIconBoxProps) {
  return (
    <div className={cn(
      "glass-panel p-4 rounded-xl flex flex-col items-center gap-2",
      className
    )}>
      <Icon className="w-6 h-6 text-primary" />
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}
