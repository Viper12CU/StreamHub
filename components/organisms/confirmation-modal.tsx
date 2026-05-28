"use client";

import { CheckCircle } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  reference: string;
}

export function ConfirmationModal({ isOpen, onClose, reference }: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />
      <div className="glass relative w-full max-w-lg rounded-2xl p-12 flex flex-col items-center text-center shadow-2xl border-red-500/20">
        <div className="w-24 h-24 rounded-full bg-blue-500/20 flex items-center justify-center mb-8">
          <CheckCircle className="w-16 h-16 text-blue-500 animate-pulse" />
        </div>
        <h2 className="font-bold text-3xl mb-4">Pedido recibido!</h2>
        <p className="text-neutral-400 text-lg mb-8 max-w-md">
          Te enviaremos tus credenciales en menos de{" "}
          <span className="text-white font-bold">1 hora</span> por WhatsApp o
          correo electronico.
        </p>
        <div className="bg-neutral-800 px-8 py-4 rounded-full mb-10 border border-white/5">
          <span className="text-neutral-400 font-semibold text-xs uppercase tracking-wider mr-2">
            Referencia:
          </span>
          <span className="text-blue-500 font-bold text-xl">{reference}</span>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <button className="flex-1 bg-blue-500 text-white px-8 py-4 rounded-xl font-semibold hover:brightness-110 transition-all">
            Ver mis pedidos
          </button>
          <button
            onClick={onClose}
            className="flex-1 text-white hover:text-red-500 px-8 py-4 rounded-xl font-semibold transition-all"
          >
            Seguir comprando
          </button>
        </div>
      </div>
    </div>
  );
}
