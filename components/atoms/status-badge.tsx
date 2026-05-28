import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type StatusType = "available" | "limited" | "soldout";

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const statusConfig = {
  available: {
    label: "Disponible",
    icon: CheckCircle,
    className: "text-green-400",
  },
  limited: {
    label: "Últimas unidades",
    icon: AlertTriangle,
    className: "text-amber-400",
  },
  soldout: {
    label: "Agotado",
    icon: XCircle,
    className: "text-red-400",
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span className={cn("text-xs font-semibold flex items-center gap-1", config.className, className)}>
      <Icon className="w-4 h-4" />
      {config.label}
    </span>
  );
}
