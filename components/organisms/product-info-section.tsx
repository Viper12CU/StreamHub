"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { InfoBox } from "@/components/molecules/info-box"
import { LoginPrompt } from "@/components/molecules/login-prompt"
import { Button } from "@/components/atoms/button"
import { Icon } from "@/components/atoms/icon"
import { FavoriteButton } from "@/components/atoms/favorite-button"
import { useSession } from "@/lib/session-context"
import { useSWRAccountCreditBalance } from "@/lib/api/hooks/use-sw-account"
import { cn } from "@/lib/utils"
import { sileo } from "sileo"

export interface ProductInfoData {
  productId: string
  slug: string
  name: string
  rating: number
  reviewsCount: number
  priceCUP: string
  priceValue: number
  currency: string
  priceUSD?: number
  priceMLC?: string
  description: string
  availableUnits: number
  soldUnits: number
  stockInitial: number
  lowStockThreshold: number
}

interface ProductInfoSectionProps {
  product: ProductInfoData
  className?: string
}

export function ProductInfoSection({ product, className }: ProductInfoSectionProps) {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useSession()
  const { data: balance, isLoading: balanceLoading } = useSWRAccountCreditBalance()

  const isSoldOut = product.availableUnits <= 0
  const creditCost = product.priceValue
  const balanceAmount = balance?.balance ?? 0
  const hasEnoughCredits = !balanceLoading && balance !== null && balanceAmount >= creditCost

  function handlePurchaseWithCredits() {
    if (isSoldOut) return

    if (balance === null || !hasEnoughCredits) {
      sileo.error({
        title: "Creditos insuficientes",
        description: "Recarga creditos para poder completar esta compra.",
      })
      return
    }

    router.push(`/web/checkout?slug=${encodeURIComponent(product.slug)}`)
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Title and Rating */}
      <section>
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{product.name}</h1>
          <FavoriteButton productId={product.productId} className="shrink-0 mt-1" />
        </div>
        {/* <div className="flex items-center gap-4 mb-4">
          <StarRating rating={product.rating} />
          <span className="text-xs text-muted-foreground">({product.reviewsCount} reviews)</span>
        </div> */}
        <div className="flex items-baseline gap-3 flex-wrap m-[1.5rem]">
          <span className="text-4xl font-extrabold">{product.priceCUP}</span>
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
            {product.availableUnits <= 0 ? (
              <>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
                Agotado por ahora
              </>
            ) : product.availableUnits <= product.lowStockThreshold ? (
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
          <div className="space-y-3">
            <div className="h-20 animate-pulse rounded-2xl skeleton-shimmer" />
            <div className="h-14 animate-pulse rounded-xl skeleton-shimmer" />
            <div className="h-14 animate-pulse rounded-xl skeleton-shimmer" />
          </div>
        </div>
      ) : isAuthenticated ? (
        <section className="glass-panel space-y-5 rounded-3xl p-4 sm:p-5">
          <div className="space-y-1 text-center sm:text-left">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Pago con creditos</p>
            <h2 className="text-2xl font-black leading-tight text-foreground">Comprar con creditos</h2>
          </div>

          {/* Balance + cost */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4 space-y-1">
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Costo</p>
              <p className="text-xl font-extrabold text-foreground">
                {creditCost} <span className="text-sm font-semibold text-primary">creditos</span>
              </p>
              <p className="text-xs text-muted-foreground">{product.priceCUP}</p>
            </div>
            <div className="rounded-2xl border border-green-500/20 bg-green-500/[0.06] p-4 space-y-1">
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Tu saldo</p>
              {balanceLoading ? (
                <div className="h-7 w-24 animate-pulse rounded-lg skeleton-shimmer" />
              ) : balance !== null ? (
                <p className="text-xl font-extrabold text-green-400">
                  {balanceAmount.toFixed(2)} <span className="text-sm font-semibold">USD</span>
                </p>
              ) : (
                <p className="text-xl font-extrabold text-muted-foreground">—</p>
              )}
              <Link
                href="/web/account/credits"
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
              >
                <Icon name="cash-multiple" className="text-[14px]" />
                Recargar creditos
              </Link>
            </div>
          </div>

          {/* CTA */}
          <Button
            onClick={handlePurchaseWithCredits}
            disabled={
              isSoldOut ||
              balanceLoading ||
              balance === null ||
              !hasEnoughCredits
            }
            className="w-full py-4 text-base font-bold"
          >
            {isSoldOut ? (
              <>
                <Icon name="cart-off" className="text-[18px]" />
                Agotado
              </>
            ) : balanceLoading ? (
              <>
                <Icon name="cash-multiple" className="text-[18px]" />
                Comprar con {creditCost} creditos
              </>
            ) : balance === null || !hasEnoughCredits ? (
              <>
                <Icon name="alert-circle" className="text-[18px]" />
                Creditos insuficientes
              </>
            ) : (
              <>
                <Icon name="cash-multiple" className="text-[18px]" />
                Comprar con {creditCost} creditos
              </>
            )}
          </Button>

          {!balanceLoading && (balance === null || !hasEnoughCredits) && (
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => router.push("/web/account/credits")}
            >
              <Icon name="plus-circle" className="text-[18px]" />
              Recargar creditos
            </Button>
          )}

          <div className="grid gap-3 md:grid-cols-2">
            <InfoBox variant="info">
              Recibiras usuario y contraseña por WhatsApp o correo tras confirmar el pago con creditos.
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
  )
}
