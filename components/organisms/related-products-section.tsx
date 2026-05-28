import { RelatedProductCard } from "@/components/molecules/related-product-card";
import { cn } from "@/lib/utils";

export interface RelatedProductData {
  name: string;
  price: string;
  imageSrc: string;
  accentColor: string;
}

interface RelatedProductsSectionProps {
  products: RelatedProductData[];
  className?: string;
}

export function RelatedProductsSection({ products, className }: RelatedProductsSectionProps) {
  return (
    <section className={cn("space-y-4", className)}>
      <h2 className="text-xl font-semibold">Tambien te puede interesar</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product, index) => (
          <RelatedProductCard key={index} {...product} />
        ))}
      </div>
    </section>
  );
}
