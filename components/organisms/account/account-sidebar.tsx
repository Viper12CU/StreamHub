"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/atoms/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/account", label: "Inicio", icon: "dashboard" },
  { href: "/account/purchases", label: "Mis Compras", icon: "shopping_bag" },
  {
    href: "/account/active-services",
    label: "Servicios Activos",
    icon: "subscriptions",
  },
  { href: "/account/wishlist", label: "Wishlist", icon: "favorite" },
  { href: "/catalog", label: "Catálogo", icon: "storefront" },
  { href: "/account/settings", label: "Configuracion", icon: "settings" },
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
                <span
                  className="material-symbols-outlined text-[20px] shrink-0"
                  data-icon={item.icon}
                >
                  {item.icon}
                </span>
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
          <span
            className="material-symbols-outlined text-[18px]"
            data-icon="support_agent"
          >
            support_agent
          </span>
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
        <span
          className="material-symbols-outlined text-[16px] transition-transform duration-300"
          data-icon={collapsed ? "chevron_right" : "chevron_left"}
          style={{ transform: "none" }}
        >
          {collapsed ? "chevron_right" : "chevron_left"}
        </span>
      </button>
    </aside>
  );
}
