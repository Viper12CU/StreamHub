"use client"

import { useState } from "react";
import { StarRating } from "@/components/atoms/star-rating";
import { DurationButton } from "@/components/atoms/duration-button";
import { FeatureItem } from "@/components/molecules/feature-item";
import { InfoBox } from "@/components/molecules/info-box";
import { Button } from "@/components/atoms/button";
import { cn } from "@/lib/utils";

export interface ProductInfoData {
  name: string;
  rating: number;
  reviewsCount: number;
  priceCUP: string;
  priceMLC: string;
  features: string[];
  durations: { label: string; value: string }[];
}

interface ProductInfoSectionProps {
  product: ProductInfoData;
  className?: string;
}

export function ProductInfoSection({ product, className }: ProductInfoSectionProps) {
  const [selectedDuration, setSelectedDuration] = useState(product.durations[0]?.value);

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
          <span className="text-xl font-semibold text-primary">{product.priceMLC}</span>
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
      <div className="space-y-4">
        <InfoBox variant="info">
          Recibiras usuario y contraseña por WhatsApp o correo tras confirmar el pago.
        </InfoBox>
        
        <Button className="w-full py-6 text-lg font-semibold rounded-xl shadow-lg shadow-primary/20">
          Comprar ahora
        </Button>

        <div className="flex justify-center items-center gap-8 py-2 opacity-60">
          <span className="text-xs font-semibold uppercase tracking-tight">Transfermovil</span>
          <span className="text-xs font-semibold uppercase tracking-tight">Zelle</span>
          <span className="text-xs font-semibold uppercase tracking-tight">MLC</span>
        </div>

        <InfoBox variant="guarantee">
          Garantia de reposicion por 30 dias si la cuenta falla.
        </InfoBox>
      </div>
    </div>
  );
}
