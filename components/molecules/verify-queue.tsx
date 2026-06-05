interface VerifyItem {
  name: string
  amount: string
  time: string
  paymentMethod: string
  receipt?: string
  isUrgent?: boolean
}

const verifyItems: VerifyItem[] = [
  { name: "Alex M.", amount: "$24.99", time: "12m", paymentMethod: "Tarjeta", receipt: "receipt_9021.png" },
  { name: "Sarah C.", amount: "$15.00", time: "45m", paymentMethod: "PayPal" },
  { name: "David P.", amount: "$14.99", time: "26h", paymentMethod: "Transferencia", receipt: "receipt_9005.png", isUrgent: true },
]

export function VerifyQueue() {
  return (
    <div className="glass p-6 rounded-xl flex flex-col md:col-span-3 lg:col-span-3">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-semibold text-on-surface">Cola de Verificación</h3>
        <span className="px-2 py-0.5 rounded bg-error-container text-error text-[10px] font-bold">24</span>
      </div>
      <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar pr-1">
        {verifyItems.map((item, i) => (
          <div
            key={i}
            className={`p-3 rounded-lg border flex flex-col gap-2 hover:border-primary transition-colors cursor-pointer ${
              item.isUrgent
                ? "bg-error-container/10 border-error/30"
                : "bg-surface-container-low border-white/5"
            }`}
          >
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-on-surface">{item.name} - {item.amount}</span>
              <span className={`opacity-60 ${item.isUrgent ? "text-error font-bold" : "text-on-surface-variant"}`}>{item.time}</span>
            </div>
            <p className="text-[10px] text-on-surface-variant">{item.paymentMethod}</p>
            {item.receipt ? (
              <>
                <p className="text-[10px] text-on-surface-variant truncate">{item.receipt}</p>
                <div className="flex gap-2 mt-1">
                  <button className="flex-1 py-1 bg-green-500/20 text-green-400 rounded text-[10px] hover:bg-green-500/30">OK</button>
                  <button className="flex-1 py-1 bg-error-container/20 text-error rounded text-[10px] hover:bg-error-container/30">X</button>
                </div>
              </>
            ) : (
              <button className="w-full py-1 bg-white/5 text-on-surface rounded text-[10px] hover:bg-white/10">Detalles</button>
            )}
          </div>
        ))}
      </div>
      <button className="w-full mt-4 py-2 bg-primary/10 text-primary text-xs font-semibold rounded-lg hover:bg-primary/20 transition-colors">
        Revisar Pagos
      </button>
    </div>
  )
}
