import { ImageResponse } from 'next/og'

export const alt = 'Um presente de aniversário feito de cartas e carinho'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
  const name = process.env.NEXT_PUBLIC_BIRTHDAY_NAME?.trim() || 'meu amor'

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 78px',
          color: '#fffaf0',
          background: 'linear-gradient(125deg, #203a34 0%, #304d43 72%, #72504b 140%)',
          fontFamily: 'Georgia, serif',
        }}
      >
        <div style={{ display: 'flex', color: '#e7cf8e', fontSize: 22, letterSpacing: 3 }}>
          ✳ UMA SURPRESA FEITA À MÃO
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 70, lineHeight: 1.05 }}>
          <span>Feliz aniversário,</span>
          <span style={{ color: '#f2dda0', fontStyle: 'italic' }}>{name}.</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, fontSize: 22, color: '#e8b6a5' }}>
          <span>✉</span>
          <span style={{ color: '#fffaf0' }}>Um presente feito por quem gosta de você.</span>
        </div>
      </div>
    ),
    size
  )
}