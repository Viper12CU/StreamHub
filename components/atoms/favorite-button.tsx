"use client";

import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface FavoriteButtonProps {
  initialFavorite?: boolean;
  onToggle?: (isFavorite: boolean) => void;
  className?: string;
}

export function FavoriteButton({
  initialFavorite = false,
  onToggle,
  className,
}: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(initialFavorite);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newValue = !isFavorite;
    setIsFavorite(newValue);
    onToggle?.(newValue);
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "p-2 rounded-full bg-muted/60 backdrop-blur-md text-foreground hover:text-primary transition-colors cursor-pointer",
        className
      )}
    >
      <Heart
        className={cn("w-5 h-5", isFavorite && "fill-primary text-primary")}
      />
    </button>
  );
}
