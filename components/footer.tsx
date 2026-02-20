"use client"

import { Truck, Shield, MapPin, CreditCard, Phone, Mail, Heart, ExternalLink } from "lucide-react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AdminLoginButton } from "@/components/admin-auth"

interface FooterProps {
  onAdminOpen?: () => void
}

export function Footer({ onAdminOpen }: FooterProps = {}) {
  const [openModal, setOpenModal] = useState<string | null>(null)

  const legalContent = {
    agb: {
      title: "Allgemeine Geschäftsbedingungen",
      content: `
        1. Geltungsbereich
        Diese Allgemeinen Geschäftsbedingungen gelten für alle Bestellungen über unseren Online-Shop.

        2. Vertragsschluss
        Der Vertrag kommt durch Ihre Bestellung und unsere Auftragsbestätigung zustande.

        3. Preise und Zahlung
        Alle Preise verstehen sich in CHF inklusive der gesetzlichen Mehrwertsteuer.
        Zahlung erfolgt per PayPal, Kreditkarte oder Banküberweisung.

        4. Lieferung
        Wir liefern nur innerhalb der Schweiz.
        Die Lieferzeit beträgt 1-3 Werktage.
        Versandkosten werden bei Bestellungen unter 50 CHF erhoben.

        5. Widerrufsrecht
        Sie haben das Recht, binnen 14 Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen.

        6. Gewährleistung
        Es gelten die gesetzlichen Gewährleistungsbestimmungen.
      `,
    },
    datenschutz: {
      title: "Datenschutzrichtlinie",
      content: `
        1. Datenerhebung
        Wir erheben nur die für die Bestellabwicklung notwendigen Daten.

        2. Verwendung der Daten
        Ihre Daten werden ausschließlich zur Bestellabwicklung verwendet.

        3. Datenweitergabe
        Eine Weitergabe an Dritte erfolgt nur zur Bestellabwicklung (Versanddienstleister).

        4. Datensicherheit
        Wir verwenden SSL-Verschlüsselung zum Schutz Ihrer Daten.

        5. Ihre Rechte
        Sie haben das Recht auf Auskunft, Berichtigung und Löschung Ihrer Daten.

        6. Kontakt
        Bei Fragen zum Datenschutz kontaktieren Sie uns unter info@lweb.ch
      `,
    },
    rueckgabe: {
      title: "Rückgaberichtlinie",
      content: `
        1. Rückgaberecht
        Sie können Artikel innerhalb von 14 Tagen nach Erhalt zurückgeben.

        2. Zustand der Ware
        Die Ware muss sich in originalem, unbenutztem Zustand befinden.

        3. Rückgabeprozess
        Kontaktieren Sie uns vor der Rücksendung unter info@lweb.ch

        4. Rücksendekosten
        Die Kosten für die Rücksendung trägt der Kunde.

        5. Erstattung
        Die Erstattung erfolgt innerhalb von 14 Tagen nach Erhalt der Rücksendung.

        6. Ausnahmen
        Aus hygienischen Gründen können geöffnete Lebensmittel nicht zurückgenommen werden.
      `,
    },
  }

  return (
    <footer className="relative bg-[#EDE8E0] overflow-hidden">
      {/* Bottom accent line top */}
      <div className="h-[2px] bg-[#B8864E]"></div>

      <div className="relative container mx-auto px-4 py-16">
        {/* Top Section with Brand */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <h2 className="text-4xl font-black text-[#2E1F0F]">
              GLUTWERK
            </h2>
          </div>
          <p className="text-lg text-[#9B9189] max-w-2xl mx-auto">
            Handwerkliche Saucen. Direkt zu Ihnen.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Shipping Information */}
          <div className="group">
            <div className="bg-white border border-[#E8E0D5] rounded-2xl p-6 hover:border-[#B8864E] transition-all duration-300 hover:shadow-lg h-full">
              <h3 className="text-xl font-bold flex items-center gap-3 mb-6 text-[#2E1F0F] transition-colors">
                <div className="p-2 bg-[#F9F7F4] rounded-lg">
                  <Truck className="h-6 w-6 text-[#B8864E]" />
                </div>
                Versand
              </h3>
              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3 text-[#9B9189] hover:text-[#B8864E] transition-colors">
                  <MapPin className="h-5 w-5 text-[#B8864E] mt-0.5 flex-shrink-0" />
                  <span>Schweizweite Lieferung mit A-Post</span>
                </div>
                <div className="flex items-start gap-3 text-[#9B9189] hover:text-[#B8864E] transition-colors">
                  <Shield className="h-5 w-5 text-[#B8864E] mt-0.5 flex-shrink-0" />
                  <span>Kostenloser Versand ab 50 CHF</span>
                </div>
                <div className="bg-[#F9F7F4] border border-[#E8E0D5] rounded-lg p-3 mt-4">
                  <p className="text-[#B8864E] font-medium text-xs">Express-Lieferung: 1-3 Werktage</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="group">
            <div className="bg-white border border-[#E8E0D5] rounded-2xl p-6 hover:border-[#B8864E] transition-all duration-300 hover:shadow-lg h-full">
              <h3 className="text-xl font-bold flex items-center gap-3 mb-6 text-[#2E1F0F] transition-colors">
                <div className="p-2 bg-[#F9F7F4] rounded-lg">
                  <CreditCard className="h-6 w-6 text-[#B8864E]" />
                </div>
                Sichere Zahlung
              </h3>
              <div className="space-y-4 text-sm">
                <div className="flex items-center gap-3 text-[#9B9189] hover:text-[#B8864E] transition-colors">
                  <div className="w-8 h-8 bg-[#2E1F0F] rounded flex items-center justify-center text-white font-bold text-xs">PP</div>
                  <span>PayPal - 100% sicher</span>
                </div>
                <div className="flex items-center gap-3 text-[#9B9189] hover:text-[#B8864E] transition-colors">
                  <CreditCard className="h-5 w-5 text-[#B8864E]" />
                  <span>Kredit- und Debitkarten</span>
                </div>
                <div className="flex items-center gap-3 text-[#9B9189] hover:text-[#B8864E] transition-colors">
                  <Shield className="h-5 w-5 text-[#B8864E]" />
                  <span>Sichere Banküberweisung</span>
                </div>
                <div className="bg-[#F9F7F4] border border-[#E8E0D5] rounded-lg p-3 mt-4">
                  <p className="text-[#B8864E] font-medium text-xs">SSL-verschlüsselt &amp; geschützt</p>
                </div>
              </div>
            </div>
          </div>

          {/* Company Info */}
          <div className="group">
            <div className="bg-white border border-[#E8E0D5] rounded-2xl p-6 hover:border-[#B8864E] transition-all duration-300 hover:shadow-lg h-full">
              <h3 className="text-xl font-bold flex items-center gap-3 mb-6 text-[#2E1F0F] transition-colors">
                <div className="p-2 bg-[#F9F7F4] rounded-lg">
                  <Heart className="h-6 w-6 text-[#B8864E]" />
                </div>
                Über Uns
              </h3>
              <div className="space-y-4 text-sm">
                <p className="text-[#9B9189] leading-relaxed">Premium handwerkliche Saucen direkt aus den USA importiert</p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-[#9B9189] hover:text-[#B8864E] transition-colors group/item">
                    <Mail className="h-4 w-4 text-[#B8864E] group-hover/item:text-[#B8864E]" />
                    <a href="mailto:info@lweb.ch" className="hover:text-[#B8864E] transition-colors">
                      info@lweb.ch
                    </a>
                  </div>
                  <div className="flex items-center gap-3 text-[#9B9189] hover:text-[#B8864E] transition-colors group/item">
                    <Phone className="h-4 w-4 text-[#B8864E] group-hover/item:text-[#B8864E]" />
                    <a href="tel:+41765608645" className="hover:text-[#B8864E] transition-colors">
                      +41 76 560 86 45
                    </a>
                  </div>
                </div>
                <div className="bg-[#F9F7F4] border border-[#E8E0D5] rounded-lg p-3 mt-4">
                  <p className="text-[#B8864E] font-medium text-xs">Handwerk. Schärfe. Präzision.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Legal & Support */}
          <div className="group">
            <div className="bg-white border border-[#E8E0D5] rounded-2xl p-6 hover:border-[#B8864E] transition-all duration-300 hover:shadow-lg h-full">
              <h3 className="text-xl font-bold flex items-center gap-3 mb-6 text-[#2E1F0F] transition-colors">
                <div className="p-2 bg-[#F9F7F4] rounded-lg">
                  <Shield className="h-6 w-6 text-[#B8864E]" />
                </div>
                Support &amp; Recht
              </h3>
              <div className="space-y-4 text-sm">
                <div>
                  <Dialog open={openModal === "agb"} onOpenChange={(open) => setOpenModal(open ? "agb" : null)}>
                    <DialogTrigger asChild>
                      <button className="flex items-center gap-2 w-full text-left text-[#9B9189] hover:text-[#B8864E] transition-colors group/btn">
                        <ExternalLink className="h-4 w-4 opacity-60 group-hover/btn:opacity-100" />
                        Allgemeine Geschäftsbedingungen
                      </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-white border-[#E8E0D5]">
                      <DialogHeader>
                        <DialogTitle className="text-[#2E1F0F]">{legalContent.agb.title}</DialogTitle>
                      </DialogHeader>
                      <div className="whitespace-pre-line text-sm text-[#9B9189]">
                        {legalContent.agb.content}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div>
                  <Dialog
                    open={openModal === "datenschutz"}
                    onOpenChange={(open) => setOpenModal(open ? "datenschutz" : null)}
                  >
                    <DialogTrigger asChild>
                      <button className="flex items-center gap-2 w-full text-left text-[#9B9189] hover:text-[#B8864E] transition-colors group/btn">
                        <ExternalLink className="h-4 w-4 opacity-60 group-hover/btn:opacity-100" />
                        Datenschutzrichtlinie
                      </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-white border-[#E8E0D5]">
                      <DialogHeader>
                        <DialogTitle className="text-[#2E1F0F]">{legalContent.datenschutz.title}</DialogTitle>
                      </DialogHeader>
                      <div className="whitespace-pre-line text-sm text-[#9B9189]">
                        {legalContent.datenschutz.content}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div>
                  <Dialog
                    open={openModal === "rueckgabe"}
                    onOpenChange={(open) => setOpenModal(open ? "rueckgabe" : null)}
                  >
                    <DialogTrigger asChild>
                      <button className="flex items-center gap-2 w-full text-left text-[#9B9189] hover:text-[#B8864E] transition-colors group/btn">
                        <ExternalLink className="h-4 w-4 opacity-60 group-hover/btn:opacity-100" />
                        Rückgaberichtlinie
                      </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-white border-[#E8E0D5]">
                      <DialogHeader>
                        <DialogTitle className="text-[#2E1F0F]">{legalContent.rueckgabe.title}</DialogTitle>
                      </DialogHeader>
                      <div className="whitespace-pre-line text-sm text-[#9B9189]">
                        {legalContent.rueckgabe.content}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="bg-[#F9F7F4] border border-[#E8E0D5] rounded-lg p-3 mt-4">
                  <p className="text-[#B8864E] font-medium text-xs">Schneller Kundenservice</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Credits and Design Info */}
        <div className="border-t border-[#E8E0D5] pt-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="bg-white rounded-xl p-4 border border-[#E8E0D5]">
              <p className="text-[#9B9189] flex items-center gap-2">
                <strong className="text-[#2E1F0F]">Bildnachweis:</strong> Einige Bilder stammen von Freepik
              </p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-[#E8E0D5]">
              <p className="text-[#9B9189] flex items-center gap-2">
                <strong className="text-[#2E1F0F]">Webseite Design:</strong>{" "}
                <a
                  href="https://lweb.ch"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#B8864E] hover:text-[#2E1F0F] transition-colors font-medium"
                >
                  lweb.ch
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#E8E0D5] pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <p className="text-[#9B9189] text-sm">© 2026 GLUTWERK. Alle Rechte vorbehalten.</p>
              <p className="text-xs text-[#9B9189] mt-1">Handwerk. Schärfe. Präzision.</p>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2 bg-white border border-[#E8E0D5] px-4 py-2 rounded-full text-[#9B9189]">
                <MapPin className="h-4 w-4 text-[#B8864E]" />
                <span>Made in USA</span>
              </div>
              <div className="flex items-center gap-2 bg-white border border-[#E8E0D5] px-4 py-2 rounded-full text-[#9B9189]">
                <Shield className="h-4 w-4 text-[#B8864E]" />
                <span>100% Sicher</span>
              </div>
              {/* Admin Login */}
              {onAdminOpen && (
                <AdminLoginButton
                  onAdminOpen={onAdminOpen}
                  className="hover:bg-[#F9F7F4] border border-[#E8E0D5]"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="h-[2px] bg-[#B8864E]"></div>

    </footer>
  )
}
