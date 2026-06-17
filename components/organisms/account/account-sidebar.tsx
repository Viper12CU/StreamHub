"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/atoms/button";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/atoms/icon";

const navItems = [
  { href: "/web/account", label: "Inicio", icon: "view-dashboard" },
  { href: "/web/account/purchases", label: "Mis Compras", icon: "shopping" },
  {
    href: "/web/account/active-services",
    label: "Servicios Activos",
    icon: "credit-card-outline",
  },
  { href: "/web/account/wishlist", label: "Wishlist", icon: "heart" },
  { href: "/web/catalog", label: "Catálogo", icon: "store" },
  { href: "/web/account/settings", label: "Configuracion", icon: "cog" },
];

interface AccountSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function AccountSidebar({ collapsed, onToggle }: AccountSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col fixed h-full z-40 bg-[var(--surface-container-lowest)] border-r border-white/5 transition-all duration-300",
        collapsed ? "w-[72px]" : "w-[260px]",
      )}
    >
      <div className={cn("p-6 space-y-8", collapsed && "px-3 pt-6")}>
        <span
          className={cn(
            "font-black text-primary tracking-tight block",
            collapsed ? "text-lg text-center" : "text-2xl",
          )}
        >
          {collapsed ? "S" : "StreamHub"}
        </span>

        {!collapsed && (
          <div
            className={cn(
              "flex items-center rounded-2xl bg-[var(--surface-container-low)] border border-white/5 transition-all",
              collapsed ? "p-2 justify-center" : "gap-3 p-4",
            )}
          >
            <div className="w-10 h-10 rounded-full bg-[var(--surface-container-high)] ring-2 ring-primary/30 shrink-0" />
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate">Jorge Garcia</p>
              <p className="text-xs text-[var(--on-surface-variant)] truncate">
                jorge.g@email.com
              </p>
            </div>
          </div>
        )}

        <nav className="space-y-2 text-sm">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-r-lg transition-colors",
                  collapsed ? "justify-center px-0 py-2" : "px-3 py-2",
                  isActive
                    ? "text-primary bg-primary/10 border-l-4 border-primary"
                    : "text-[var(--on-surface-variant)] hover:text-primary",
                )}
              >
                <Icon
                  name={item.icon}
                  className="text-[20px] shrink-0"
                />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className={cn("mt-auto p-6", collapsed && "px-3")}>
        <Button
          variant="secondary"
          className={cn(
            "rounded-2xl text-primary border border-white/10 transition-all",
            collapsed ? "w-full px-0 justify-center" : "w-full",
          )}
          title={collapsed ? "Soporte WhatsApp" : undefined}
        >
          <Icon
            name="headset"
            className="text-[18px]"
          />
          {!collapsed && <span>Soporte WhatsApp</span>}
        </Button>
      </div>

      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className={cn(
          "absolute top-1/2 -translate-y-1/2  flex items-center justify-center",
          "w-6 h-12 rounded-r-lg bg-[var(--surface-container-high)] border border-white/10 border-l-0",
          "text-[var(--on-surface-variant)] hover:text-primary hover:bg-[var(--surface-container)]",
          "transition-all duration-300 z-50",
          collapsed ? "right-[-24px]" : "right-[-24px]",
        )}
      >
        <Icon
          name={collapsed ? "chevron-right" : "chevron-left"}
          className="text-[16px] transition-transform duration-300"
          style={{ transform: "none" }}
        />
      </button>
    </aside>
  );
}
