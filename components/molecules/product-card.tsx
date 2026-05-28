"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { FavoriteButton } from "@/components/atoms/favorite-button";
import { AccessTypeTag } from "@/components/atoms/access-type-tag";
import { StatusBadge } from "@/components/atoms/status-badge";

type AccessType = "profile" | "account" | "code" | "invitation";
type StatusType = "available" | "limited" | "soldout";

export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  accessType: AccessType;
  status: StatusType;
  duration: string;
  priceCUP: string;
  priceMLC: string;
  brandColor: string;
}

interface ProductCardProps {
  product: Product;
  onBuy?: (product: Product) => void;
  className?: string;
}

export function ProductCard({ product, onBuy, className }: ProductCardProps) {
  const isSoldOut = product.status === "soldout";

  return (
    <article
      className={cn(
        "glass-panel rounded-xl overflow-hidden flex flex-col transition-all duration-300 group border-t-2",
        !isSoldOut && "hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(229,9,20,0.15)]",
        isSoldOut && "opacity-75",
        className
      )}
      style={{ borderTopColor: product.brandColor }}
    >
      {/* Image Section */}
      <div className={cn("relative h-48 overflow-hidden", isSoldOut && "grayscale")}>
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        
        {!isSoldOut && (
          <FavoriteButton className="absolute top-4 right-4" />
        )}
        
        <div className="absolute bottom-4 left-4">
          <AccessTypeTag type={product.accessType} />
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold">{product.name}</h3>
          <StatusBadge status={product.status} />
        </div>

        <p className="text-sm text-muted-foreground mb-4 flex-grow">
          {product.description}
        </p>

        <div className="space-y-4">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-muted-foreground">
              Duración: {product.duration}
            </span>
            <span className={cn(
              "text-xl font-semibold",
              isSoldOut ? "text-muted-foreground" : "text-primary"
            )}>
              {product.priceCUP}{" "}
              <span className="text-sm text-muted-foreground">/ {product.priceMLC}</span>
            </span>
          </div>

          <button
            onClick={() => !isSoldOut && onBuy?.(product)}
            disabled={isSoldOut}
            className={cn(
              "w-full py-4 rounded-lg font-bold transition-all",
              isSoldOut
                ? "bg-muted text-muted-foreground cursor-not-allowed"
                : "bg-primary text-primary-foreground hover:opacity-90"
            )}
          >
            {isSoldOut ? "Agotado" : "Comprar ahora"}
          </button>
        </div>
      </div>
    </article>
  );
}
