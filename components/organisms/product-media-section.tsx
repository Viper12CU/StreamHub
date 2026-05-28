import Image from "next/image";
import { cn } from "@/lib/utils";
import { Monitor, Smartphone, Download } from "lucide-react";
import { FeatureIconBox } from "@/components/molecules/feature-icon-box";

interface ProductMediaSectionProps {
  imageSrc: string;
  imageAlt: string;
  accessType: string;
  status: "available" | "limited" | "soldout";
  className?: string;
}

export function ProductMediaSection({ imageSrc, imageAlt, accessType, status, className }: ProductMediaSectionProps) {
  const statusStyles = {
    available: "bg-green-950/40 border-green-500/30 text-green-400",
    limited: "bg-amber-950/40 border-amber-500/30 text-amber-400",
    soldout: "bg-red-950/40 border-red-500/30 text-red-400",
  };
  
  const statusLabels = {
    available: "Disponible",
    limited: "Ultimas unidades",
    soldout: "Agotado",
  };

  return (
    <div className={cn("space-y-4 sticky top-28", className)}>
      <div className="glass-panel red-glow rounded-xl aspect-[4/5] relative overflow-hidden flex items-center justify-center p-10">
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={240}
          height={240}
          className="w-full max-w-[240px] drop-shadow-2xl"
        />
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <span className="bg-card/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold border border-border">
            {accessType}
          </span>
          <div className={cn(
            "flex items-center gap-2 backdrop-blur-md px-3 py-1 rounded-full border",
            statusStyles[status]
          )}>
            <span className="pulse-dot w-2 h-2 rounded-full bg-current" />
            <span className="text-xs font-semibold">{statusLabels[status]}</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <FeatureIconBox icon={Monitor} label="Calidad 4K" />
        <FeatureIconBox icon={Smartphone} label="Multi-device" />
        <FeatureIconBox icon={Download} label="Offline" />
      </div>
    </div>
  );
}
