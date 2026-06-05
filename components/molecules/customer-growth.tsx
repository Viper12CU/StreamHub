export function CustomerGrowth() {
  return (
    <div className="glass p-6 rounded-xl flex flex-col lg:col-span-7">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-semibold text-on-surface">Crecimiento de Clientes</h3>
        <span className="text-[10px] text-on-surface-variant opacity-60">Últimos 30 días</span>
      </div>
      <div className="flex-1 min-h-[150px] relative mt-4">
        <svg className="absolute inset-0 h-full w-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
          <path d="M0,80 L20,70 L40,85 L60,40 L80,30 L100,10" fill="none" stroke="#ffb4aa" strokeWidth="2" />
          <path d="M0,90 L20,85 L40,88 L60,75 L80,70 L100,65" fill="none" stroke="#aec6ff" strokeDasharray="4" strokeWidth="2" />
        </svg>
      </div>
      <div className="mt-auto flex gap-6 pt-4 border-t border-white/10">
        <div className="flex items-center gap-2">
          <span className="w-3 h-0.5 bg-primary" />
          <span className="text-[10px] text-on-surface-variant uppercase">Nuevos registros</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-0.5 bg-secondary" />
          <span className="text-[10px] text-on-surface-variant uppercase">Clientes recurrentes</span>
        </div>
      </div>
    </div>
  )
}
