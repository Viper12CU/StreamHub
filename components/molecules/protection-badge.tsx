import { ShieldCheck } from "lucide-react";

export function ProtectionBadge() {
  return (
    <div className="glass rounded-xl p-6 border-l-4 border-blue-500">
      <div className="flex items-center space-x-3">
        <ShieldCheck className="w-6 h-6 text-blue-500" />
        <div>
          <p className="font-semibold text-xs uppercase tracking-wider text-blue-500">
            Proteccion StreamHub
          </p>
          <p className="text-sm text-neutral-400 italic">
            Garantia de 30 dias incluida en este servicio.
          </p>
        </div>
      </div>
    </div>
  );
}
