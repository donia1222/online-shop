"use client"

import { useState, useEffect } from "react"
import { Home, ShoppingBag, Package, Sparkles, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { AdminAuth } from "./admin-auth"
import { LoginAuth } from "./login-auth"
import { UserProfile } from "./user-profile"

interface HeaderProps {
  onAdminOpen: () => void
}

// Componente personalizado para icono de chili
const ChiliIcon = ({ className }: { className?: string }) => (
  <div className={`relative ${className}`}>
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-full h-full"
    >
      <path d="M12 2c0 0 2 1 2 3" stroke="currentColor" fill="none" />
      <path
        d="M10 5c-2 0-4 2-4 5s1 6 2 8c1 2 3 3 4 3s3-1 4-3c1-2 2-5 2-8s-2-5-4-5c-1 0-2 0-4 0z"
        fill="currentColor"
        opacity="0.8"
      />
      <path d="M11 8c0 2 0 4 1 6" stroke="white" strokeWidth="1" opacity="0.3" />
      <path d="M13 9c0 1.5 0 3 1 4" stroke="white" strokeWidth="1" opacity="0.2" />
      <circle cx="16" cy="7" r="0.5" fill="orange" opacity="0.8" />
      <circle cx="18" cy="9" r="0.3" fill="red" opacity="0.6" />
      <circle cx="17" cy="11" r="0.4" fill="orange" opacity="0.7" />
    </svg>
  </div>
)

// Componente personalizado para icono de BBQ
const BBQIcon = ({ className }: { className?: string }) => (
  <div className={`relative ${className}`}>
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-full h-full"
    >
      <rect x="3" y="11" width="18" height="8" rx="2" />
      <line x1="6" y1="11" x2="6" y2="19" />
      <line x1="10" y1="11" x2="10" y2="19" />
      <line x1="14" y1="11" x2="14" y2="19" />
      <line x1="18" y1="11" x2="18" y2="19" />
      <ellipse cx="12" cy="8" rx="4" ry="2" fill="currentColor" opacity="0.7" />
      <path d="M8 5c0-1 1-2 2-2s2 1 2 2-1 2-2 2-2-1-2-2z" opacity="0.5" />
      <path d="M14 4c0-1 1-2 2-2s2 1 2 2-1 2-2 2-2-1-2-2z" opacity="0.5" />
    </svg>
  </div>
)

export function Header({ onAdminOpen }: HeaderProps) {
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
    },
    {
      id: "spice-discovery",
      label: "Entdecken",
      icon: Sparkles,
      description: "Produkte entdecken",
    },
    {
      id: "offers",
      label: "Kollektion",
      icon: ShoppingBag,
      description: "Unsere Kollektion",
    },
    {
      id: "recipes",
      label: "Inspiration",
      icon: Package,
      description: "Stil & Pflege",
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

                    <nav className="space-y-2 relative">
                      {navItems.map((item, index) => {
                        const IconComponent = item.icon
                        const isActive = currentSection === item.id

                        return (
                          <button
                            key={item.id}
                            onClick={() => scrollToSection(item.id)}
                            className={`w-full group flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-300 ${
                              isActive
                                ? `bg-[#2E1F0F] text-white`
                                : `text-[#2E1F0F] hover:bg-[#F9F7F4] hover:text-[#B8864E]`
                            }`}
                            style={{ animationDelay: `${index * 100}ms` }}
                          >
                            <div
                              className={`p-2 flex items-center justify-center w-9 h-9 rounded-lg flex-shrink-0 ${
                                isActive ? "bg-white/20" : "bg-[#F9F7F4] group-hover:bg-[#E8E0D5]"
                              }`}
                            >
                              <div className="w-5 h-5 text-[#B8864E] transition-all duration-300">
                                <IconComponent className="w-5 h-5" />
                              </div>
                            </div>

                            <div className="flex-1">
                              <span className="font-semibold tracking-wide block">{item.label}</span>
                              <span className={`text-xs block ${isActive ? "text-white/60" : "text-[#9B9189]"}`}>
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

            {/* Navigation Desktop - Ahora centrado */}
            <nav className="hidden lg:flex items-center space-x-2 flex-1 justify-center">
              {navItems.map((item) => {
                const IconComponent = item.icon
                const isActive = currentSection === item.id

                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`group relative flex items-center space-x-2 px-4 py-2.5 rounded-lg transition-all duration-300 ${
                      isActive
                        ? `bg-[#2E1F0F] text-white`
                        : `text-[#2E1F0F] hover:bg-[#F9F7F4] hover:text-[#B8864E]`
                    }`}
                    title={item.description}
                  >
                    <div className={`w-4 h-4 transition-all duration-300 ${isActive ? "text-[#B8864E]" : "text-[#B8864E]"}`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-sm tracking-wide">{item.label}</span>
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
