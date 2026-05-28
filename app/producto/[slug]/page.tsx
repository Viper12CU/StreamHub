import { ProductDetailTemplate } from "@/components/templates/product-detail-template";

const breadcrumbs = [
  { label: "Inicio", href: "/" },
  { label: "Catalogo", href: "/catalogo" },
  { label: "Netflix", href: "/catalogo?platform=netflix" },
  { label: "Perfil Compartido 1 mes" },
];

const productData = {
  imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuCI9zfLe_zSrOXlC62SQ9us0PD-GHcidMDGwnzzGtJ8ZAkzYysD2snSYlVsC0-pxdQHcy9bEouhv9KthrUabOQq84-S2tpfDTYXrnnuMCyEUGdgp0vD-d-MoEp4kD1KeL3Nw0oV3QL8u-pfhZWipDRdLIE6LMRTZWPHmh5ZScny07nTkKIrqdU0Vdg64LoMAjA7jI4LKIbD8vKy4gp6KYlgWRWOUYOVjN54d6Pw0vG79-C9CFo5bIwCU6EJ_w-UsXnOo6tfRfrY_g",
  imageAlt: "Netflix Premium",
  accessType: "Perfil compartido",
  status: "available" as const,
  info: {
    name: "Netflix Premium — Perfil Compartido",
    rating: 4.9,
    reviewsCount: 128,
    priceCUP: "$250 CUP",
    priceMLC: "/ $5 MLC",
    features: [
      "Full HD / 4K Ultra HD",
      "1 pantalla simultanea",
      "Sin anuncios molestos",
      "Entrega < 1 hora",
    ],
    durations: [
      { label: "1 mes", value: "1m" },
      { label: "3 meses", value: "3m" },
      { label: "1 año", value: "1y" },
    ],
  },
};

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

export default function ProductDetailPage() {
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
