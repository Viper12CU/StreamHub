export default function Loading() {
  return (
    <main className="relative z-10 flex flex-col items-center justify-center min-h-screen overflow-hidden">
      {/* Atmospheric Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="brand-glow absolute -top-1/4 -left-1/4 w-full h-full bg-primary-container/20 rounded-full" />
        <div className="brand-glow absolute -bottom-1/4 -right-1/4 w-full h-full bg-secondary-container/20 rounded-full" />
      </div>

      {/* Logo Centerpiece */}
      <div className="loading-logo-pulse">
        <h1 className="text-[40px] md:text-[64px] font-black tracking-tighter text-on-surface select-none">
          STREAM<span className="text-primary-container">HUB</span>
        </h1>
      </div>

      {/* Bottom Infinite Progress Bar */}
      <div className="fixed bottom-0 left-0 w-full h-1 bg-white/5 overflow-hidden z-20">
        <div className="loading-progress-bar absolute inset-0 w-1/3 bg-gradient-to-r from-primary-container via-secondary-container to-primary-container" />
      </div>

      {/* Background Decorative Visual */}
      <div className="fixed inset-0 -z-10 opacity-30">
        <img
          alt="StreamHub Background"
          className="w-full h-full object-cover"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCm-Onhk7zD5xI61Dn7G5pUmRoGgfOzf6wRhHfWcT3uZf7KJUOpwsa2HGwsvdWTKtgAZdkpuw16RnhKBekf9bWY5IAGozzBGoVTKwU0w3IJhHJZPMrIldvqoceelA3lI3Rg5_ySEzsOpFaWdIAWstNq2-9TulQ9787lBkak1egrzMmplcW6Xj_W0AEOH_e259XJYDLuOApPMgs9kOD2SX7jrr1UiFyjlT_fQESB4kCSpb1pKWRaGJHNDZJGY03RAfn3abr1IgVOAA"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-transparent" />
      </div>
    </main>
  )
}
