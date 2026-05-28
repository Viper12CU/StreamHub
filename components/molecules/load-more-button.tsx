"use client";

import { ChevronDown } from "lucide-react";

interface LoadMoreButtonProps {
  onClick?: () => void;
  loading?: boolean;
}

export function LoadMoreButton({ onClick, loading }: LoadMoreButtonProps) {
  return (
    <div className="mt-16 flex justify-center">
      <button
        onClick={onClick}
        disabled={loading}
        className="flex items-center gap-4 px-12 py-4 rounded-full border border-white/20 hover:bg-white/5 hover:border-white/40 transition-all font-bold text-foreground disabled:opacity-50"
      >
        {loading ? "Cargando..." : "Cargar más productos"}
        {!loading && <ChevronDown className="w-5 h-5" />}
      </button>
    </div>
  );
}
