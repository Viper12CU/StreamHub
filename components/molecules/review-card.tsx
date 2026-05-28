import { StarRating } from "@/components/atoms/star-rating";
import { cn } from "@/lib/utils";

interface ReviewCardProps {
  name: string;
  initials: string;
  rating: number;
  comment: string;
  className?: string;
}

export function ReviewCard({ name, initials, rating, comment, className }: ReviewCardProps) {
  return (
    <div className={cn("glass-panel p-4 rounded-xl space-y-3", className)}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-card flex items-center justify-center text-primary font-bold">
          {initials}
        </div>
        <div>
          <p className="text-xs font-semibold">{name}</p>
          <StarRating rating={rating} showValue={false} />
        </div>
      </div>
      <p className="text-muted-foreground text-sm">&quot;{comment}&quot;</p>
    </div>
  );
}
