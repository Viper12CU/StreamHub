import { CopyButton } from "@/components/atoms/copy-button";

interface PaymentDetailsProps {
  phone: string;
  amount: string;
  reference: string;
}

export function PaymentDetails({ phone, amount, reference }: PaymentDetailsProps) {
  return (
    <div className="bg-neutral-900/50 rounded-xl p-6 border border-white/5 space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-neutral-400 font-semibold text-xs uppercase tracking-wider">
          Enviar a
        </span>
        <span className="text-white font-bold text-lg">{phone}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-neutral-400 font-semibold text-xs uppercase tracking-wider">
          Monto Exacto
        </span>
        <span className="text-red-600 font-bold text-lg">{amount}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-neutral-400 font-semibold text-xs uppercase tracking-wider">
          Referencia de Pago
        </span>
        <div className="flex items-center space-x-2">
          <span className="text-white font-bold text-lg">{reference}</span>
          <CopyButton textToCopy={reference} />
        </div>
      </div>
    </div>
  );
}
