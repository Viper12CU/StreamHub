import Image from "next/image";

interface OrderItemCardProps {
  image: string;
  type: string;
  title: string;
  duration: string;
  originalPrice: string;
  price: string;
  mlcPrice: string;
}

export function OrderItemCard({
  image,
  type,
  title,
  duration,
  originalPrice,
  price,
  mlcPrice,
}: OrderItemCardProps) {
  return (
    <div className="glass rounded-xl p-6 flex gap-4 items-start border-t-2 border-red-600">
      <div className="w-20 h-28 rounded-lg overflow-hidden flex-shrink-0 bg-neutral-800 relative">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex-grow">
        <div className="flex justify-between items-start">
          <div>
            <span className="bg-red-500/10 text-red-500 border border-red-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider mb-2 inline-block">
              {type}
            </span>
            <h3 className="font-semibold text-lg text-white leading-tight">
              {title}
            </h3>
          </div>
        </div>
        <div className="mt-4 flex justify-between items-end">
          <div className="text-neutral-400 text-sm">
            <p>
              Duracion: <span className="text-white font-bold">{duration}</span>
            </p>
            <p className="mt-1">Garantia total de acceso</p>
          </div>
          <div className="text-right">
            <div className="text-neutral-400 line-through text-xs">
              {originalPrice}
            </div>
            <div className="text-white font-bold text-2xl">{price}</div>
            <div className="text-blue-500 font-semibold text-xs uppercase tracking-wider">
              {mlcPrice}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
