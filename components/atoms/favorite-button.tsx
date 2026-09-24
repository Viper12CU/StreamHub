"use client";

import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWishlist } from "@/lib/api/hooks/use-wishlist";

interface FavoriteButtonProps {
  productId: string;
  className?: string;
  onToggle?: (isFavorite: boolean) => void;
}

export function FavoriteButton({
  productId,
  className,
  onToggle,
}: FavoriteButtonProps) {
  const { isInWishlist, toggle, isToggling } = useWishlist();
  const isFavorite = isInWishlist(productId);

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isToggling) return;
    const next = await toggle(productId);
    if (next !== null) onToggle?.(next);
  };

  return (
    <button
      onClick={handleClick}
      disabled={isToggling}
      aria-pressed={isFavorite}
      aria-label={isFavorite ? "Quitar de wishlist" : "Agregar a wishlist"}
      title={isFavorite ? "Quitar de wishlist" : "Guardar en wishlist"}
      className={cn(
        "p-2 rounded-full bg-muted/60 backdrop-blur-md text-foreground hover:text-primary transition-colors cursor-pointer",
        "disabled:opacity-60 disabled:cursor-wait",
        className
      )}
    >
      <Heart
        className={cn("w-5 h-5", isFavorite && "fill-primary text-primary")}
      />
    </button>
  );
}
