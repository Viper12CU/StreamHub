"use client"

import { TabButton } from "@/components/atoms/tab-button"

interface TabSwitcherProps {
  activeTab: "login" | "register"
  onTabChange: (tab: "login" | "register") => void
}

export function TabSwitcher({ activeTab, onTabChange }: TabSwitcherProps) {
  return (
    <div className="flex p-1 bg-[#1c1b1b] rounded-full w-fit mx-auto">
      <TabButton 
        isActive={activeTab === "login"} 
        onClick={() => onTabChange("login")}
      >
        Entrar
      </TabButton>
      <TabButton 
        isActive={activeTab === "register"} 
        onClick={() => onTabChange("register")}
      >
        Registrarse
      </TabButton>
    </div>
  )
}
