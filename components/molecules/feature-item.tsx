import { CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureItemProps {
  text: string;
  className?: string;
}

export function FeatureItem({ text, className }: FeatureItemProps) {
  return (
    <li className={cn("flex items-center gap-2", className)}>
      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
      <span className="text-foreground text-sm">{text}</span>
    </li>
  );
}
