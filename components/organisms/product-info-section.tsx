"use client"

import { useState } from "react";
import { StarRating } from "@/components/atoms/star-rating";
import { DurationButton } from "@/components/atoms/duration-button";
import { FeatureItem } from "@/components/molecules/feature-item";
import { InfoBox } from "@/components/molecules/info-box";
import { PaymentOptionCard } from "@/components/molecules/payment-option-card";
import { LoginPrompt } from "@/components/molecules/login-prompt";
import { useSession } from "@/lib/session-context";
import { cn } from "@/lib/utils";

export interface ProductInfoData {
  name: string;
  rating: number;
  reviewsCount: number;
  priceCUP: string;
  priceMLC?: string;
  features: string[];
  durations: { label: string; value: string }[];
}

interface ProductInfoSectionProps {
  product: ProductInfoData;
  className?: string;
}

export function ProductInfoSection({ product, className }: ProductInfoSectionProps) {
  const [selectedDuration, setSelectedDuration] = useState(product.durations[0]?.value);
  const { isAuthenticated, isLoading } = useSession();

  return (
    <div className={cn("space-y-6", className)}>
      {/* Title and Rating */}
      <section>
        <h1 className="text-2xl md:text-3xl font-bold mb-2">{product.name}</h1>
        <div className="flex items-center gap-4 mb-4">
          <StarRating rating={product.rating} />
          <span className="text-xs text-muted-foreground">({product.reviewsCount} reviews)</span>
        </div>
        <div className="flex items-baseline gap-4">
          <span className="text-4xl font-extrabold">{product.priceCUP}</span>
          {product.priceMLC ? (
            <span className="text-xl font-semibold text-primary">{product.priceMLC}</span>
          ) : null}
        </div>
      </section>

      {/* Duration Selector */}
      <section className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Selecciona Duracion
        </p>
        <div className="flex gap-3 flex-wrap">
          {product.durations.map((duration) => (
            <DurationButton
              key={duration.value}
              label={duration.label}
              isSelected={selectedDuration === duration.value}
              onClick={() => setSelectedDuration(duration.value)}
            />
          ))}
        </div>
      </section>

      {/* Features Checklist */}
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {product.features.map((feature, index) => (
          <FeatureItem key={index} text={feature} />
        ))}
      </ul>

      {/* Purchase Action */}
      {isLoading ? (
        <div className="glass-panel space-y-5 rounded-3xl p-4 sm:p-5">
          <div className="space-y-1 text-center sm:text-left">
            <div className="mx-auto h-4 w-32 animate-pulse rounded-full skeleton-shimmer sm:mx-0" />
            <div className="mx-auto h-7 w-48 animate-pulse rounded-xl skeleton-shimmer sm:mx-0" />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="h-44 animate-pulse rounded-2xl skeleton-shimmer" />
            <div className="h-44 animate-pulse rounded-2xl skeleton-shimmer" />
          </div>
        </div>
      ) : isAuthenticated ? (
        <section className="glass-panel space-y-5 rounded-3xl p-4 sm:p-5">
          <div className="space-y-1 text-center sm:text-left">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Metodo de pago</p>
            <h2 className="text-2xl font-black leading-tight text-foreground">Elige como comprar</h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <PaymentOptionCard name="Enzona" logoFallback="EZ" highlighted aria-label="Comprar ahora con Enzona" />
            <PaymentOptionCard name="QvaPay" logoFallback="QP" aria-label="Comprar ahora con QvaPay" />
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <InfoBox variant="info" className="rounded-2xl border-white/10 bg-white/[0.04] text-muted-foreground backdrop-blur-sm">
              Recibiras usuario y contraseña por WhatsApp o correo tras confirmar el pago.
            </InfoBox>
            <InfoBox variant="guarantee" className="rounded-2xl border-primary/15 bg-primary/[0.08] text-primary">
              Garantia de reposicion por 30 dias si la cuenta falla.
            </InfoBox>
          </div>
        </section>
      ) : (
        <LoginPrompt />
      )}
    </div>
  );
}
