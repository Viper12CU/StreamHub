import { Suspense } from "react";
import { CatalogTemplate } from "@/components/templates/catalog-template";
import { products } from "@/components/data/products";

export default function CatalogoPage() {
  return (
    <Suspense>
      <CatalogTemplate products={products} />
    </Suspense>
  );
}
