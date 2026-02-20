"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Home, ShoppingBag, Flame, Compass, Grid3X3, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { AdminAuth } from "./admin-auth"
import { LoginAuth } from "./login-auth"
import { UserProfile } from "./user-profile"

interface HeaderProps {
  onAdminOpen: () => void
}

export function Header({ onAdminOpen }: HeaderProps) {
  const router = useRouter()
  // Estados del header y navegación
  const [showHeader, setShowHeader] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [currentSection, setCurrentSection] = useState("hero")
  const [showUserProfile, setShowUserProfile] = useState(false)
  // Secciones con fondo claro
  const lightSections = ["premium-showcase", "offers"]
  // Secciones con fondo oscuro
  const darkSections = ["spice-discovery"]
  const isLightSection = lightSections.includes(currentSection)
  const isDarkSection = darkSections.includes(currentSection)

  // Detecta la sección actual basada en el scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Lógica para ocultar/mostrar header
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setShowHeader(false)
      } else {
        setShowHeader(true)
      }
      setLastScrollY(currentScrollY)

      // Detectar sección actual
      const sections = ["hero", "premium-showcase", "offers", "recipes", "pairing"]
      const sectionElements = sections.map((id) => ({
        id,
        element: document.getElementById(id),
        offset: document.getElementById(id)?.offsetTop || 0,
      }))

      const currentSectionId =
        sectionElements.find((section, index) => {
          const nextSection = sectionElements[index + 1]
          const sectionTop = section.offset - 100 // Offset para el header
          const sectionBottom = nextSection ? nextSection.offset - 100 : Number.POSITIVE_INFINITY
          return currentScrollY >= sectionTop && currentScrollY < sectionBottom
        })?.id || "hero"

      setCurrentSection(currentSectionId)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      setIsMenuOpen(false)
    }
  }

  const navItems = [
    {
      id: "hero",
      label: "Startseite",
      icon: Home,
      description: "Zur Hauptseite",
      href: null,
      color: "bg-amber-50 text-amber-700",
    },
    {
      id: "spice-discovery",
      label: "Entdecken",
      icon: Compass,
      description: "Produkte entdecken",
      href: null,
      color: "bg-blue-50 text-blue-700",
    },
    {
      id: "produkte",
      label: "Produkte",
      icon: Grid3X3,
      description: "Alle Produkte",
      href: "/shop",
      color: "bg-violet-50 text-violet-700",
    },
    {
      id: "offers",
      label: "Kollektion",
      icon: ShoppingBag,
      description: "Unsere Kollektion",
      href: "/shop",
      color: "bg-emerald-50 text-emerald-700",
    },
    {
      id: "recipes",
      label: "Inspiration",
      icon: Flame,
      description: "Stil & Schärfe",
      href: null,
      color: "bg-red-50 text-red-600",
    },
  ]

  // Estilos dinámicos basados en la sección actual
  const headerStyles = "bg-white/95 backdrop-blur-xl border-b border-[#E8E0D5] shadow-sm"

  const menuStyles = "bg-white border-r border-[#E8E0D5] shadow-xl"

  const textColor = "text-[#9B9189]"
  const textColorHover = "hover:text-[#2E1F0F]"

  const handleLoginSuccess = (user: any) => {
    console.log("Usuario logueado en header:", user)
    // Aquí puedes manejar el estado global del usuario si es necesario
  }

  const handleLogout = () => {
    console.log("Usuario deslogueado en header")
    // Aquí puedes limpiar el estado global del usuario si es necesario
  }

  const handleShowProfile = () => {
    setShowUserProfile(true)
    setIsMenuOpen(false) // Cerrar menú móvil al abrir perfil
  }

  const handleProfileClose = () => {
    setShowUserProfile(false)
  }

  return (
    <>
      <header
        className={`
          fixed top-0 left-0 w-full z-50
          ${headerStyles}
          transform transition-all duration-500 ease-out
          ${showHeader ? "translate-y-0" : "-translate-y-full"}
        `}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo + Admin Button + Login Button Desktop */}
            <div className="hidden lg:flex items-center space-x-4">
              <div className="w-10 h-10 bg-[#2E1F0F] flex items-center justify-center">
                <span className="text-[#B8864E] font-black text-xs tracking-wider">GW</span>
              </div>

              <div className="space-y-1">
                <h1 className="text-2xl font-black text-[#2E1F0F] tracking-tight leading-none">
                  GLUTWERK
                </h1>
                <p className="text-xs font-medium tracking-[0.15em] uppercase text-[#B8864E]">
                  Handwerk · Schärfe · Präzision
                </p>
              </div>
            </div>

            {/* Mobile Layout - Todos los botones a la izquierda */}
            <div className="lg:hidden flex items-center justify-between w-full">
              {/* Logo + Admin Button + Login Button + Menu Button (todos a la izquierda) */}
              <div className="flex items-center space-x-3">
                {/* Logo Mobile */}
                <div className="w-10 h-10 bg-[#2E1F0F] flex items-center justify-center">
                  <span className="text-[#B8864E] font-black text-xs tracking-wider">GW</span>
                </div>

                {/* Menu Button - Al final */}
                <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                  <SheetTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative p-2.5 rounded-xl border transition-all duration-300 bg-[#F9F7F4] hover:bg-[#E8E0D5] text-[#2E1F0F] border-[#E8E0D5]"
                    >
                      <Menu className="w-4 h-4" />
                      <span className="sr-only">Menü öffnen</span>
                    </Button>
                  </SheetTrigger>

                  <SheetContent side="left" className={`w-80 ${menuStyles}`}>
                    {/* Background overlay */}
                    <div className="absolute inset-0 pointer-events-none"></div>

                    <SheetHeader className="relative pb-6 mb-8 border-b border-[#E8E0D5]">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-[#2E1F0F] flex items-center justify-center">
                            <span className="text-[#B8864E] font-black text-xs tracking-wider">GW</span>
                          </div>
                          <div>
                            <SheetTitle className="text-xl font-black text-[#2E1F0F] tracking-tight">
                              GLUTWERK
                            </SheetTitle>
                            <p className="text-xs font-medium tracking-[0.15em] uppercase text-[#B8864E]">
                              Handwerk · Schärfe · Präzision
                            </p>
                          </div>
                        </div>

                        <SheetClose asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-xl transition-all duration-300 bg-[#F9F7F4] hover:bg-[#E8E0D5] text-[#9B9189] hover:text-[#2E1F0F]"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </SheetClose>
                      </div>

                      {/* Login en el menú móvil */}
                      <div className="mt-4 pt-4 border-t border-[#E8E0D5]">
                        <LoginAuth
                          onLoginSuccess={handleLoginSuccess}
                          onLogout={handleLogout}
                          isLightSection={isLightSection}
                          onShowProfile={handleShowProfile}
                          variant="inline"
                          buttonText="Anmelden"
                          className="w-full"
                        />
                      </div>
                    </SheetHeader>

                    <nav className="space-y-1.5 relative">
                      {navItems.map((item, index) => {
                        const IconComponent = item.icon
                        const isActive = item.href ? false : currentSection === item.id

                        return (
                          <button
                            key={item.id}
                            onClick={() => { item.href ? router.push(item.href) : scrollToSection(item.id); setIsMenuOpen(false) }}
                            className={`w-full group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                              isActive
                                ? "bg-[#2E1F0F] text-white"
                                : "text-[#2E1F0F] hover:bg-[#F9F7F4]"
                            }`}
                            style={{ animationDelay: `${index * 60}ms` }}
                          >
                            <span className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                              isActive ? "bg-white/20" : item.color
                            }`}>
                              <IconComponent className="w-4 h-4" />
                            </span>
                            <div className="flex-1 text-left">
                              <span className="font-semibold text-sm block">{item.label}</span>
                              <span className={`text-xs ${isActive ? "text-white/60" : "text-[#9B9189]"}`}>
                                {item.description}
                              </span>
                            </div>
                          </button>
                        )
                      })}
                    </nav>

                    {/* Footer Info */}
                    <div className="absolute bottom-8 left-6 right-6">
                      <div className="relative rounded-none p-5 border overflow-hidden bg-[#F9F7F4] border-[#E8E0D5]">
                        <div className="relative z-10 text-center">
                          <p className="text-sm font-semibold text-[#2E1F0F] tracking-wider uppercase">
                            GLUTWERK
                          </p>
                          <p className="text-xs mt-1 text-[#9B9189] tracking-[0.1em]">
                            Handwerk · Schärfe · Präzision
                          </p>
                        </div>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              <div></div>
            </div>

            {/* Navigation Desktop */}
            <nav className="hidden lg:flex items-center gap-2 flex-1 justify-center">
              {navItems.map((item) => {
                const IconComponent = item.icon
                const isActive = item.href ? false : currentSection === item.id

                return (
                  <button
                    key={item.id}
                    onClick={() => item.href ? router.push(item.href) : scrollToSection(item.id)}
                    title={item.description}
                    className={`group flex items-center gap-2.5 pl-2 pr-4 py-1.5 rounded-full border transition-all duration-200 ${
                      isActive
                        ? "bg-[#2E1F0F] border-[#2E1F0F] text-white shadow-md"
                        : "bg-white border-[#E8E0D5] text-[#2E1F0F] hover:border-[#B8864E] hover:shadow-sm"
                    }`}
                  >
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                      isActive ? "bg-white/20" : item.color
                    }`}>
                      <IconComponent className="w-3.5 h-3.5" />
                    </span>
                    <span className="text-sm font-semibold tracking-wide whitespace-nowrap">{item.label}</span>
                  </button>
                )
              })}
            </nav>

            {/* Login button - Desktop derecha */}
            <div className="hidden lg:flex items-center">
              <div className="bg-[#F9F7F4] border border-[#E8E0D5] shadow-sm">
                <LoginAuth
                  onLoginSuccess={handleLoginSuccess}
                  onLogout={handleLogout}
                  onShowProfile={handleShowProfile}
                  isLightSection={isLightSection}
                  variant="button"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom border line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-[#E8E0D5]"></div>
      </header>

      {/* User Profile Modal */}
      {showUserProfile && (
        <UserProfile
          onClose={handleProfileClose}
          onAccountDeleted={() => {
            setShowUserProfile(false)
          }}
        />
      )}
    </>
  )
}
