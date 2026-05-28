import { Star, StarHalf } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  showValue?: boolean;
  className?: string;
}

export function StarRating({ rating, maxRating = 5, showValue = true, className }: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex text-primary">
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star key={`full-${i}`} className="w-4 h-4 fill-current" />
        ))}
        {hasHalfStar && <StarHalf className="w-4 h-4 fill-current" />}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star key={`empty-${i}`} className="w-4 h-4" />
        ))}
      </div>
      {showValue && (
        <span className="text-xs font-medium text-foreground ml-1">{rating}/{maxRating}</span>
      )}
    </div>
  );
}
