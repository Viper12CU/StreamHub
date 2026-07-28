"use client";

import { useCallback, useEffect, useState } from "react";
import { sileo } from "sileo";
import { CatalogTemplate } from "@/components/templates/catalog-template";
import { getProducts, type ProductWithDetails } from "@/lib/api/products";
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
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = useCallback(async () => {
    setLoading(true);

    try {
      const response = await getProducts(
        { status: "active", inventory_status: "available" },
        1,
        24,
        AbortSignal.timeout(10_000)
      );

      setProducts(
        response.data
          .filter((product) => (product.available_units ?? 0) > 0)
          .map(mapBackendProduct)
      );
    } catch (fetchError) {
      sileo.error({
        title: "Error al cargar productos",
        description:
          fetchError instanceof Error
            ? fetchError.message
            : "No se pudieron cargar los productos. Intenta de nuevo.",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return (
    <CatalogTemplate products={products} isLoading={loading} onRetry={loadProducts} />
  );
}
