import { notFound } from "next/navigation";
import { ProductDetailTemplate } from "@/components/templates/product-detail-template";
import { getProductBySlug, type ProductWithDetails } from "@/lib/api/products";

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

function mapProductToPageData(product: ProductWithDetails) {
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
      priceMLC: undefined,
      features: [
        product.description || "Producto disponible en el catálogo",
        `Plataforma: ${product.platform_name}`,
        `Unidades disponibles: ${product.available_units}`,
        `Ventas totales: ${product.total_orders}`,
      ],
      durations: [
        { label: "1 mes", value: "1m" },
        { label: "3 meses", value: "3m" },
        { label: "1 año", value: "1y" },
      ],
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

const relatedProducts = [
  {
    name: "Disney+",
    price: "$180 CUP",
    imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuB71UwV7sZbyT0QWY_T3etcSPE7ExY_xHHnyKK-0534dzSbDIeuJCAMOr0CAYznocKAsormwSjirbM8wV7_vfK-8ikM5A5lACVYX6GQJspn4qR9-m2V1B6lsmrp-EhUR46kOGbJQ7yVFhxz8Bj0kcFt8DI3uPZ6OdzS-l_GHXgmMA064GRH1YFN_PezrYLmIqSbaZ7XeSfXpwRXmPIEvIBnEtF28C5QYzwmZN35tOZbz7inzd2Ys5pW4f0ypZnnpAm2MWuS-q_vPA",
    accentColor: "#0072d2",
  },
  {
    name: "Spotify Premium",
    price: "$120 CUP",
    imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuAhAyqmuHEyvoaKEwxV3wFRVU7e6ZTR7KjpGTmedn0ui08kqpKbTxvNdKLKv7FEzsA0A07-yBmQTqbrRHQ7ZHg2uBRdr-1mTpPsYd7B3-XgcC6kFS6G-uZyrOzZTxj0IVSjml_KY1u32Ic69siFSbmZYIQHrzs6ODsS-OZoRl5OF17_6Gm1Yq0zVMQWHvObB_otXIavkkuAwGinzRaq9QtTB8hMOxf7c_vjmgerYKkPlQqp86NQbVrVN0zVNNMFUEUnioEIiyE7fg",
    accentColor: "#1DB954",
  },
  {
    name: "YouTube Premium",
    price: "$150 CUP",
    imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuAc-9FAt5grgBfY7_pzHZme0Lka0JIvfapRfxpTcBxLrk2-kplUQ_xxP3d6fEh6-Q-2TVdHFmtKRhNmvsyDRBF3oYIMjLJcd8VmVLGThUpiESKyqqPmDDbGuwH0vPR3A0AlSOEDtUMHEfPxCAn40GoHJvwxp_mx2ZIVp5JBkxa_iiey2z6KsTPhIk28FdK5YAvL672frvY-UtCVHYwzkoS34ZKeOQ5vbwGexk7swmvT8PHQsGAIiqQFaW4w6hgR6qRiYyRXudu4MQ",
    accentColor: "#FF0000",
  },
  {
    name: "HBO Max",
    price: "$200 CUP",
    imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuDyawlravCm7yVv6xDYoBgAUtukyP7F0eqnRptKGz2yyeBv2Wvyb8oox1gOPupP9a8P0IV8FPlkl44b7k4HSaRFbKpWQUIbgZdLsM2P8TQsWlSGoJqKqO0zLi4mThFnGWQ-bJ1N4OenqFxoSRtBJNpD3XdGwYfRyvCfWIcAZSu0Ot4EAUPTA67Y_bzBp9c2PCoEFiChAdo956JVMN5YlHB5VAnelSiSkRlbrvrMJ74fVpYr4Q-4xViOyilBfsjMyWkWjNO_sGNgHQ",
    accentColor: "#991bfa",
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

  const productData = mapProductToPageData(product);
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
