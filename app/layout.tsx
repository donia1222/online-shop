import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Analytics } from '@vercel/analytics/next';
import { CookieBanner } from '@/components/cookie-banner'

// ⚙️ MANTENIMIENTO: cambia a false para volver al estado normal
const MAINTENANCE_MODE = true


export const metadata: Metadata = {
  title: 'US - Fishing & Huntingshop',
  description: 'Ihr Spezialist für Jagd- und Angelausrüstung. Premium Outdoor-Ausrüstung zu fairen Preisen.',
  generator: '9745 Sevelen',
  icons: {
    icon: '/favicon.png',
    apple: '/icon-192x192.png',
  },
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  themeColor: '#2C5F2E',
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  if (MAINTENANCE_MODE) {
    return (
      <html lang="de">
        <body style={{ margin: 0, padding: 0 }}>
          <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(160deg, #f8f9fa 0%, #e9ecef 100%)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
            textAlign: 'center', padding: '2rem',
          }}>
            {/* Card */}
            <div style={{
              background: '#ffffff',
              borderRadius: '24px',
              boxShadow: '0 8px 40px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)',
              padding: 'clamp(2rem, 5vw, 3.5rem)',
              maxWidth: '520px', width: '100%',
            }}>
              {/* Store Logo */}
              <img
                src="/Security_n.png"
                alt="US - Fishing & Huntingshop"
                style={{ maxWidth: '180px', width: '100%', height: 'auto', display: 'block', marginLeft: 'auto', marginRight: 'auto', marginBottom: '1.5rem' }}
              />

              {/* Maintenance notice */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                background: '#fff7ed',
                border: '1px solid #fed7aa',
                color: '#9a3412',
                fontSize: '0.88rem', fontWeight: 500,
                marginBottom: '1.8rem',
              }}>
                <span style={{ fontSize: '1.1rem' }}>🕒</span>
                <span>Wir arbeiten an der Website – bald wieder verfügbar</span>
              </div>

              {/* Divider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
                <span style={{ fontSize: '0.75rem', color: '#9ca3af', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Kontakt</span>
                <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
              </div>

              {/* Store contact */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {[
                  { href: 'https://maps.google.com/?q=Bahnhofstrasse+2,+9475+Sevelen', label: 'Bahnhofstrasse 2, 9475 Sevelen', icon: '📍', external: true },
                  { href: 'tel:+41786066105', label: '078 606 61 05', icon: '📞' },
                  { href: 'mailto:info@usfh.ch', label: 'info@usfh.ch', icon: '✉️' },
                ].map(({ href, label, icon, external }) => (
                  <a
                    key={href}
                    href={href}
                    {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                      padding: '0.65rem 1rem',
                      borderRadius: '10px',
                      background: '#f9fafb',
                      border: '1px solid #e5e7eb',
                      color: '#111827',
                      textDecoration: 'none',
                      fontSize: '0.9rem', fontWeight: 500,
                      transition: 'background 0.15s',
                    }}
                  >
                    <span>{icon}</span> {label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </body>
      </html>
    )
  }

  return (
    <html lang="en">
      <body>{children} <Analytics /><CookieBanner /></body>
    </html>
  )
}
