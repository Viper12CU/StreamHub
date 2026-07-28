import { cn } from "@/lib/utils";

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
    <div className={cn("space-y-4 top-28", className)}>
      <div className="glass-panel red-glow rounded-3xl aspect-[4/3] md:aspect-[5/4] relative overflow-hidden p-2">
        <div className="relative h-full w-full overflow-hidden rounded-[1.2rem]">
          <img
            src={imageSrc}
            alt={imageAlt}
            className="absolute inset-x-0 bottom-0 w-full max-h-full rounded-b-[0.9rem] object-contain object-bottom drop-shadow-2xl"
            loading="eager"
          />
        </div>

        <div className="absolute top-5 left-5 flex flex-row gap-2">
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
    </div>
  );
}
