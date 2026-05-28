"use client";

import { useState } from "react";
import { Navbar } from "@/components/organisms/navbar";
import { Footer } from "@/components/organisms/footer";
import { BreadcrumbNav } from "@/components/molecules/breadcrumb-nav";
import { OrderSummarySection } from "@/components/organisms/order-summary-section";
import { PaymentFlowSection } from "@/components/organisms/payment-flow-section";
import { ConfirmationModal } from "@/components/organisms/confirmation-modal";

interface OrderItem {
  image: string;
  type: string;
  title: string;
  duration: string;
  originalPrice: string;
  price: string;
  mlcPrice: string;
}

interface CheckoutTemplateProps {
  orderItem: OrderItem;
  subtotal: string;
  serviceCharge: string;
  total: string;
}

export function CheckoutTemplate({
  orderItem,
  subtotal,
  serviceCharge,
  total,
}: CheckoutTemplateProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const breadcrumbs = [
    { label: "Inicio", href: "/" },
    { label: "Catalogo", href: "/catalogo" },
    { label: "Checkout" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-32 pb-16 px-6 max-w-7xl mx-auto">
        <BreadcrumbNav items={breadcrumbs} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-10">
          {/* Left Column: Order Summary */}
          <div className="lg:col-span-5">
            <OrderSummarySection
              item={orderItem}
              subtotal={subtotal}
              serviceCharge={serviceCharge}
              total={total}
            />
          </div>

          {/* Right Column: Payment Flow */}
          <div className="lg:col-span-7">
            <PaymentFlowSection onConfirm={() => setShowConfirmation(true)} />
          </div>
        </div>
      </main>

      <Footer />

      <ConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        reference="#SH-8293"
      />
    </div>
  );
}
