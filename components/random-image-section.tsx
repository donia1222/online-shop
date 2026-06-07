"use client"

import { useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

function pickRandom(arr: string[], n: number): string[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy.slice(0, n)
}

interface RandomImageSectionProps {
  /** Carpeta dentro de /public/img (ej. "armbrust", "messer") */
  folder: string
  /** Lista estática de nombres de archivo */
  images: string[]
  /** Texto del chip superior */
  tag: string
  /** Icono del chip (componente lucide) */
  icon: ReactNode
  /** Título del bloque */
  title: string
  /** Subtítulo / descripción */
  description: string
  /** Parámetro de categoría para /shop?cat= */
  catParam: string
  /** Color de fondo de la sección (alterna entre bloques) */
  sectionBg?: string
}

export function RandomImageSection({
  folder,
  images: source,
  tag,
  icon,
  title,
  description,
  catParam,
  sectionBg = "#FFFFFF",
}: RandomImageSectionProps) {
  const router = useRouter()
  const [images, setImages] = useState<string[]>([])

  // Elegir 10 aleatorias para la fila con scroll lateral (4 visibles a la vez)
  useEffect(() => {
    setImages(pickRandom(source, 10))
  }, [source])

  const goToShop = () => router.push(`/shop?cat=${encodeURIComponent(catParam)}`)

  if (images.length === 0) return null

  const renderTile = (file: string) => (
    <div
      key={file}
      className="shrink-0 snap-start w-[45%] sm:w-[31%] lg:w-[calc((100%-3rem)/4)]"
    >
      <div className="relative bg-white rounded-2xl overflow-hidden aspect-square lg:aspect-[4/3] border border-[#E5E5E5]">
        <img
          src={`/img/${folder}/${encodeURIComponent(file)}`}
          alt={title}
          loading="lazy"
          className="w-full h-full object-contain p-3"
        />
      </div>
    </div>
  )

  return (
    <section className="py-6" style={{ backgroundColor: sectionBg }}>
      <div className="container mx-auto px-4">

        {/* Tarjeta con borde */}
        <div className="relative overflow-hidden rounded-3xl bg-white border border-[#E5E5E5] shadow-sm p-5 sm:p-7">

          {/* Círculos decorativos verdes flotantes */}
          <div className="pointer-events-none absolute -top-10 -right-10 w-32 h-32 rounded-full bg-[#2C5F2E]/5 animate-float" />
          <div className="pointer-events-none absolute -top-4 -right-4 w-20 h-20 rounded-full bg-[#2C5F2E]/8 animate-float-reverse" />


          {/* Header */}
          <div className="relative z-10 mb-8">
            <div className="inline-flex items-center gap-1.5 bg-[#2C5F2E]/8 text-[#2C5F2E] text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
              <span className="flex items-center justify-center">{icon}</span> {tag}
            </div>
            <h2 className="text-2xl font-black text-[#1A1A1A] tracking-tight">{title}</h2>
            <p className="text-sm text-[#888] mt-1">{description}</p>
          </div>

          {/* Fila única con scroll lateral — 4 visibles a la vez */}
          <div className="relative z-10 flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 -mx-1 px-1 [scrollbar-width:thin]">
            {images.map(renderTile)}
          </div>

          {/* CTA centrado debajo de las imágenes (desktop) */}
          <div className="relative z-10 mt-6 hidden sm:flex justify-center">
            <button
              onClick={goToShop}
              className="inline-flex items-center gap-2 rounded-full bg-[#2C5F2E]/10 px-6 py-2.5 text-sm font-bold text-[#1E441F] hover:bg-[#2C5F2E]/20 hover:gap-3 active:scale-95 transition-all duration-200 whitespace-nowrap"
            >
              Alle ansehen <span>→</span>
            </button>
          </div>


          {/* Mobile CTA */}
          <div className="relative z-10 mt-5 sm:hidden">
            <button
              onClick={goToShop}
              className="w-full py-3 rounded-2xl border-2 border-[#2C5F2E]/25 hover:border-[#2C5F2E] text-sm font-bold text-[#2C5F2E] transition-all"
            >
              Alle {title.replace(/^Unsere\s+/i, "")} anzeigen →
            </button>
          </div>

        </div>

      </div>
    </section>
  )
}
