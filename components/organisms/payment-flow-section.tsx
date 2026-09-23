"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/atoms/icon";
import { useSWRAccountCreditBalance } from "@/lib/api/hooks/use-sw-account";
import { sileo } from "sileo";

interface PaymentFlowSectionProps {
  creditCost: number;
  priceLabel: string;
  onConfirm: () => void;
}

export function PaymentFlowSection({ creditCost, priceLabel, onConfirm }: PaymentFlowSectionProps) {
  const [isConfirming, setIsConfirming] = useState(false);
  const { data: balance, isLoading: balanceLoading } = useSWRAccountCreditBalance();

  const balanceAmount = balance?.balance ?? 0;
  const hasEnoughCredits = !balanceLoading && balance !== null && balanceAmount >= creditCost;

  function handleConfirm() {
    if (isConfirming) return;

    if (balance === null || !hasEnoughCredits) {
      sileo.error({
        title: "Creditos insuficientes",
        description: "Recarga creditos para poder completar esta compra.",
      });
      return;
    }

    setIsConfirming(true);
    // Simulacion de compra con creditos: pendiente de POST /credits/purchase
    setTimeout(() => {
      setIsConfirming(false);
      sileo.success({
        title: "Compra con creditos confirmada",
        description: `Se descontarian ${creditCost} creditos. Pendiente de integracion con el backend.`,
      });
      onConfirm();
    }, 600);
  }

  return (
    <div className="glass rounded-xl p-8">
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary mb-2">
          Pago con creditos
        </p>
        <h2 className="font-semibold text-2xl">Confirmar compra</h2>
      </div>

      <div className="space-y-8">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 space-y-1">
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Costo</p>
            <p className="text-xl font-extrabold text-foreground">
              {creditCost} <span className="text-sm font-semibold text-primary">creditos</span>
            </p>
            <p className="text-xs text-muted-foreground">{priceLabel}</p>
          </div>
          <div className="rounded-2xl border border-green-500/20 bg-green-500/[0.06] p-5 space-y-1">
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

        {!balanceLoading && (balance === null || !hasEnoughCredits) && (
          <p className="text-sm font-semibold text-red-500">
            No tienes creditos suficientes para esta compra.
          </p>
        )}

        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 space-y-2 text-sm text-neutral-400">
          <p>
            Recibiras usuario y contraseña por WhatsApp o correo al confirmar el pago con
            creditos.
          </p>
          <p>Garantia de reposicion por 30 dias si la cuenta falla.</p>
        </div>

        <button
          onClick={handleConfirm}
          disabled={isConfirming || balanceLoading || balance === null || !hasEnoughCredits}
          className="w-full bg-red-600 text-white py-4 rounded-xl font-semibold text-lg hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isConfirming
            ? "Confirmando..."
            : balanceLoading
              ? "Cargando saldo..."
              : balance === null || !hasEnoughCredits
                ? "Creditos insuficientes"
                : `Pagar con ${creditCost} creditos`}
        </button>
      </div>
    </div>
  );
}
