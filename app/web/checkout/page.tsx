import { redirect } from "next/navigation";
import { CheckoutTemplate, type CheckoutOrderItem } from "@/components/templates/checkout-template";
import { getProductBySlug, type ProductWithDetails } from "@/lib/api/products";

export const metadata = {
  title: "Checkout | StreamHub Cuba",
  description: "Completa tu compra en StreamHub Cuba",
};

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80";

const PRODUCT_TYPE_LABELS: Record<ProductWithDetails["product_type"], string> = {
  full_account: "Cuenta completa",
  shared_profile: "Perfil compartido",
  activation_code: "Código de activación",
  subscription_package: "Paquete de suscripción",
};

function formatPriceLabel(product: ProductWithDetails) {
  const price = new Intl.NumberFormat("es-ES", {
    minimumFractionDigits: Number.isInteger(product.price_sale) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(product.price_sale);

  return `$${price} ${product.currency}`;
}

function mapProductToCheckoutItem(product: ProductWithDetails): CheckoutOrderItem {
  return {
    id: product.id,
    slug: product.slug,
    image: product.image_url || product.thumbnail || FALLBACK_IMAGE,
    type: PRODUCT_TYPE_LABELS[product.product_type],
    title: `${product.name}${product.platform_name ? ` — ${product.platform_name}` : ""}`,
    duration: "Acceso inmediato",
    price: formatPriceLabel(product),
  };
}

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ slug?: string }>;
}) {
  const { slug } = await searchParams;

  if (!slug) {
    redirect("/web/catalog");
  }

  const product = await getProductBySlug(slug);

  if (!product) {
    redirect("/web/catalog");
  }

  if (product.available_units <= 0) {
    redirect(`/web/product/${product.slug}`);
  }

  const orderItem = mapProductToCheckoutItem(product);
  const priceLabel = orderItem.price;

  return (
    <CheckoutTemplate
      orderItem={orderItem}
      subtotal={priceLabel}
      serviceCharge="$0.00"
      total={priceLabel}
      creditCost={product.price_sale}
    />
  );
}
