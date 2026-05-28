import { cn } from "@/lib/utils";

type AccessType = "profile" | "account" | "code" | "invitation";

interface AccessTypeTagProps {
  type: AccessType;
  className?: string;
}

const accessConfig = {
  profile: {
    label: "Perfil compartido",
    className: "bg-purple-600/90",
  },
  account: {
    label: "Cuenta completa",
    className: "bg-blue-600/90",
  },
  code: {
    label: "Código",
    className: "bg-orange-600/90",
  },
  invitation: {
    label: "Invitación",
    className: "bg-green-600/90",
  },
};

export function AccessTypeTag({ type, className }: AccessTypeTagProps) {
  const config = accessConfig[type];

  return (
    <span
      className={cn(
        "text-white px-2 py-1 rounded text-xs font-bold uppercase tracking-wider",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
