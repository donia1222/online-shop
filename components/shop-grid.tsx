"use client"

import { useState, useEffect, useRef, memo } from "react"
import {
  ShoppingCart, Star, ChevronLeft, ChevronRight,
  Search, SlidersHorizontal, X, Check, MapPin,
  ArrowUp, ChevronDown
} from "lucide-react"
import { ShoppingCartComponent } from "./shopping-cart"
import { CheckoutPage } from "@/components/checkout-page"

// ─── Types ────────────────────────────────────────────────────────────────────

interface Product {
  id: number; name: string; description: string; price: number
  image_url?: string; image_urls?: (string | null)[]
  heat_level: number; rating: number; badge: string
  origin: string; supplier?: string; category?: string; stock?: number
}
interface CartItem {
  id: number; name: string; price: number; image: string; image_url?: string
  description: string; heatLevel: number; rating: number
  badge?: string; origin?: string; quantity: number
}
interface Category { id: number; slug: string; name: string }

// ─── Component ────────────────────────────────────────────────────────────────

export default function ShopGrid() {
  const [products, setProducts]     = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState("")

  const [search, setSearch]                 = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [stockFilter, setStockFilter]       = useState<"all" | "out_of_stock">("all")
  const [sortBy, setSortBy]                 = useState<"default"|"name_asc"|"name_desc"|"price_asc"|"price_desc">("default")
  const [sidebarOpen, setSidebarOpen]       = useState(false)
  const [showBackTop, setShowBackTop]       = useState(false)

  const PAGE_SIZE = 20
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  const [cart, setCart]           = useState<CartItem[]>([])
  const [cartOpen, setCartOpen]   = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [addedIds, setAddedIds]   = useState<Set<number>>(new Set())
  const [currentView, setCurrentView] = useState<"products"|"checkout">("products")
  const [imgIndex, setImgIndex]   = useState<Record<number, number>>({})
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const API = process.env.NEXT_PUBLIC_API_BASE_URL

  useEffect(() => { loadProducts(); loadCategories(); loadCart() }, [])
  useEffect(() => { setVisibleCount(PAGE_SIZE) }, [search, activeCategory, stockFilter, sortBy])
  useEffect(() => {
    const onScroll = () => setShowBackTop(window.scrollY > 500)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${API}/get_products.php`)
      const data = await res.json()
      if (data.success) setProducts(data.products)
      else throw new Error(data.error)
    } catch (e: any) { setError(e.message || "Fehler") }
    finally { setLoading(false) }
  }
  const loadCategories = async () => {
    try {
      const res = await fetch(`${API}/get_categories.php`, { method: "POST" })
      const data = await res.json()
      if (data.success) setCategories(data.categories)
    } catch {}
  }
  const loadCart = () => {
    try {
      const saved = localStorage.getItem("cantina-cart")
      if (saved) {
        const data: CartItem[] = JSON.parse(saved)
        setCart(data); setCartCount(data.reduce((s, i) => s + i.quantity, 0))
        setAddedIds(new Set(data.map(i => i.id)))
      }
    } catch {}
  }
  const saveCart = (c: CartItem[]) => {
    localStorage.setItem("cantina-cart", JSON.stringify(c))
    localStorage.setItem("cantina-cart-count", c.reduce((s, i) => s + i.quantity, 0).toString())
  }
  const addToCart = (product: Product) => {
    if ((product.stock ?? 0) === 0) return
    setCart(prev => {
      const exists = prev.find(i => i.id === product.id)
      const next = exists
        ? prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)
        : [...prev, {
            id: product.id, name: product.name, price: product.price,
            image: getImages(product)[0] ?? "/placeholder.svg",
            image_url: getImages(product)[0], description: product.description,
            heatLevel: product.heat_level, rating: product.rating,
            badge: product.badge, origin: product.origin, quantity: 1,
          }]
      saveCart(next); setCartCount(next.reduce((s, i) => s + i.quantity, 0))
      return next
    })
    setAddedIds(prev => new Set([...prev, product.id]))
    setTimeout(() => setAddedIds(prev => { const s = new Set(prev); s.delete(product.id); return s }), 2000)
  }
  const removeFromCart = (id: number) => {
    setCart(prev => {
      const item = prev.find(i => i.id === id)
      const next = item && item.quantity > 1
        ? prev.map(i => i.id === id ? { ...i, quantity: i.quantity - 1 } : i)
        : prev.filter(i => i.id !== id)
      saveCart(next); setCartCount(next.reduce((s, i) => s + i.quantity, 0))
      return next
    })
  }
  const clearCart = () => {
    setCart([]); setCartCount(0)
    localStorage.removeItem("cantina-cart"); localStorage.removeItem("cantina-cart-count")
  }
  const getImages = (p: Product): string[] =>
    (p.image_urls ?? [p.image_url]).filter((u): u is string => !!u)

  const filtered = products
    .filter(p => {
      const matchSearch   = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase())
      const matchCategory = activeCategory === "all" || p.category === activeCategory
      const matchStock    = stockFilter === "out_of_stock" ? (p.stock ?? 0) === 0 : (p.stock ?? 0) > 0
      return matchSearch && matchCategory && matchStock
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name_asc":   return a.name.localeCompare(b.name)
        case "name_desc":  return b.name.localeCompare(a.name)
        case "price_asc":  return a.price - b.price
        case "price_desc": return b.price - a.price
        default: return 0
      }
    })

  const visibleProducts = filtered.slice(0, visibleCount)
  const hasMore = visibleCount < filtered.length

  // ─── Stars ────────────────────────────────────────────────────────────────
  const Stars = ({ rating }: { rating: number }) => (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} className={`w-3 h-3 ${i < Math.floor(rating) ? "fill-amber-400 text-amber-400" : "text-gray-200"}`} />
      ))}
    </div>
  )

  // ─── Product Card ─────────────────────────────────────────────────────────
  const ProductCard = memo(({ product }: { product: Product }) => {
    const images  = getImages(product)
    const idx     = imgIndex[product.id] ?? 0
    const inStock = (product.stock ?? 0) > 0
    const isAdded = addedIds.has(product.id)

    return (
      <div className="group bg-white rounded-2xl overflow-hidden flex flex-col shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200">
        {/* Image */}
        <div
          className="relative aspect-square bg-gray-50 overflow-hidden cursor-pointer"
          onClick={() => setSelectedProduct(product)}
        >
          <img
            src={images[idx] ?? "/placeholder.svg?height=300&width=300"}
            alt={product.name}
            className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-500"
            onError={e => { (e.target as HTMLImageElement).src = "/placeholder.svg?height=300&width=300" }}
          />

          {images.length > 1 && (
            <>
              <button
                onClick={e => { e.stopPropagation(); setImgIndex(p => ({ ...p, [product.id]: (idx - 1 + images.length) % images.length })) }}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white rounded-full w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-md"
              >
                <ChevronLeft className="w-3.5 h-3.5 text-gray-700" />
              </button>
              <button
                onClick={e => { e.stopPropagation(); setImgIndex(p => ({ ...p, [product.id]: (idx + 1) % images.length })) }}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white rounded-full w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-md"
              >
                <ChevronRight className="w-3.5 h-3.5 text-gray-700" />
              </button>
              {/* Dots */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                {images.map((_, i) => (
                  <div key={i} className={`rounded-full transition-all ${i === idx ? "w-4 h-1.5 bg-gray-800" : "w-1.5 h-1.5 bg-gray-400"}`} />
                ))}
              </div>
            </>
          )}

          {product.badge && (
            <span className="absolute top-2.5 left-2.5 bg-gray-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wide">
              {product.badge}
            </span>
          )}
        </div>

        {/* Details */}
        <div className="p-3.5 flex flex-col flex-1 gap-2">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest truncate">
            {product.supplier || product.origin || "—"}
          </p>

          <h3
            className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug cursor-pointer hover:text-gray-600 transition-colors"
            onClick={() => setSelectedProduct(product)}
          >
            {product.name}
          </h3>

          <div className="flex items-center gap-1.5">
            <Stars rating={product.rating} />
            <span className="text-[10px] text-gray-400 font-medium">{product.rating.toFixed(1)}</span>
          </div>

          <div className="mt-auto pt-2 flex items-center justify-between gap-2">
            <div>
              <span className="text-lg font-black text-gray-900 tracking-tight">{product.price.toFixed(2)}</span>
              <span className="text-xs text-gray-400 ml-1">CHF</span>
            </div>
            <button
              onClick={() => addToCart(product)}
              disabled={!inStock}
              className={`flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl transition-all duration-200 ${
                isAdded
                  ? "bg-emerald-500 text-white scale-95"
                  : inStock
                    ? "bg-blue-950 hover:bg-blue-900 text-white hover:scale-105 active:scale-95"
                    : "bg-gray-100 text-gray-300 cursor-not-allowed"
              }`}
            >
              {isAdded ? <Check className="w-3.5 h-3.5" /> : <ShoppingCart className="w-3.5 h-3.5" />}
              {isAdded ? "OK" : "Kaufen"}
            </button>
          </div>
        </div>
      </div>
    )
  })

  // ─── Detail Modal ─────────────────────────────────────────────────────────
  const DetailModal = ({ product }: { product: Product }) => {
    const images  = getImages(product)
    const [idx, setIdx] = useState(0)
    const inStock = (product.stock ?? 0) > 0
    return (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedProduct(null)}>
        <div className="bg-white w-full sm:max-w-3xl sm:rounded-3xl rounded-t-3xl max-h-[92vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
          {/* Handle bar mobile */}
          <div className="sm:hidden flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 bg-gray-200 rounded-full" />
          </div>
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="text-base font-bold text-gray-900 pr-4 line-clamp-1">{product.name}</h2>
            <button onClick={() => setSelectedProduct(null)} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="bg-gray-50 p-6 flex flex-col items-center">
              <img
                src={images[idx] ?? "/placeholder.svg?height=400&width=400"}
                alt={product.name}
                className="w-full max-w-xs aspect-square object-contain"
                onError={e => { (e.target as HTMLImageElement).src = "/placeholder.svg?height=400&width=400" }}
              />
              {images.length > 1 && (
                <div className="flex gap-2 mt-4">
                  {images.map((url, i) => (
                    <button key={i} onClick={() => setIdx(i)}
                      className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition-all ${i === idx ? "border-gray-900 scale-110" : "border-transparent opacity-60 hover:opacity-100"}`}>
                      <img src={url} alt="" className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="p-6 flex flex-col gap-4">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{product.supplier || product.origin}</p>
                <div className="flex items-center gap-2">
                  <Stars rating={product.rating} />
                  <span className="text-xs text-gray-500">{product.rating.toFixed(1)} / 5</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
              {product.origin && (
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{product.origin}</span>
                </div>
              )}
              <div className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full w-fit ${inStock ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-500"}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${inStock ? "bg-emerald-500" : "bg-red-400"}`} />
                {inStock ? `Auf Lager · ${product.stock} Stück` : "Nicht verfügbar"}
              </div>
              <div className="mt-auto pt-4 border-t border-gray-100">
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-3xl font-black text-gray-900 tracking-tight">{product.price.toFixed(2)}</span>
                  <span className="text-sm text-gray-400">CHF</span>
                </div>
                <button
                  onClick={() => { addToCart(product); setSelectedProduct(null) }}
                  disabled={!inStock}
                  className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 ${
                    inStock ? "bg-blue-950 hover:bg-blue-900 text-white hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-950/20" : "bg-gray-100 text-gray-300 cursor-not-allowed"
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  {inStock ? "In den Warenkorb" : "Ausverkauft"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ─── Views ────────────────────────────────────────────────────────────────
  if (currentView === "checkout") {
    return <CheckoutPage cart={cart} onBackToStore={() => setCurrentView("products")} onClearCart={clearCart} onAddToCart={(p: any) => addToCart(p)} onRemoveFromCart={removeFromCart} />
  }
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-[3px] border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-400 font-medium">Produkte werden geladen…</p>
        </div>
      </div>
    )
  }
  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 font-semibold mb-3">{error}</p>
          <button onClick={loadProducts} className="text-sm font-medium text-gray-600 underline">Erneut versuchen</button>
        </div>
      </div>
    )
  }

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <>
      <ShoppingCartComponent
        isOpen={cartOpen} onOpenChange={setCartOpen} cart={cart}
        onAddToCart={(p: any) => addToCart(p)} onRemoveFromCart={removeFromCart}
        onGoToCheckout={() => { setCartOpen(false); setCurrentView("checkout") }}
        onClearCart={clearCart}
      />

      {/* Floating cart */}
      <button
        onClick={() => setCartOpen(true)}
        className="fixed top-5 right-5 z-40 bg-blue-950 hover:bg-blue-900 text-white rounded-2xl p-3.5 shadow-xl transition-all hover:scale-110 active:scale-95"
      >
        <ShoppingCart className="w-5 h-5" />
        {cartCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
            {cartCount > 99 ? "99+" : cartCount}
          </span>
        )}
      </button>

      {/* Back to top */}
      {showBackTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-5 z-40 bg-white hover:bg-gray-50 text-gray-700 rounded-2xl p-3 shadow-xl border border-gray-200 transition-all hover:scale-110 active:scale-95"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      {selectedProduct && <DetailModal product={selectedProduct} />}

      <div className="min-h-screen bg-[#f7f7f8]">

        {/* ── Top bar ── */}
        <div className="bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-30 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-3">
            <span className="text-base font-black text-gray-900 tracking-tight hidden sm:block">Shop</span>

            <div className="flex-1 max-w-sm relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Suchen…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-sm bg-gray-100 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-gray-900/10 transition-all"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <span className="text-xs text-gray-400 font-medium hidden md:block">{filtered.length} Produkte</span>

            <button
              onClick={() => setSidebarOpen(p => !p)}
              className="ml-auto lg:hidden flex items-center gap-1.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-xl transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex gap-6">

          {/* ── Sidebar ── */}
          <aside className={`${sidebarOpen ? "block" : "hidden"} lg:block w-full lg:w-52 xl:w-60 flex-shrink-0 lg:sticky lg:top-20 lg:self-start`}>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-5">

              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Kategorien</p>
                <ul className="space-y-0.5">
                  {[{ slug: "all", name: "Alle" }, ...categories].map(cat => {
                    const count = cat.slug === "all" ? products.filter(p => (p.stock ?? 0) > 0).length : products.filter(p => p.category === cat.slug).length
                    const isActive = activeCategory === cat.slug
                    return (
                      <li key={cat.slug}>
                        <button
                          onClick={() => setActiveCategory(cat.slug)}
                          className={`w-full text-left flex items-center justify-between text-sm px-3 py-2 rounded-xl transition-all font-medium ${
                            isActive ? "bg-blue-950 text-white" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                          }`}
                        >
                          <span className="truncate">{cat.name}</span>
                          <span className={`text-[10px] font-bold ml-2 px-1.5 py-0.5 rounded-full ${isActive ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}>{count}</span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>

              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Verfügbarkeit</p>
                <ul className="space-y-0.5">
                  {([["all", "Auf Lager"], ["out_of_stock", "Ausverkauft"]] as const).map(([val, label]) => (
                    <li key={val}>
                      <button
                        onClick={() => setStockFilter(val)}
                        className={`w-full text-left text-sm px-3 py-2 rounded-xl transition-all font-medium ${
                          stockFilter === val ? "bg-blue-950 text-white" : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {(activeCategory !== "all" || stockFilter !== "all" || search) && (
                <button
                  onClick={() => { setActiveCategory("all"); setStockFilter("all"); setSearch("") }}
                  className="w-full text-xs font-semibold text-gray-400 hover:text-gray-700 transition-colors text-left"
                >
                  ✕ Filter zurücksetzen
                </button>
              )}
            </div>
          </aside>

          {/* ── Main ── */}
          <main className="flex-1 min-w-0">

            {/* Category chips */}
            <div className="overflow-x-auto mb-5 -mx-1 px-1">
              <div className="flex gap-2 min-w-max pb-1">
                {[{ slug: "all", name: "Alle" }, ...categories].map(cat => {
                  const isActive = activeCategory === cat.slug
                  return (
                    <button
                      key={cat.slug}
                      onClick={() => setActiveCategory(cat.slug)}
                      className={`px-4 py-2 text-sm font-semibold rounded-full transition-all whitespace-nowrap ${
                        isActive
                          ? "bg-blue-950 text-white shadow-md shadow-blue-950/20 scale-[1.03]"
                          : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {cat.name}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Sort + count */}
            <div className="flex items-center justify-between mb-4 gap-3">
              <p className="text-sm text-gray-500 font-medium">
                <span className="font-black text-gray-900">{filtered.length}</span> Produkte
              </p>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as typeof sortBy)}
                  className="appearance-none text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl pl-3 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900/10 cursor-pointer"
                >
                  <option value="default">Empfehlung</option>
                  <option value="name_asc">Name A–Z</option>
                  <option value="name_desc">Name Z–A</option>
                  <option value="price_asc">Preis ↑</option>
                  <option value="price_desc">Preis ↓</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-24">
                <p className="text-lg font-bold text-gray-300 mb-3">Keine Produkte gefunden</p>
                <button onClick={() => { setSearch(""); setActiveCategory("all"); setStockFilter("all") }} className="text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors">
                  Filter zurücksetzen
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                  {visibleProducts.map(product => <ProductCard key={product.id} product={product} />)}
                </div>

                {hasMore && (
                  <div className="text-center mt-10">
                    <button
                      onClick={() => setVisibleCount(c => c + PAGE_SIZE)}
                      className="inline-flex items-center gap-2 px-8 py-3.5 bg-white hover:bg-gray-900 hover:text-white text-gray-800 border border-gray-200 hover:border-gray-900 rounded-2xl text-sm font-bold transition-all duration-300 shadow-sm hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                    >
                      Mehr laden
                      <span className="bg-gray-100 text-gray-500 text-xs font-bold px-2 py-0.5 rounded-full group-hover:bg-white/20">
                        +{filtered.length - visibleCount}
                      </span>
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </>
  )
}
