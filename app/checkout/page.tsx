import { CheckoutTemplate } from "@/components/templates/checkout-template";

export const metadata = {
  title: "Checkout | StreamHub Cuba",
  description: "Completa tu compra en StreamHub Cuba",
};

const orderItem = {
  image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBnnp0vda7oVQAxEdg9jmeFHy1RggWbNzwRhpqF_pQfHqAZj-8f6Qn7QVDTjJjT_BP-DYLR9MgUHAMyWZlh-CvxDzqzzS0Mh1kpiJKVTR5xOBYzsarou67F5nekniTZ0ncY3izbVgiexGg2cQMuamOKgXbRH1N_zqiL2e6BIfpwsbkP08OlGTf6yoJOoXNyKAT-RYz52IG4YmkOI7EzT70hs_z0sPUyUV5_ZcM6za2GjFLRStRNL7YNaqeXyJAju1n4naelLBY6qQ",
  type: "Perfil compartido",
  title: "Netflix Premium — Perfil Compartido",
  duration: "1 mes",
  originalPrice: "$300 CUP",
  price: "$250 CUP",
  mlcPrice: "$5 MLC",
};

export default function CheckoutPage() {
  return (
    <CheckoutTemplate
      orderItem={orderItem}
      subtotal="$250.00 CUP"
      serviceCharge="$0.00 CUP"
      total="$250 CUP"
    />
  );
}
