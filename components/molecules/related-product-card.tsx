import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

interface RelatedProductCardProps {
  name: string;
  price: string;
  imageSrc: string;
  accentColor: string;
  className?: string;
}

export function RelatedProductCard({ name, price, imageSrc, accentColor, className }: RelatedProductCardProps) {
  return (
    <div 
      className={cn(
        "glass-panel rounded-xl overflow-hidden hover:scale-[1.02] transition-transform cursor-pointer",
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
    </div>
  );
}
