'use client'

import { AnimatePresence, motion, MotionConfig } from 'framer-motion'
import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { CreateEnvelope } from '@/components/birthday/CreateEnvelope'
import { EnvelopeCard } from '@/components/birthday/EnvelopeCard'
import { EnvelopeModal, type OpenLetter } from '@/components/birthday/EnvelopeModal'
import { PhotoLightbox } from '@/components/birthday/PhotoLightbox'
import { getPublicPhotoUrl } from '@/lib/supabase/photos'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import type { BirthdayMessage, BirthdayStats } from '@/types/birthday'

type BirthdayExperienceProps = {
  initialMessages: BirthdayMessage[]
  supabaseUrl: string | null
  stats: BirthdayStats
  birthdayName: string
  specialMessage: string
  configurationMissing: boolean
  hasError: boolean
  submissionUnavailable: boolean
}

export function BirthdayExperience({
  initialMessages,
  supabaseUrl,
  stats,
  birthdayName,
  specialMessage,
  configurationMissing,
  hasError,
  submissionUnavailable,
}: BirthdayExperienceProps) {
  const [messages, setMessages] = useState(initialMessages)
  const [liveStats, setLiveStats] = useState(stats)
  const [openLetter, setOpenLetter] = useState<OpenLetter | null>(null)
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null)
  const [notice, setNotice] = useState('')
  const [realtimeConnected, setRealtimeConnected] = useState(false)
  const knownMessageIds = useRef(new Set(initialMessages.map((message) => message.id)))

  const photos = messages.filter((message) => message.photo_path).slice(0, 12)

  const closeLetter = useCallback(() => setOpenLetter(null), [])
  const closePhotoLightbox = useCallback(() => setSelectedPhotoIndex(null), [])

  const acceptMessage = useCallback((message: BirthdayMessage) => {
    if (knownMessageIds.current.has(message.id)) return
    knownMessageIds.current.add(message.id)
    setMessages((current) => [message, ...current].slice(0, 100))
    setLiveStats((current) => ({
      messages: current.messages + 1,
      photos: current.photos + (message.photo_path ? 1 : 0),
    }))
  }, [])

  useEffect(() => {
    if (configurationMissing) return

    const supabase = getSupabaseBrowserClient()
    if (!supabase) return

    const channel = supabase
      .channel('birthday-message-wall')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: 'approved=eq.true',
        },
        (payload) => {
          const newMessage = payload.new as BirthdayMessage
          if (!newMessage.approved) return
          acceptMessage(newMessage)
          setNotice('Uma nova carta acabou de chegar.')
        }
      )
      .subscribe((status) => {
        setRealtimeConnected(status === 'SUBSCRIBED')
      })

    return () => {
      void supabase.removeChannel(channel)
    }
  }, [acceptMessage, configurationMissing])

  useEffect(() => {
    if (!notice) return
    const timer = window.setTimeout(() => setNotice(''), 4200)
    return () => window.clearTimeout(timer)
  }, [notice])

  function openRandomLetter() {
    if (messages.length === 0) return
    const index = Math.floor(Math.random() * messages.length)
    setOpenLetter({ kind: 'message', message: messages[index] })
  }

  return (
    <MotionConfig reducedMotion="user">
      <>
      <section className="wall-section" id="cartas" aria-labelledby="wall-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow"><span aria-hidden="true">✳</span> abra sem pressa</p>
            <h2 id="wall-title">Cartas espalhadas<br className="heading-break" /> para você.</h2>
          </div>
          <p className="section-aside">
            Cada envelope guarda uma voz, uma memória, um jeito diferente de dizer: que bom que você existe.
          </p>
        </div>

        <div className="wall-meta">
          <span>
            <span className={`live-dot${realtimeConnected ? ' live-dot-on' : ''}`} aria-hidden="true" />
            {realtimeConnected ? 'o presente está acontecendo agora' : 'feito por quem gosta de você'}
          </span>
          <button
            className="random-link"
            type="button"
            onClick={openRandomLetter}
            disabled={messages.length === 0}
          >
            <span aria-hidden="true">↝</span> Abrir uma carta surpresa
          </button>
        </div>

        {configurationMissing && (
          <div className="setup-note" role="status">
            <span aria-hidden="true">✳</span>
            <p>Este presente está sendo preparado. As cartas aparecerão aqui quando a conexão estiver pronta.</p>
          </div>
        )}
        {hasError && (
          <div className="setup-note setup-note-error" role="alert">
            <span aria-hidden="true">↻</span>
            <p>Não foi possível abrir as cartas agora. Tente novamente em alguns instantes.</p>
          </div>
        )}

        {messages.length > 0 ? (
          <ul className="envelope-wall" aria-label="Envelopes de aniversário">
            {messages.map((message, index) => (
              <EnvelopeCard
                key={message.id}
                message={message}
                index={index}
                onOpen={(selected) => setOpenLetter({ kind: 'message', message: selected })}
              />
            ))}
          </ul>
        ) : !configurationMissing && !hasError ? (
          <div className="empty-wall">
            <span className="empty-wall-envelope" aria-hidden="true">✉</span>
            <p className="empty-wall-title">Ainda não há cartas por aqui.</p>
            <p>Você pode ser a primeira pessoa a deixar uma.</p>
            <a href="#deixar-carta">Escrever a primeira carta <span aria-hidden="true">↓</span></a>
          </div>
        ) : null}
      </section>

      <section className="stats-strip" aria-label="Estatísticas do presente">
        {configurationMissing || hasError ? (
          <p>Este presente está sendo preparado, carta por carta.</p>
        ) : (
          <>
            <p>Um presente que cresce com cada pessoa.</p>
            <div className="stats-strip-values">
              <span><strong>{liveStats.messages}</strong> {liveStats.messages === 1 ? 'carta' : 'cartas'}</span>
              <span className="stats-divider" aria-hidden="true">✳</span>
              <span><strong>{liveStats.photos}</strong> {liveStats.photos === 1 ? 'foto' : 'fotos'}</span>
            </div>
          </>
        )}
      </section>

      <section className="gallery-section" aria-labelledby="gallery-title">
        <div className="gallery-heading">
          <div>
            <p className="eyebrow"><span aria-hidden="true">✳</span> provas de que foi divertido</p>
            <h2 id="gallery-title">A galeria da<br />boa vergonha.</h2>
          </div>
          <p>As fotos que não cabiam em uma mensagem, mas precisavam fazer parte da história.</p>
        </div>

        {photos.length > 0 ? (
          <div className="photo-wall">
            {photos.map((message, index) => {
              const photoUrl = message.photo_path
                ? getPublicPhotoUrl(message.photo_path, supabaseUrl)
                : null
              if (!photoUrl) return null

              return (
                <motion.figure
                  className={`photo-print photo-print-${index % 5}`}
                  key={message.id}
                  initial={{ opacity: 0, y: 16, rotate: 0 }}
                  whileInView={{ opacity: 1, y: 0, rotate: (index % 5 - 2) * 1.4 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.2) }}
                >
                  <button
                    className="photo-print-trigger"
                    type="button"
                    onClick={() => setSelectedPhotoIndex(index)}
                    aria-label={`Ampliar foto enviada por ${message.name}`}
                    title="Ampliar foto"
                  >
                    <Image
                      src={photoUrl}
                      alt=""
                      width={520}
                      height={420}
                      sizes="(max-width: 640px) 44vw, (max-width: 1024px) 30vw, 22vw"
                      className="photo-print-image"
                    />
                    <span className="photo-print-zoom" aria-hidden="true">↗</span>
                  </button>
                  <figcaption>com carinho, {message.name}</figcaption>
                </motion.figure>
              )
            })}
          </div>
        ) : (
          <p className="gallery-empty">
            {configurationMissing
              ? 'As fotos vão aparecer aqui quando o mural estiver pronto.'
              : 'Quando alguém enviar uma foto, ela vai aparecer aqui.'}
          </p>
        )}
      </section>

      <section className="special-section" aria-labelledby="special-title">
        <div className="special-envelope-art" aria-hidden="true">
          <span className="special-envelope-heart">♡</span>
          <span className="special-envelope-seal">só nós dois</span>
        </div>
        <div className="special-copy">
          <p className="eyebrow"><span aria-hidden="true">✳</span> um último pedacinho</p>
          <h2 id="special-title">E uma carta<br />só minha.</h2>
          <p>Porque, no meio de tanta gente que te ama, eu ainda queria guardar um cantinho só nosso.</p>
          <button
            className="special-button"
            type="button"
            onClick={() => setOpenLetter({ kind: 'special' })}
          >
            Abrir minha carta <span aria-hidden="true">↗</span>
          </button>
        </div>
      </section>

      <CreateEnvelope disabled={submissionUnavailable} onCreated={acceptMessage} />

      {selectedPhotoIndex !== null && (
        <PhotoLightbox
          photos={photos}
          initialIndex={selectedPhotoIndex}
          supabaseUrl={supabaseUrl}
          onClose={closePhotoLightbox}
        />
      )}

      <EnvelopeModal
        letter={openLetter}
        birthdayName={birthdayName}
        specialMessage={specialMessage}
        supabaseUrl={supabaseUrl}
        onClose={closeLetter}
      />

      <AnimatePresence>
        {notice && (
          <motion.p
            className="realtime-notice"
            role="status"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
          >
            <span aria-hidden="true">✉</span> {notice}
          </motion.p>
        )}
      </AnimatePresence>
      </>
    </MotionConfig>
  )
}