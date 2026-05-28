interface OrderSummaryProps {
  subtotal: string;
  serviceCharge: string;
  total: string;
}

export function OrderSummary({ subtotal, serviceCharge, total }: OrderSummaryProps) {
  return (
    <div className="glass rounded-xl p-6 space-y-4">
      <div className="flex justify-between text-neutral-400">
        <span>Subtotal</span>
        <span>{subtotal}</span>
      </div>
      <div className="flex justify-between text-neutral-400">
        <span>Cargos por servicio</span>
        <span>{serviceCharge}</span>
      </div>
      <div className="h-px bg-white/10" />
      <div className="flex justify-between items-center pt-2">
        <span className="font-semibold text-2xl">Total</span>
        <span className="font-semibold text-2xl text-red-600">{total}</span>
      </div>
    </div>
  );
}
