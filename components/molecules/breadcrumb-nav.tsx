import { ChevronRight } from "lucide-react";
import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbNavProps {
  items: BreadcrumbItem[];
}

export function BreadcrumbNav({ items }: BreadcrumbNavProps) {
  return (
    <nav className="flex items-center gap-1 text-xs text-muted-foreground">
      {items.map((item, index) => (
        <span key={index} className="flex items-center gap-1">
          {item.href ? (
            <Link href={item.href} className="hover:text-primary transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground">{item.label}</span>
          )}
          {index < items.length - 1 && (
            <ChevronRight className="w-3.5 h-3.5" />
          )}
        </span>
      ))}
    </nav>
  );
}
