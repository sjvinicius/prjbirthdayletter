import type { Metadata } from 'next'
import './globals.css'

const birthdayName = process.env.NEXT_BIRTHDAY_NAME?.trim() || 'meu amor'
const configuredSiteUrl =
  process.env.NEXT_SITE_URL?.trim() ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

export const metadata: Metadata = {
  metadataBase: new URL(configuredSiteUrl),
  title: `Feliz aniversário, ${birthdayName} ❤️`,
  description:
    'Uma parede de cartas e fotos feita por quem ama você. Abra os envelopes e descubra cada pedacinho desta surpresa.',
  openGraph: {
    title: `Feliz aniversário, ${birthdayName} ❤️`,
    description: 'Um presente feito de cartas, fotos e carinho.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Feliz aniversário, ${birthdayName} ❤️`,
    description: 'Um presente feito de cartas, fotos e carinho.',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}