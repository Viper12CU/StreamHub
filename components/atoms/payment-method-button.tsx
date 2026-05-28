"use client";

import { cn } from "@/lib/utils";
import { Smartphone, Building, Wallet } from "lucide-react";

type PaymentMethod = "transfermovil" | "zelle" | "mlc";

interface PaymentMethodButtonProps {
  method: PaymentMethod;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const icons: Record<PaymentMethod, React.ReactNode> = {
  transfermovil: <Smartphone className="w-12 h-12" />,
  zelle: <Building className="w-12 h-12" />,
  mlc: <Wallet className="w-12 h-12" />,
};

export function PaymentMethodButton({
  method,
  label,
  isActive,
  onClick,
}: PaymentMethodButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "glass rounded-xl p-6 flex flex-col items-center text-center transition-all hover:border-blue-500/50 group",
        isActive && "border-2 border-blue-500 bg-blue-500/10"
      )}
    >
      <span
        className={cn(
          "transition-transform group-hover:scale-110",
          isActive ? "text-blue-500" : "text-neutral-400 group-hover:text-blue-500"
        )}
      >
        {icons[method]}
      </span>
      <span className="mt-4 font-semibold text-xs uppercase tracking-wider">
        {label}
      </span>
    </button>
  );
}
