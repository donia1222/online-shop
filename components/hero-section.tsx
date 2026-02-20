"use client"

import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    setIsVisible(true)

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const scrollToProducts = () => {
    const element = document.getElementById("products")
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section
      id="hero"
      className="relative min-h-screen bg-[#F9F7F4] overflow-hidden"
    >
      {/* Main content grid */}
      <div className="container mx-auto px-6 min-h-screen flex flex-col">
        <div className="flex-1 grid lg:grid-cols-2 gap-0 items-center py-24 lg:py-0">

          {/* Left side: brand content */}
          <div
            className={`flex flex-col justify-center lg:pr-16 transform transition-all duration-1000 ${
              isVisible ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"
            }`}
          >
            {/* Label line */}
            <div className="mb-8">
              <span className="text-xs font-semibold tracking-[0.25em] uppercase text-[#9B9189] border border-[#E8E0D5] px-4 py-2 inline-block">
                Handwerk · Schärfe · Präzision
              </span>
            </div>

            {/* Main title */}
            <h1 className="mb-8 leading-none">
              <span className="block text-8xl lg:text-[9rem] font-black text-[#2E1F0F] tracking-tight leading-none">
                GLUT
              </span>
              <span className="block text-8xl lg:text-[9rem] font-black text-[#B8864E] tracking-tight leading-none">
                WERK
              </span>
            </h1>

            {/* Divider */}
            <div className="w-16 h-px bg-[#B8864E] mb-8"></div>

            {/* Description */}
            <p className="text-lg text-[#9B9189] leading-relaxed mb-12 max-w-md font-light">
              Premium Saucen aus handverlesenen Zutaten. Jede Flasche ein Ausdruck
              von Leidenschaft, Schärfe und kompromissloser Qualität.
            </p>

            {/* CTA button */}
            <div>
              <Button
                onClick={scrollToProducts}
                className="bg-[#2E1F0F] hover:bg-[#B8864E] text-white px-8 py-6 text-sm font-semibold rounded-none tracking-[0.1em] uppercase transition-colors duration-300 inline-flex items-center gap-3"
              >
                Kollektion entdecken
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Right side: product image with decorative shapes */}
          <div
            className={`relative flex items-center justify-center transform transition-all duration-1000 delay-300 ${
              isVisible ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"
            }`}
            style={{
              transform: `translate(${(mousePosition.x - 50) * 0.01}px, ${(mousePosition.y - 50) * 0.01}px)`,
            }}
          >
            {/* Decorative background shapes */}
            <div className="absolute top-8 right-8 w-64 h-64 bg-[#E8E0D5] rounded-none"></div>
            <div className="absolute bottom-8 left-8 w-48 h-48 bg-[#B8864E]/10 rounded-none"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-[#E8E0D5] rounded-none"></div>

            {/* Product image */}
            <div className="relative z-10">
              <img
                src="/condiment-flavor-based-chili-pepper.jpg"
                alt="GLUTWERK Premium Sauce"
                className="w-80 h-96 lg:w-96 lg:h-[480px] object-cover rounded-[32px] shadow-[0_32px_64px_rgba(46,31,15,0.18)]"
              />

              {/* Floating stat card top-left */}
              <div
                className={`absolute -left-8 top-12 bg-white border border-[#E8E0D5] px-5 py-4 shadow-lg transform transition-all duration-1000 delay-700 ${
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                }`}
              >
                <p className="text-2xl font-black text-[#2E1F0F] leading-none">12+</p>
                <p className="text-xs text-[#9B9189] mt-1 tracking-wider uppercase">Sorten</p>
              </div>

              {/* Floating stat card bottom-right */}
              <div
                className={`absolute -right-8 bottom-12 bg-white border border-[#E8E0D5] px-5 py-4 shadow-lg transform transition-all duration-1000 delay-900 ${
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                }`}
              >
                <p className="text-2xl font-black text-[#B8864E] leading-none">100%</p>
                <p className="text-xs text-[#9B9189] mt-1 tracking-wider uppercase">Natürlich</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom ticker */}
        <div
          className={`border-t border-[#E8E0D5] py-5 transform transition-all duration-1000 delay-500 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <p className="text-xs font-semibold tracking-[0.3em] uppercase text-[#9B9189] text-center">
            Qualität · Schärfe · Präzision
          </p>
        </div>
      </div>
    </section>
  )
}
