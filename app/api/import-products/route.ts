export const dynamic = "force-dynamic"

import { type NextRequest, NextResponse } from "next/server"
import * as XLSX from "xlsx"

// Convierte el nombre de una hoja en un slug de categoría
// "Messer 2026" → "messer-2026"  |  " Rauch+Grill 2026" → "rauch-grill-2026"
function toSlug(sheetName: string): string {
  return sheetName
    .trim()
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

// Busca el valor de una columna por posibles nombres de cabecera
function getCol(row: Record<string, unknown>, ...keys: string[]): unknown {
  for (const key of keys) {
    if (row[key] !== undefined && row[key] !== null && row[key] !== "") {
      return row[key]
    }
  }
  return undefined
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ success: false, error: "No se recibió ningún archivo" }, { status: 400 })
    }

    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      return NextResponse.json({ success: false, error: "El archivo debe ser .xlsx o .xls" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const workbook = XLSX.read(buffer, { type: "buffer" })

    const allProducts: object[] = []

    for (const sheetName of workbook.SheetNames) {
      const ws = workbook.Sheets[sheetName]
      const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, { defval: "" })

      const categorySlug = toSlug(sheetName)
      const categoryName = sheetName.trim()

      for (const row of rows) {
        const id = getCol(row, "Artikel-Nr.", "ID", "id")
        const name = getCol(row, "Name", "name")

        // Omitir filas sin ID o nombre
        if (!id || !name) continue

        const numId = parseInt(String(id), 10)
        if (isNaN(numId) || numId <= 0) continue

        const price = parseFloat(String(getCol(row, "Preis inkl. MwSt.", "Preis zzgl. MwSt.") ?? 0)) || 0
        const stock = parseInt(String(getCol(row, "Lager", "Lagerbestand") ?? 0), 10) || 0
        const description = String(getCol(row, "Beschreibung") ?? "").trim()
        const supplier = String(getCol(row, "Lieferant") ?? "").trim()
        const origin = String(getCol(row, "Hersteller") ?? "").trim()

        allProducts.push({
          id: numId,
          name: String(name).trim(),
          description,
          price,
          stock,
          supplier,
          origin,
          category: categorySlug,
          category_name: categoryName,
        })
      }
    }

    if (allProducts.length === 0) {
      return NextResponse.json({ success: false, error: "No se encontraron productos válidos en el archivo" }, { status: 400 })
    }

    // Enviar al endpoint PHP
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL
    const phpResponse = await fetch(`${apiBase}/import_products.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ products: allProducts }),
    })

    const result = await phpResponse.json()

    return NextResponse.json({
      ...result,
      parsed: allProducts.length,
    })
  } catch (error) {
    console.error("Error importando productos:", error)
    return NextResponse.json({ success: false, error: "Error interno al procesar el archivo" }, { status: 500 })
  }
}
