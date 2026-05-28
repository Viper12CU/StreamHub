import { OrderItemCard } from "@/components/molecules/order-item-card";
import { ProtectionBadge } from "@/components/molecules/protection-badge";
import { OrderSummary } from "@/components/molecules/order-summary-totals";

interface OrderItem {
  image: string;
  type: string;
  title: string;
  duration: string;
  originalPrice: string;
  price: string;
  mlcPrice: string;
}

interface OrderSummarySectionProps {
  item: OrderItem;
  subtotal: string;
  serviceCharge: string;
  total: string;
}

export function OrderSummarySection({
  item,
  subtotal,
  serviceCharge,
  total,
}: OrderSummarySectionProps) {
  return (
    <div className="space-y-6">
      <h2 className="font-semibold text-2xl mb-6">Resumen del pedido</h2>
      <OrderItemCard {...item} />
      <ProtectionBadge />
      <OrderSummary
        subtotal={subtotal}
        serviceCharge={serviceCharge}
        total={total}
      />
    </div>
  );
}
