"use client"

import { useEffect, useState } from "react"

export function BrandsScrollBanner() {
  const [brands, setBrands] = useState<string[]>([])

  useEffect(() => {
    fetch("/api/products")
      .then(r => r.json())
      .then(data => {
        if (!data.products) return
        const seen = new Set<string>()
        const list: string[] = []
        data.products.forEach((p: any) => {
          if (!p.origin) return
          const key = p.origin.trim().toLowerCase().replace(/\s+/g, "")
          if (seen.has(key)) return
          seen.add(key)
          list.push(p.origin.trim())
        })
        setBrands(list.sort((a, b) => a.localeCompare(b)))
      })
      .catch(() => {})
  }, [])

  if (brands.length === 0) return null

  const items = [...brands, ...brands, ...brands]

  return (
    <div className="bg-[#F7F7F8] border-y border-[#E8E8E8] py-4 overflow-hidden select-none">
      <p className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-[#AAAAAA] mb-3">
        Unsere Marken
      </p>
      <div
        className="flex gap-3 w-max"
        style={{ animation: "brandsScroll 35s linear infinite" }}
      >
        {items.map((brand, i) => (
          <span
            key={i}
            className="flex-shrink-0 px-4 py-1.5 rounded-full bg-white border border-[#E0E0E0] text-[11px] font-bold text-[#555] uppercase tracking-wider shadow-sm whitespace-nowrap"
          >
            {brand}
          </span>
        ))}
      </div>
      <style>{`
        @keyframes brandsScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-33.333%); }
        }
      `}</style>
    </div>
  )
}
