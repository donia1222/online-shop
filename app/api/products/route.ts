import { NextRequest, NextResponse } from "next/server"

const PHP_BASE = process.env.NEXT_PUBLIC_API_BASE_URL + "/get_products.php"
const CACHE_TTL = 60_000 // 60 segundos

const cache = new Map<string, { data: unknown; at: number }>()
// Single-flight: si ya hay una petición en vuelo para la misma key, espera su resultado
const inflight = new Map<string, Promise<unknown>>()

export async function GET(req: NextRequest) {
  // Ignorar parámetro cache-buster _= para que no genere clave única cada vez
  const params = req.nextUrl.searchParams
  params.delete("_")
  const qs = params.toString()
  const url = qs ? `${PHP_BASE}?${qs}` : PHP_BASE
  const hit = cache.get(qs)

  if (hit && Date.now() - hit.at < CACHE_TTL) {
    return NextResponse.json(hit.data)
  }

  // Si ya hay una petición en vuelo para esta key, esperar su resultado
  const existing = inflight.get(qs)
  if (existing) {
    try {
      const data = await existing
      return NextResponse.json(data)
    } catch {
      if (hit) return NextResponse.json(hit.data)
      return NextResponse.json({ success: false, error: "upstream error" }, { status: 502 })
    }
  }

  const promise = fetch(url, { cache: "no-store" })
    .then(async (res) => {
      if (!res.ok) throw new Error(`${res.status}`)
      const data = await res.json()
      cache.set(qs, { data, at: Date.now() })
      return data
    })
    .finally(() => inflight.delete(qs))

  inflight.set(qs, promise)

  try {
    const data = await promise
    return NextResponse.json(data)
  } catch (e: any) {
    if (hit) return NextResponse.json(hit.data)
    return NextResponse.json({ success: false, error: e.message }, { status: 502 })
  }
}
