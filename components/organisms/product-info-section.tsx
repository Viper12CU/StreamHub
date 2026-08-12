"use client"

import { StarRating } from "@/components/atoms/star-rating";
import { InfoBox } from "@/components/molecules/info-box";
import { PaymentOptionCard } from "@/components/molecules/payment-option-card";
import { LoginPrompt } from "@/components/molecules/login-prompt";
import { useSession } from "@/lib/session-context";
import { useState } from "react";
import { Icon } from "@/components/atoms/icon";
import { cn } from "@/lib/utils";

export interface ProductInfoData {
  name: string;
  rating: number;
  reviewsCount: number;
  priceCUP: string;
  priceUSD?: number;
  priceMLC?: string;
  exchangeRate: number;
  description: string;
  availableUnits: number;
  soldUnits: number;
  stockInitial: number;
  lowStockThreshold: number;
}

function PriceTooltip({ exchangeRate }: { exchangeRate: number }) {
  const [show, setShow] = useState(false);
  const date = new Date();
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
  const now = date.toLocaleDateString('es-ES', options);


  return (
    <span
      className="relative inline-flex items-center"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <Icon name="information" size="sm" className="cursor-help text-muted-foreground hover:text-foreground" />
      {show && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-3 py-2 glass-panel rounded-lg text-xs text-muted-foreground whitespace-nowrap shadow-lg z-10">
          Conversión directa para hoy {now} desde <a href="https://eltoque.com/tasas-de-cambio-cuba" target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline">elTOQUE</a> (USD × {exchangeRate})
          <span className="absolute -top-2 left-0 w-full h-2" />
        </div>
      )}
    </span>
  );
}

interface ProductInfoSectionProps {
  product: ProductInfoData;
  className?: string;
}

export function ProductInfoSection({ product, className }: ProductInfoSectionProps) {
  const { isAuthenticated, isLoading } = useSession();

  return (
    <div className={cn("space-y-6", className)}>
      {/* Title and Rating */}
      <section>
        <h1 className="text-2xl md:text-3xl font-bold mb-2">{product.name}</h1>
        {/* <div className="flex items-center gap-4 mb-4">
          <StarRating rating={product.rating} />
          <span className="text-xs text-muted-foreground">({product.reviewsCount} reviews)</span>
        </div> */}
        <div className="flex items-baseline gap-3 flex-wrap m-[1.5rem]">
          <span className="text-4xl font-extrabold">{product.priceCUP}</span>
          {product.priceUSD && (
            <span className="text-lg font-medium text-muted-foreground flex items-center gap-1">
              ≈ ${(product.priceUSD * product.exchangeRate).toLocaleString("es-ES")} CUP
              <PriceTooltip exchangeRate={product.exchangeRate} />
            </span>
          )}
          {product.priceMLC ? (
            <span className="text-xl font-semibold text-primary">{product.priceMLC}</span>
          ) : null}
        </div>
      </section>

      {/* Stock Urgency + Social Proof */}
      <div className="glass-panel rounded-2xl p-4 space-y-3">
        <div className="flex items-center gap-2">
          <span className={cn(
            "flex items-center gap-2 text-sm font-semibold",
            product.availableUnits <= product.lowStockThreshold ? "text-amber-400" : "text-foreground"
          )}>
            {product.availableUnits <= product.lowStockThreshold ? (
              <>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                Solo {product.availableUnits} unidades disponibles
              </>
            ) : (
              <>
                <svg className="w-4 h-4 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                Disponible
              </>
            )}
          </span>
        </div>

        {/* Progress bar */}
        <div className="space-y-1">
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                product.availableUnits <= product.lowStockThreshold ? "bg-amber-500" : "bg-primary"
              )}
              style={{ width: `${Math.min((product.soldUnits / product.stockInitial) * 100, 100)}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground text-right">{product.soldUnits} vendidos</p>
        </div>

        {/* Social proof */}
        {product.soldUnits > 0 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            <span>{product.soldUnits} personas ya compraron esto</span>
          </div>
        )}
      </div>

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
            <InfoBox variant="info">
              Recibiras usuario y contraseña por WhatsApp o correo tras confirmar el pago.
            </InfoBox>
            <InfoBox variant="guarantee">
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
