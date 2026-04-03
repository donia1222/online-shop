import { Suspense } from "react"
import GutscheineGrid from "@/components/gutscheine-grid"

export const metadata = {
  title: "Geschenkgutscheine – US-Fishing & Huntingshop",
  description: "Verschenken Sie Freude mit einem Gutschein von US-Fishing & Huntingshop.",
}

export default function GutscheinePage() {
  return (
    <Suspense>
      <GutscheineGrid />
    </Suspense>
  )
}
