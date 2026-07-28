import { RelatedProductCard } from "@/components/molecules/related-product-card";
import { cn } from "@/lib/utils";

export interface RelatedProductData {
  name: string;
  price: string;
  imageSrc: string;
  accentColor: string;
  slug: string;
}

interface RelatedProductsSectionProps {
  products: RelatedProductData[];
  className?: string;
}

export function RelatedProductsSection({ products, className }: RelatedProductsSectionProps) {
  return (
    <section className={cn("space-y-4", className)}>
      <h2 className="text-xl font-semibold">Tambien te puede interesar</h2>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {products.map((product) => (
          <RelatedProductCard key={product.slug} {...product} />
        ))}
      </div>
    </section>
  );
}
