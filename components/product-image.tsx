"use client"

import { useState, useEffect } from "react"

const PLACEHOLDER = "/Security_n.png"
const HAS_EXT = /\.(jpg|jpeg|png|gif|webp|svg|avif)$/i
const EXTS = [".jpg", ".JPG", ".jpeg", ".png", ".webp"]

// Convierte URL externa → ruta local /img/categoria/archivo.jpg
function toLocalPath(url: string): string | null {
  if (!url) return null
  if (url.startsWith("/img/")) return url
  const m = url.match(/^https?:\/\/web\.lweb\.ch\/usa\/img\/([^/]+)\/(.+)$/i)
  if (!m) return null
  return `/img/${m[1].toLowerCase()}/${m[2]}`
}

function buildCandidates(src: string | null | undefined, candidates?: string[]): string[] {
  const inputs = candidates && candidates.length > 0 ? candidates : src ? [src] : []
  if (inputs.length === 0) return []

  const result: string[] = []
  for (const u of inputs) {
    const local = toLocalPath(u)
    if (local) {
      // local primero
      if (HAS_EXT.test(local)) {
        result.push(local)
        const lower = local.replace(/\/([^/]+)$/, (_, f) => `/${f.toLowerCase()}`)
        if (lower !== local) result.push(lower)
      } else {
        for (const ext of EXTS) result.push(local + ext)
      }
    }
    // URL externa como fallback si no estaba ya en la lista
    if (!u.startsWith("/img/") && !result.includes(u)) {
      result.push(u)
    }
  }
  return result
}

interface ProductImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src"> {
  src: string | null | undefined
  candidates?: string[]
  alt: string
  onAllFailed?: () => void
}

export function ProductImage({ src, candidates, alt, onAllFailed, ...props }: ProductImageProps) {
  const urls = buildCandidates(src, candidates)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => { setAttempt(0) }, [src])

  const failed = urls.length === 0 || attempt >= urls.length

  useEffect(() => {
    if (failed && onAllFailed) onAllFailed()
  }, [failed, onAllFailed])

  if (failed) {
    const { className, ...rest } = props
    return (
      <img
        src={PLACEHOLDER}
        alt={alt}
        className={`object-contain p-4 bg-[#F5F5F5] ${className ?? ""}`}
        {...rest}
      />
    )
  }

  return (
    <img
      src={urls[attempt]}
      alt={alt}
      onError={() => setAttempt(a => a + 1)}
      {...props}
    />
  )
}
