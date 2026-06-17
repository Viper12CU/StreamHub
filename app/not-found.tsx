"use client"

import Link from "next/link"
import { Icon } from "@/components/atoms/icon"

export default function NotFound() {
  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Atmospheric Mesh Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[#0D0D0D]" />
        <div className="absolute inset-0 not-found-glow" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", backgroundSize: "40px 40px" }}
        />
      </div>

      {/* 404 Visuals */}
      <section className="relative z-10 w-full max-w-6xl px-6 text-center space-y-10">
        <div className="relative inline-block">
          <h1 className="font-black text-[120px] md:text-[240px] leading-none text-primary-container not-found-glitch opacity-90 select-none">
            404
          </h1>
          <div className="absolute -top-10 -right-10 md:-top-20 md:-right-20 pointer-events-none blur-3xl opacity-20 bg-primary-container w-40 h-40 md:w-80 md:h-80 rounded-full" />
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl md:text-[48px] md:leading-[56px] md:tracking-[-0.02em] font-bold text-on-surface">
            ¡Ups! Parece que te has perdido en el streaming
          </h2>
          <p className="text-lg md:text-[18px] md:leading-[28px] text-on-surface-variant/80 max-w-lg mx-auto">
            El contenido que buscas no está disponible o ha sido movido. Puede que haya sido retirado del catálogo o que la URL sea incorrecta.
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-6">
          <Link
            href="/web"
            className="group relative px-16 py-6 bg-primary-container rounded-xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(229,9,20,0.4)] active:scale-95"
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative text-xs font-semibold text-white flex items-center gap-2">
              <Icon name="home" className="text-[20px]" />
              Volver al Inicio
            </span>
          </Link>
          <Link
            href="#"
            className="px-16 py-6 glass rounded-xl text-on-surface hover:bg-white/5 transition-all duration-300 text-xs font-semibold border border-white/10 flex items-center gap-2"
          >
            <Icon name="headset" className="text-[20px]" />
            Contactar Soporte
          </Link>
        </div>

        {/* Decorative Film Strips */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10 opacity-20 pointer-events-none">
          <div className="h-40 rounded-lg overflow-hidden border border-white/5 grayscale">
            <img
              alt="Cinema visual"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDwNU38AW_e7Z96qEeTmZQ8df0Sm7jixjPmwxMcRgMxroKM0YMY5bU1tBXsnT49wLf39Jn6dVp9JF7KiPPmbgMyCa9dxzZis0kMo_F70582YP4tYJAV9uII3OyPnuyPC-GMD5Ba4FQ0LOn78u0gVu0i6QkU6WOrQRFDPB-WTmgakprKgQeFw5nfQQp7LNwD5EDZ0Og3-xAcfNzWcG3BQe7OUJ8g8wcvbCrK8iyBLY9ZW7Pd70_Sn8wwIbiLdK2sfgYbK2uZHjmBGA"
            />
          </div>
          <div className="h-40 rounded-lg overflow-hidden border border-white/5 grayscale hidden md:block">
            <img
              alt="Film production"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAo7qdyyON6gngqKe7kulq62hMIEjik-3C0o72phjxVD5RlRv8Tu6goL0KA7B2wffDCiDY__0T46t2PRnohtrWxZI8lS5T9A0IyKjxRKPUmtcGS_Hx-CYvCn_beHrTL6JjSh_Hk6hXfCu1OXu-Mhx0byjaIr9uJWuvVLWQS2kCDal0pDqGwgQdUA8BF4ioDS9-hhEqeN1CY4qdUElycgJVcyb8MSYrxS4VLjmZ-jUbUS6AGCzuH6pbJ9GMoLBv_1yNbMhl5OOZ6vg"
            />
          </div>
          <div className="h-40 rounded-lg overflow-hidden border border-white/5 grayscale hidden md:block">
            <img
              alt="Digital stream"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDAI9I1R8yaWDXF_Kg_6rRhocvU_-L7j_s9Un-vS_JxHf-643LIVnpCYa_9Sp-86ygUyE0osWPoQ8YdX0ChQ57cl-TuPK3f8u7eqEk2W121iouPL583YKJAfIcT8YWruZY7vnckCmMRDmBQfqSHuIC-AP8hX7lvlnds8e9xU9aqUn5eBRxkntHEsjQSV04DNHodCSwbfA6VJp2GnFuip54xUppU7NDHdABTL4fR7tWTZauWkxfNrdaHFeqJ1Dg_BX6qhxwpRgSdGA"
            />
          </div>
          <div className="h-40 rounded-lg overflow-hidden border border-white/5 grayscale">
            <img
              alt="Abstract theater"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDfg_koZTWmWxWGI6cEtQzd4mjpIEN70Q1IP-w2olSzFQt-0bbG6HfEteN_RdXunBIv0PXSWcNuwSkR1iAFRCZBAj-ga4rqKyN56iSrB5lIQ76YJ8VzGRWZb6FZBsw10RL6CaqV2yhyEwDyfanb3OLbe12-KUMy_T-ZwntV5JQAgAZLzsHSw-BLPxKE2JeYds-v_fRXxtJRyJG04JjQVgHZFl0s5TMuBYK7Sfm3eCxklnjAfA59pTIv9WiEJxgIPFJS50te7N0SQg"
            />
          </div>
        </div>
      </section>


    </main>
  )
}
