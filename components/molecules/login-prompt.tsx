"use client";

import { useRouter } from "next/navigation";
import { useSession } from "@/lib/session-context";
import { Button } from "@/components/atoms/button";
import { Icon } from "@/components/atoms/icon";

export function LoginPrompt() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useSession();

  if (isLoading) {
    return (
      <div className="glass-panel space-y-4 rounded-3xl p-6 text-center">
        <div className="mx-auto h-6 w-48 animate-pulse rounded-full skeleton-shimmer" />
        <div className="mx-auto h-10 w-32 animate-pulse rounded-xl skeleton-shimmer" />
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <section className="glass-panel space-y-5 rounded-3xl p-6 text-center sm:p-8">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/25 bg-primary/10 text-primary">
        <Icon name="account_circle" className="text-3xl" />
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-black leading-tight text-foreground">
          Inicia sesión para continuar
        </h2>
        <p className="mx-auto max-w-sm text-sm text-muted-foreground">
          Necesitas estar registrado para poder realizar una compra. Es rápido y seguro.
        </p>
      </div>

      <Button
        onClick={() => router.push("/web/login")}
        className="px-8 py-3 text-sm font-bold"
      >
        Iniciar sesión
      </Button>
    </section>
  );
}