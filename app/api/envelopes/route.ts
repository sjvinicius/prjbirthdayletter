import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'
import { birthdayEnvelopeSchema, MAX_PHOTO_BYTES } from '@/lib/birthday/validation'
import { getSupabaseAdminClient } from '@/lib/supabase/server'
import { ENVELOPE_STYLES, type BirthdayMessage } from '@/types/birthday'

export const runtime = 'nodejs'

const MAX_REQUEST_BYTES = MAX_PHOTO_BYTES + 32 * 1024
const MAX_IMAGE_PIXELS = 40_000_000
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000
const RATE_LIMIT_MAX = 3
const rateLimit = new Map<string, { count: number; expiresAt: number }>()

const IMAGE_TYPES = {
  jpeg: { mime: 'image/jpeg', extensions: ['jpg', 'jpeg'] },
  png: { mime: 'image/png', extensions: ['png'] },
  webp: { mime: 'image/webp', extensions: ['webp'] },
} as const

type DetectedImageType = keyof typeof IMAGE_TYPES

function checkRateLimit(ip: string) {
  const now = Date.now()
  const current = rateLimit.get(ip)

  if (!current || current.expiresAt <= now) {
    rateLimit.set(ip, { count: 1, expiresAt: now + RATE_LIMIT_WINDOW_MS })
  } else if (current.count >= RATE_LIMIT_MAX) {
    return false
  } else {
    current.count += 1
  }

  if (rateLimit.size > 500) {
    for (const [key, entry] of rateLimit) {
      if (entry.expiresAt <= now) rateLimit.delete(key)
    }
  }

  return true
}

function detectImageType(bytes: Uint8Array): DetectedImageType | null {
  if (
    bytes.length >= 3 &&
    bytes[0] === 0xff &&
    bytes[1] === 0xd8 &&
    bytes[2] === 0xff
  ) {
    return 'jpeg'
  }

  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  ) {
    return 'png'
  }

  if (
    bytes.length >= 12 &&
    String.fromCharCode(...bytes.subarray(0, 4)) === 'RIFF' &&
    String.fromCharCode(...bytes.subarray(8, 12)) === 'WEBP'
  ) {
    return 'webp'
  }

  return null
}

function cleanText(value: string, preserveLines = false) {
  const withoutControls = preserveLines
    ? value.replace(/\r\n?/g, '\n').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '')
    : value.replace(/[\u0000-\u001f\u007f]/g, '')

  return withoutControls.normalize('NFC').trim()
}

function styleForId(id: string) {
  const index = [...id].reduce((sum, character) => sum + character.charCodeAt(0), 0)
  return ENVELOPE_STYLES[index % ENVELOPE_STYLES.length]
}

export async function POST(request: NextRequest) {
  const contentLength = Number(request.headers.get('content-length') ?? 0)
  if (contentLength > MAX_REQUEST_BYTES) {
    return NextResponse.json({ error: 'O envio ultrapassa o tamanho permitido.' }, { status: 413 })
  }

  const ip =
    request.headers.get('x-real-ip') ??
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    'unknown'

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Você já enviou algumas cartas. Tente novamente daqui a pouco.' },
      { status: 429 }
    )
  }

  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return NextResponse.json({ error: 'Não consegui ler este envio.' }, { status: 400 })
  }

  if (String(formData.get('website') ?? '').trim()) {
    return NextResponse.json({ ok: true }, { status: 201 })
  }

  const parsed = birthdayEnvelopeSchema.safeParse({
    name: cleanText(String(formData.get('name') ?? '')),
    message: cleanText(String(formData.get('message') ?? ''), true),
  })

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Confira seu nome e sua mensagem.' },
      { status: 400 }
    )
  }

  const photoEntry = formData.get('photo')
  let photo: File | null = null
  let photoBytes: Uint8Array | null = null
  let photoMime: string | null = null
  let photoExtension: string | null = null

  if (photoEntry && typeof photoEntry !== 'string' && photoEntry.size > 0) {
    photo = photoEntry

    if (photo.size > MAX_PHOTO_BYTES) {
      return NextResponse.json({ error: 'A foto pode ter até 3 MB.' }, { status: 413 })
    }

    photoBytes = new Uint8Array(await photo.arrayBuffer())
    const imageType = detectImageType(photoBytes)
    const declaredType = IMAGE_TYPES[imageType ?? 'jpeg']
    const extension = photo.name.toLowerCase().split('.').pop() ?? ''

    if (
      !imageType ||
      photo.type !== declaredType.mime ||
      !declaredType.extensions.includes(extension as never)
    ) {
      return NextResponse.json(
        { error: 'Envie uma imagem JPEG, PNG ou WebP válida.' },
        { status: 400 }
      )
    }

    try {
      const metadata = await sharp(photoBytes, {
        failOn: 'error',
        limitInputPixels: MAX_IMAGE_PIXELS,
      }).metadata()

      if (
        metadata.format !== imageType ||
        !metadata.width ||
        !metadata.height ||
        (metadata.pages ?? 1) > 1
      ) {
        return NextResponse.json(
          { error: 'Envie uma foto JPEG, PNG ou WebP válida, sem animação.' },
          { status: 400 }
        )
      }

      photoBytes = await sharp(photoBytes, {
        failOn: 'error',
        limitInputPixels: MAX_IMAGE_PIXELS,
      })
        .rotate()
        .resize({
          width: 1600,
          height: 1600,
          fit: 'inside',
          withoutEnlargement: true,
        })
        .jpeg({ quality: 84 })
        .toBuffer()
    } catch {
      return NextResponse.json(
        { error: 'Não consegui processar esta foto. Tente outra imagem.' },
        { status: 400 }
      )
    }

    photoMime = 'image/jpeg'
    photoExtension = 'jpg'
  }

  const supabase = getSupabaseAdminClient()
  if (!supabase) {
    return NextResponse.json(
      { error: 'O presente ainda está sendo preparado. Tente novamente mais tarde.' },
      { status: 503 }
    )
  }

  const id = crypto.randomUUID()
  const photoPath = photoBytes && photoExtension ? `messages/${id}.${photoExtension}` : null

  if (photoPath && photoBytes && photoMime) {
    const { error } = await supabase.storage.from('birthday').upload(photoPath, photoBytes, {
      contentType: photoMime,
      cacheControl: '31536000',
      upsert: false,
    })

    if (error) {
      return NextResponse.json(
        { error: 'Não consegui guardar a foto. Tente novamente.' },
        { status: 502 }
      )
    }
  }

  const { data, error } = await supabase
    .from('messages')
    .insert({
      id,
      name: parsed.data.name,
      message: parsed.data.message,
      photo_path: photoPath,
      envelope_style: styleForId(id),
    })
    .select('id, name, message, photo_path, envelope_style, approved, created_at')
    .single()

  if (error || !data) {
    if (photoPath) await supabase.storage.from('birthday').remove([photoPath])
    return NextResponse.json(
      { error: 'Não consegui guardar sua carta agora. Tente novamente.' },
      { status: 502 }
    )
  }

  return NextResponse.json({ message: data as BirthdayMessage }, { status: 201 })
}