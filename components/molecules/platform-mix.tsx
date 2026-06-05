const platforms = [
  { name: "Netflix", percentage: 42, revenue: "$5,229", color: "bg-primary-container" },
  { name: "Spotify", percentage: 23, revenue: "$2,863", color: "bg-secondary" },
  { name: "Disney+", percentage: 15, revenue: "$1,867", color: "bg-tertiary" },
  { name: "YouTube Premium", percentage: 10, revenue: "$1,245", color: "bg-[#ff0000]" },
  { name: "HBO Max", percentage: 6, revenue: "$747", color: "bg-[#b829e3]" },
  { name: "Crunchyroll", percentage: 4, revenue: "$498", color: "bg-[#f47521]" },
]

export function PlatformMix() {
  return (
    <div className="glass p-6 rounded-xl flex flex-col items-center md:col-span-3 lg:col-span-4">
      <h3 className="text-2xl font-semibold text-on-surface self-start mb-4">Distribución por Plataforma</h3>
      <div className="w-32 h-32 rounded-full border-[12px] border-primary-container/20 border-l-primary-container border-t-secondary relative flex items-center justify-center mb-4">
        <div className="text-center">
          <p className="text-lg font-bold">328</p>
          <p className="text-[10px] text-on-surface-variant">órdenes</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 w-full">
        {platforms.map((platform) => (
          <div key={platform.name} className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${platform.color}`} />
            <span className="text-[10px] text-on-surface-variant flex-1">{platform.name}</span>
            <span className="text-[10px] font-semibold text-on-surface">{platform.percentage}%</span>
            <span className="text-[10px] text-on-surface-variant opacity-60">{platform.revenue}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
