"use client";

import { useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/organisms/navbar";
import { Footer } from "@/components/organisms/footer";
import { PageHeader } from "@/components/molecules/page-header";
import { FiltersSection, type FiltersState } from "@/components/organisms/filters-section";
import { ProductsGrid } from "@/components/organisms/products-grid";
import { LoadMoreButton } from "@/components/molecules/load-more-button";
import { Skeleton } from "@/components/ui/skeleton";
import { Icon } from "@/components/atoms/icon";
import type { FilterChipOption } from "@/components/molecules/filter-chips";
import type { Product } from "@/components/molecules/product-card";

interface CatalogTemplateProps {
  products: Product[];
  isLoading?: boolean;
  onRetry?: () => void;
}

function getInitialPlatform(searchParams: URLSearchParams): string {
  return searchParams.get("platform")?.toLowerCase() || "all";
}

export function CatalogTemplate({ products, isLoading = false, onRetry }: CatalogTemplateProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<FiltersState>({
    search: searchParams.get("search") || "",
    platform: getInitialPlatform(searchParams),
    accessType: "",
    sortBy: "price-asc",
  });

  const platformOptions = useMemo<FilterChipOption[]>(() => {
    const uniquePlatforms = new Map<string, string>();

    products.forEach((product) => {
      const platformSlug = (product.platformSlug || product.platformName || "").toLowerCase().trim();
      const platformLabel = product.platformName?.trim();

      if (!platformSlug || !platformLabel) return;
      if (!uniquePlatforms.has(platformSlug)) {
        uniquePlatforms.set(platformSlug, platformLabel);
      }
    });

    return [
      { value: "all", label: "Todas" },
      ...Array.from(uniquePlatforms.entries())
        .sort((a, b) => a[1].localeCompare(b[1], "es"))
        .map(([value, label]) => ({ value, label })),
    ];
  }, [products]);

  const filteredProducts = products.filter((product) => {
    if ((product.availableUnits ?? 0) <= 0) {
      return false;
    }

    if (filters.search.trim()) {
      const searchTerm = filters.search.trim().toLowerCase();
      const haystack = [product.name, product.platformName, product.description]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      if (!haystack.includes(searchTerm)) {
        return false;
      }
    }

    if (filters.platform !== "all") {
      const platformSlug = (product.platformSlug || product.platformName || "").toLowerCase();
      if (platformSlug !== filters.platform) return false;
    }
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((firstProduct, secondProduct) => {
    const firstPrice = firstProduct.priceValue ?? 0;
    const secondPrice = secondProduct.priceValue ?? 0;

    if (filters.sortBy === "price-desc") {
      return secondPrice - firstPrice;
    }

    return firstPrice - secondPrice;
  });

  const handleBuy = (product: Product) => {
    const slug = product.slug || encodeURIComponent(product.name.toLowerCase().replace(/\s+/g, "-"));
    router.push(`/web/product/${slug}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto mt-20 px-4 md:px-6 py-16 w-full">
        <PageHeader
          title="Catálogo de Servicios"
          subtitle="Elige tu plataforma y tipo de acceso."
        />

        <FiltersSection filters={filters} onFiltersChange={setFilters} platformOptions={platformOptions} />

        {isLoading ? (
          <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="glass-panel rounded-xl overflow-hidden">
                <Skeleton className="h-48 w-full rounded-none" />
                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-2/3" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-12 w-full rounded-lg" />
                </div>
              </div>
            ))}
          </section>
        ) : sortedProducts.length > 0 ? (
          <>
            <ProductsGrid products={sortedProducts} onBuy={handleBuy} />
            <LoadMoreButton />
          </>
        ) : (
          <div className="glass-panel rounded-2xl border border-white/10 p-8 text-center text-sm text-muted-foreground flex flex-col items-center gap-4">
            <p>No hay productos disponibles con estos filtros.</p>
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-foreground transition-colors hover:bg-white/10"
              >
                <Icon name="refresh" size="sm" />
                Reintentar
              </button>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
