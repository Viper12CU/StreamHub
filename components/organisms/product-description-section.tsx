import { cn } from "@/lib/utils";

interface ProductDescriptionSectionProps {
  description: string;
  className?: string;
}

export function ProductDescriptionSection({ description, className }: ProductDescriptionSectionProps) {
  return (
    <div
      className={cn(
        "glass-panel rounded-2xl p-5 border-l-2 border-primary",
        className
      )}
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
        Descripción
      </p>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
}
