"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/organisms/navbar";
import { Footer } from "@/components/organisms/footer";
import { PageHeader } from "@/components/molecules/page-header";
import { FiltersSection, type FiltersState } from "@/components/organisms/filters-section";
import { ProductsGrid } from "@/components/organisms/products-grid";
import { LoadMoreButton } from "@/components/molecules/load-more-button";
import type { Product } from "@/components/molecules/product-card";

interface CatalogTemplateProps {
  products: Product[];
}

function getInitialPlatform(searchParams: URLSearchParams): string {
  const platform = searchParams.get("platform");
  if (!platform) return "All";
  const map: Record<string, string> = {
    netflix: "Netflix",
    spotify: "Spotify",
    disney: "Disney",
    youtube: "YouTube",
    prime: "Prime",
    hbo: "HBO",
  };
  return map[platform.toLowerCase()] ?? "All";
}

export function CatalogTemplate({ products }: CatalogTemplateProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<FiltersState>({
    platform: getInitialPlatform(searchParams),
    accessType: "",
    sortBy: "price-asc",
  });

  const filteredProducts = products.filter((product) => {
    if (filters.platform !== "All") {
      const platformMatch = product.name.toLowerCase().includes(filters.platform.toLowerCase());
      if (!platformMatch) return false;
    }
    return true;
  });

  const handleBuy = (product: Product) => {
    const slug = encodeURIComponent(product.name.toLowerCase().replace(/\s+/g, "-"));
    router.push(`/product/${slug}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto mt-20 px-4 md:px-6 py-16 w-full">
        <PageHeader
          title="Catálogo de Servicios"
          subtitle="Elige tu plataforma y tipo de acceso."
        />

        <FiltersSection filters={filters} onFiltersChange={setFilters} />

        <ProductsGrid products={filteredProducts} onBuy={handleBuy} />

        <LoadMoreButton />
      </main>

      <Footer />
    </div>
  );
}
