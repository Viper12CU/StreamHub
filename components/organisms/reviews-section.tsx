import { ReviewCard } from "@/components/molecules/review-card";
import { cn } from "@/lib/utils";
import Link from "next/link";

export interface ReviewData {
  name: string;
  initials: string;
  rating: number;
  comment: string;
}

interface ReviewsSectionProps {
  reviews: ReviewData[];
  className?: string;
}

export function ReviewsSection({ reviews, className }: ReviewsSectionProps) {
  return (
    <section className={cn("space-y-4", className)}>
      <div className="flex justify-between items-end">
        <h2 className="text-xl font-semibold">Opiniones de clientes</h2>
        <Link href="#" className="text-primary text-xs font-semibold hover:underline">
          Ver todas
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {reviews.map((review, index) => (
          <ReviewCard key={index} {...review} />
        ))}
      </div>
    </section>
  );
}
