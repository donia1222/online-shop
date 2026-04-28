"use client"

import { useState, useEffect } from "react"
import imgManifestRaw from "@/lib/img-manifest.json"

const PLACEHOLDER = "/Security_n.png"
const manifest = imgManifestRaw as Record<string, string>

// Dado una URL (external usa/img o /img/ local), devuelve la ruta local exacta
// según el manifest, o null si no está en la carpeta local.
function resolveLocalExact(url: string): string | null {
  let folder: string
  let fileRaw: string

  if (url.startsWith("/img/")) {
    const m = url.match(/^\/img\/([^/]+)\/(.+)$/)
    if (!m) return null
    folder = m[1].toLowerCase()
    fileRaw = m[2]
  } else {
    const m = url.match(/^https?:\/\/web\.lweb\.ch\/usa\/img\/([^/]+)\/(.+)$/i)
    if (!m) return null
    folder = m[1].toLowerCase()
    fileRaw = m[2]
  }

  const fileNoExt = fileRaw.replace(/\.[^.]+$/, "").toLowerCase()
  return manifest[`${folder}/${fileNoExt}`] ?? null
}

function buildCandidates(src: string | null | undefined, candidates?: string[]): string[] {
  const inputs = candidates && candidates.length > 0 ? candidates : src ? [src] : []
  if (inputs.length === 0) return []

  const result: string[] = []
  const seen = new Set<string>()
  const add = (u: string) => { if (!seen.has(u)) { seen.add(u); result.push(u) } }

  for (const u of inputs) {
    const exact = resolveLocalExact(u)
    if (exact !== null) {
      // Imagen en manifest → ruta local exacta, sin 404
      add(exact)
    } else if (!u.match(/web\.lweb\.ch\/usa\/img\//i) && !u.startsWith("/img/")) {
      // URL externa no-usa/img (imagen subida manualmente) → usar directamente
      add(u)
    }
    // URL usa/img no encontrada en manifest → imagen no existe localmente → ignorar
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
