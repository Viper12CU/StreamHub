import { notFound } from "next/navigation";
import { ProductDetailTemplate } from "@/components/templates/product-detail-template";
import { getProductBySlug, getProducts, type ProductWithDetails } from "@/lib/api/products";
import { getUsdCupRate } from "@/lib/api/exchange-rate";

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

function getProductStatus(product: ProductWithDetails): "available" | "limited" | "soldout" {
  if (product.available_units <= 0) {
    return "soldout";
  }

  if (product.available_units <= product.low_stock_threshold) {
    return "limited";
  }

  return "available";
}

function mapProductToPageData(product: ProductWithDetails, exchangeRate: number | null) {
  return {
    imageSrc: product.image_url || product.thumbnail || FALLBACK_IMAGE,
    imageAlt: product.name,
    accessType: PRODUCT_TYPE_LABELS[product.product_type],
    status: getProductStatus(product),
    info: {
      name: `${product.name}${product.platform_name ? ` — ${product.platform_name}` : ""}`,
      rating: 4.9,
      reviewsCount: product.total_orders || 0,
      priceCUP: formatPriceLabel(product),
      priceUSD: product.currency === "USD" ? product.price_sale : undefined,
      priceMLC: undefined,
      exchangeRate: exchangeRate ?? 600,
      description: product.description || "Producto disponible en el catálogo",
      availableUnits: product.available_units,
      soldUnits: product.sold_units,
      stockInitial: product.stock_initial,
      lowStockThreshold: product.low_stock_threshold,
    },
  };
}

const faqs = [
  {
    question: "¿Como recibo mi compra?",
    answer: "Una vez confirmado tu pago a traves de Transfermovil, Enzona o Zelle, recibiras las credenciales (correo y contraseña) directamente en tu WhatsApp o direccion de correo electronico en un plazo maximo de 1 hora.",
  },
  {
    question: "¿Que pasa si la cuenta deja de funcionar?",
    answer: "Ofrecemos garantia de reposicion por 30 dias. Si tu cuenta presenta problemas, contactanos por WhatsApp y te proporcionaremos una nueva sin costo adicional.",
  },
  {
    question: "¿Puedo usar la cuenta en cualquier dispositivo?",
    answer: "Si, puedes usar tu perfil en cualquier dispositivo compatible con Netflix: Smart TV, celular, tablet, computadora o consola de videojuegos.",
  },
];

const reviews = [
  {
    name: "Jorge Diaz",
    initials: "JD",
    rating: 5,
    comment: "Super rapido el servicio. En menos de 15 min ya estaba viendo mi serie favorita en 4K. Recomendado 100%.",
  },
  {
    name: "Maria L.",
    initials: "ML",
    rating: 5,
    comment: "Excelente atencion por WhatsApp. Muy amables al explicarme como configurar el perfil.",
  },
  {
    name: "Ricardo P.",
    initials: "RP",
    rating: 4.5,
    comment: "Buena calidad, a veces hay que esperar un poquito por el mensaje pero nada grave. La cuenta funciona perfecto.",
  },
];

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const usdCupRate = await getUsdCupRate();
  const productData = mapProductToPageData(product, usdCupRate);

  const allProducts = await getProducts({ status: "active" }, 1, 100);
  const relatedProducts = allProducts.data
    .filter((p) => p.id !== product.id && p.available_units > 0)
    .slice(0, 5)
    .map((p) => ({
      name: p.name,
      price: formatPriceLabel(p),
      imageSrc: p.image_url || p.thumbnail || FALLBACK_IMAGE,
      accentColor: p.platform_color,
      slug: p.slug,
    }));

  const breadcrumbs = [
    { label: "Inicio", href: "/web" },
    { label: "Catalogo", href: "/web/catalog" },
    {
      label: product.platform_name,
      href: `/web/catalog?platform=${encodeURIComponent(product.platform_slug)}`,
    },
    { label: product.name },
  ];

  return (
    <ProductDetailTemplate
      breadcrumbs={breadcrumbs}
      product={productData}
      faqs={faqs}
      reviews={reviews}
      relatedProducts={relatedProducts}
    />
  );
}
