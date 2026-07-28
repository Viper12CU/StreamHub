"use client";

import { cn } from "@/lib/utils";
import { FavoriteButton } from "@/components/atoms/favorite-button";
import { AccessTypeTag } from "@/components/atoms/access-type-tag";

type AccessType =
  | "profile"
  | "account"
  | "code"
  | "invitation"
  | "full_account"
  | "shared_profile"
  | "activation_code"
  | "subscription_package";

export interface Product {
  id: string;
  name: string;
  image: string;
  accessType: AccessType;
  price?: string;
  priceValue?: number;
  currency?: string;
  brandColor?: string;
  slug?: string;
  platformName?: string;
  platformSlug?: string;
  description?: string;
  availableUnits?: number;
}

interface ProductCardProps {
  product: Product;
  onBuy?: (product: Product) => void;
  className?: string;
}

export function ProductCard({ product, onBuy, className }: ProductCardProps) {
  const brandColor = product.brandColor || "#E50914";
  const priceLabel = product.price
    ? `${product.price}${product.currency ? ` ${product.currency}` : ""}`
    : "Consultar precio";

  return (
    <article
      className={cn(
        "glass-panel rounded-xl overflow-hidden flex flex-col transition-all duration-300 group border-t-2",
        "hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(229,9,20,0.15)]",
        className
      )}
      style={{ borderTopColor: brandColor }}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

        <FavoriteButton className="absolute top-4 right-4" />

        <div className="absolute bottom-4 left-4">
          <AccessTypeTag type={product.accessType} />
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="min-w-0 mb-4">
          {product.platformName && (
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground mb-2">
              {product.platformName}
            </p>
          )}
          <h3 className="text-xl font-semibold leading-tight">{product.name}</h3>
          {product.description && (
            <p className="mt-3 text-sm text-muted-foreground line-clamp-3">
              {product.description}
            </p>
          )}
          <p className="mt-3 text-xl font-semibold text-primary">{priceLabel}</p>
        </div>

        <div className="space-y-4 mt-auto">
          

          <button
            onClick={() => onBuy?.(product)}
            className={cn(
              "w-full py-4 rounded-lg font-bold transition-all bg-primary text-primary-foreground hover:opacity-90"
            )}
          >
            Comprar ahora
          </button>
        </div>
      </div>
    </article>
  );
}
