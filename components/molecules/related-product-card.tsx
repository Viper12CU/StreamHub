import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

interface RelatedProductCardProps {
  name: string;
  price: string;
  imageSrc: string;
  accentColor: string;
  slug: string;
  className?: string;
}

export function RelatedProductCard({ name, price, imageSrc, accentColor, slug, className }: RelatedProductCardProps) {
  return (
    <Link
      href={`/web/product/${slug}`}
      className={cn(
        "glass-panel rounded-xl overflow-hidden hover:scale-[1.02] transition-transform cursor-pointer flex-shrink-0 w-[200px] md:w-[240px]",
        className
      )}
      style={{ borderTop: `2px solid ${accentColor}` }}
    >
      <div className="aspect-video relative">
        <Image
          src={imageSrc}
          alt={name}
          fill
          className="object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute bottom-2 left-2 font-bold text-foreground">{name}</div>
      </div>
      <div className="p-2 flex justify-between items-center">
        <span className="text-primary font-bold text-sm">{price}</span>
        <ShoppingCart className="w-4 h-4" />
      </div>
    </Link>
  );
}
