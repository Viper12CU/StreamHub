"use client";

import { useState } from "react";
import { PaymentMethodButton } from "@/components/atoms/payment-method-button";
import { UploadArea } from "@/components/atoms/upload-area";
import { PaymentDetails } from "@/components/molecules/payment-details";

type PaymentMethod = "transfermovil" | "zelle" | "mlc";

interface PaymentFlowSectionProps {
  onConfirm: () => void;
}

const paymentMethods: { method: PaymentMethod; label: string }[] = [
  { method: "transfermovil", label: "Transfermovil" },
  { method: "zelle", label: "Zelle" },
  { method: "mlc", label: "MLC" },
];

const paymentInfo: Record<PaymentMethod, { phone: string; amount: string; reference: string }> = {
  transfermovil: { phone: "5294 8234", amount: "$250.00 CUP", reference: "SH-2024-XP" },
  zelle: { phone: "pagos@streamhub.cu", amount: "$5.00 USD", reference: "SH-2024-XP" },
  mlc: { phone: "9204 5521 8734 2210", amount: "$5.00 MLC", reference: "SH-2024-XP" },
};

export function PaymentFlowSection({ onConfirm }: PaymentFlowSectionProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("transfermovil");

  return (
    <div className="glass rounded-xl p-8">
      <h2 className="font-semibold text-2xl mb-8">Como pagar?</h2>

      {/* Payment Method Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {paymentMethods.map(({ method, label }) => (
          <PaymentMethodButton
            key={method}
            method={method}
            label={label}
            isActive={selectedMethod === method}
            onClick={() => setSelectedMethod(method)}
          />
        ))}
      </div>

      {/* Payment Details */}
      <div className="space-y-8">
        <PaymentDetails {...paymentInfo[selectedMethod]} />

        {/* Upload Area */}
        <UploadArea />

        {/* Action Buttons */}
        <div className="flex flex-col space-y-4">
          <button className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-4 rounded-xl font-semibold text-lg flex items-center justify-center space-x-3 transition-colors">
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.412-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.309 1.656zm6.29-4.171c1.533.909 3.038 1.363 4.541 1.365 5.461 0 9.894-4.432 9.897-9.893.001-2.652-1.03-5.144-2.903-7.017-1.873-1.873-4.366-2.903-7.017-2.904-5.465 0-9.895 4.431-9.898 9.892-.001 1.902.534 3.754 1.547 5.344l-1.014 3.702 3.847-.989zm11.366-5.44c-.312-.156-1.848-.912-2.134-1.017-.286-.105-.494-.156-.703.156-.208.311-.806 1.017-.988 1.225-.182.208-.364.233-.676.078-.312-.156-1.316-.486-2.507-1.548-.927-.827-1.552-1.849-1.734-2.16-.182-.312-.019-.481.136-.636.14-.139.312-.364.468-.546.156-.182.208-.312.312-.519.104-.208.052-.39-.026-.546-.078-.156-.703-1.694-.963-2.32-.253-.61-.51-.527-.703-.537l-.598-.01c-.208 0-.546.078-.832.39-.286.312-1.093 1.066-1.093 2.601 0 1.535 1.118 3.017 1.274 3.224.156.182 2.199 3.359 5.326 4.709.744.321 1.324.512 1.774.656.748.238 1.429.204 1.967.124.599-.088 1.848-.755 2.108-1.483.26-.728.26-1.353.182-1.483-.078-.13-.286-.208-.598-.364z" />
            </svg>
            <span>Envia tu comprobante por WhatsApp</span>
          </button>
          <button
            onClick={onConfirm}
            className="w-full bg-red-600 text-white py-4 rounded-xl font-semibold text-lg hover:brightness-110 active:scale-[0.98] transition-all"
          >
            Confirmar pedido
          </button>
        </div>
      </div>
    </div>
  );
}
