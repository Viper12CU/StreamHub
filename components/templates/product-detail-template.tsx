import { Navbar } from "@/components/organisms/navbar";
import { Footer } from "@/components/organisms/footer";
import { BreadcrumbNav, type BreadcrumbItem } from "@/components/molecules/breadcrumb-nav";
import { ProductMediaSection } from "@/components/organisms/product-media-section";
import { ProductInfoSection, type ProductInfoData } from "@/components/organisms/product-info-section";
import { FaqSection, type FaqData } from "@/components/organisms/faq-section";
import { ReviewsSection, type ReviewData } from "@/components/organisms/reviews-section";
import { RelatedProductsSection, type RelatedProductData } from "@/components/organisms/related-products-section";

interface ProductDetailTemplateProps {
  breadcrumbs: BreadcrumbItem[];
  product: {
    imageSrc: string;
    imageAlt: string;
    accessType: string;
    status: "available" | "limited" | "soldout";
    info: ProductInfoData;
  };
  faqs: FaqData[];
  reviews: ReviewData[];
  relatedProducts: RelatedProductData[];
}

export function ProductDetailTemplate({
  breadcrumbs,
  product,
  faqs,
  reviews,
  relatedProducts,
}: ProductDetailTemplateProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <main className="pt-28 pb-16 px-4 md:px-10 max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-8">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        {/* Product Detail Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Column: Media & Badges */}
          <div className="md:col-span-5">
            <ProductMediaSection
              imageSrc={product.imageSrc}
              imageAlt={product.imageAlt}
              accessType={product.accessType}
              status={product.status}
            />
          </div>

          {/* Right Column: Product Info & Purchase */}
          <div className="md:col-span-7">
            <ProductInfoSection product={product.info} />
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <FaqSection faqs={faqs} />
        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          <ReviewsSection reviews={reviews} />
        </div>

        {/* Related Products Section */}
        <div className="mt-16">
          <RelatedProductsSection products={relatedProducts} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
