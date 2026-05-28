import { ProductCard, type Product } from "@/components/molecules/product-card";

interface ProductsGridProps {
  products: Product[];
  onBuy?: (product: Product) => void;
}

export function ProductsGrid({ products, onBuy }: ProductsGridProps) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onBuy={onBuy} />
      ))}
    </section>
  );
}
