"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/organisms/navbar";
import { Footer } from "@/components/organisms/footer";
import { BreadcrumbNav } from "@/components/molecules/breadcrumb-nav";
import { OrderSummarySection } from "@/components/organisms/order-summary-section";
import { PaymentFlowSection } from "@/components/organisms/payment-flow-section";
import { ConfirmationModal } from "@/components/organisms/confirmation-modal";
import { useSession } from "@/lib/session-context";

export interface CheckoutOrderItem {
  id: string;
  slug: string;
  image: string;
  type: string;
  title: string;
  duration: string;
  price: string;
  originalPrice?: string;
  mlcPrice?: string;
}

interface CheckoutTemplateProps {
  orderItem: CheckoutOrderItem;
  subtotal: string;
  serviceCharge: string;
  total: string;
  creditCost: number;
}

export function CheckoutTemplate({
  orderItem,
  subtotal,
  serviceCharge,
  total,
  creditCost,
}: CheckoutTemplateProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useSession();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [reference, setReference] = useState("");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/web/login");
    }
  }, [isLoading, isAuthenticated, router]);

  const breadcrumbs = [
    { label: "Inicio", href: "/web" },
    { label: "Catalogo", href: "/web/catalog" },
    { label: orderItem.title, href: `/web/product/${orderItem.slug}` },
    { label: "Checkout" },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-32 pb-16 px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-10">
            <div className="lg:col-span-5 space-y-6">
              <div className="h-8 w-56 animate-pulse rounded-lg skeleton-shimmer" />
              <div className="h-44 animate-pulse rounded-xl skeleton-shimmer" />
              <div className="h-32 animate-pulse rounded-xl skeleton-shimmer" />
            </div>
            <div className="lg:col-span-7">
              <div className="h-[400px] animate-pulse rounded-xl skeleton-shimmer" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

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

          {/* Right Column: Credits Payment */}
          <div className="lg:col-span-7">
            <PaymentFlowSection
              productId={orderItem.id}
              creditCost={creditCost}
              priceLabel={subtotal}
              onConfirm={(orderNumber) => {
                setReference(orderNumber);
                setShowConfirmation(true);
              }}
            />
          </div>
        </div>
      </main>

      <Footer />

      <ConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        reference={reference}
        onViewOrders={() => router.push("/web/account/purchases")}
        onContinueShopping={() => {
          setShowConfirmation(false);
          router.push("/web/catalog");
        }}
      />
    </div>
  );
}
