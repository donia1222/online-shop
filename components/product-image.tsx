"use client"

import { useState, useEffect } from "react"
import { getResolvedImage, setResolvedImage } from "@/lib/product-cache"

const EXTENSIONS = [".jpg", ".JPG", ".jpeg", ".JPEG", ".png", ".webp", ".avif"]
const HAS_EXT = /\.(jpg|jpeg|png|gif|webp|svg|avif)$/i
const PLACEHOLDER = "/Security_n.png"

interface ProductImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src"> {
  src: string | null | undefined
  candidates?: string[]
  alt: string
  onAllFailed?: () => void
}

export function ProductImage({ src, candidates, alt, onAllFailed, ...props }: ProductImageProps) {
  const cacheKey = src || candidates?.[0] || ""
  const cached = cacheKey ? getResolvedImage(cacheKey) : undefined

  const urls: string[] = cached
    ? [cached]
    : candidates && candidates.length > 0
      ? candidates
      : src
        ? (() => {
            // Para cada URL base generamos variante original + filename en minúsculas
            // así funciona tanto 09CN007.jpg como 09cn007.jpg en servidor Linux
            const toLower = (u: string) => u.replace(/\/([^/?#]+)(\?.*)?$/, (_, f, q) => `/${f.toLowerCase()}${q ?? ""}`)
            if (HAS_EXT.test(src)) {
              const low = toLower(src)
              return low === src ? [src] : [src, low]
            }
            const variants: string[] = []
            for (const ext of EXTENSIONS) {
              variants.push(src + ext)
              const low = toLower(src) + ext
              if (low !== src + ext) variants.push(low)
            }
            return variants
          })()
        : []

  const [attempt, setAttempt] = useState(0)

  const allFailed = urls.length === 0 || attempt >= urls.length

  useEffect(() => {
    if (allFailed && onAllFailed) onAllFailed()
  }, [allFailed, onAllFailed])

  useEffect(() => {
    setAttempt(0)
  }, [src])

  if (allFailed) {
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
      loading="lazy"
      onLoad={() => {
        if (cacheKey && urls[attempt]) setResolvedImage(cacheKey, urls[attempt])
      }}
      onError={() => { setAttempt(a => a + 1) }}
      {...props}
    />
  )
}
