"use client";

import { useState } from "react";
import { sileo } from "sileo";
import { CatalogTemplate } from "@/components/templates/catalog-template";
import { useSWRCatalogProducts } from "@/lib/api/hooks/use-sw-catalog";
import type { ProductWithDetails } from "@/lib/api/products";
import type { Product } from "@/components/molecules/product-card";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80";

function mapBackendProduct(product: ProductWithDetails): Product {
  return {
    id: product.id,
    name: product.name,
    description: product.description || product.platform_name || "Producto disponible",
    image: product.image_url || product.thumbnail || FALLBACK_IMAGE,
    accessType: product.product_type,
    price: new Intl.NumberFormat("es-ES", { maximumFractionDigits: 2 }).format(product.price_sale),
    priceValue: product.price_sale,
    currency: product.currency,
    brandColor: product.platform_color,
    slug: product.slug,
    platformName: product.platform_name,
    platformSlug: product.platform_slug,
    availableUnits: product.available_units,
  };
}

export default function CatalogoPage() {
  const [page] = useState(1);
  const { data: rawProducts, isLoading, error } = useSWRCatalogProducts(
    { status: "active", inventory_status: "available" },
    page,
    24
  );

  const products = rawProducts
    .filter((product) => (product.available_units ?? 0) > 0)
    .map(mapBackendProduct);

  if (error) {
    sileo.error({
      title: "Error al cargar productos",
      description: "No se pudieron cargar los productos. Intenta de nuevo.",
    });
  }

  return (
    <CatalogTemplate
      products={products}
      isLoading={isLoading}
      onRetry={() => {}}
    />
  );
}
