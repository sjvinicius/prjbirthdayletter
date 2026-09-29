'use client'

import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { getPublicPhotoUrl } from '@/lib/supabase/photos'
import type { BirthdayMessage } from '@/types/birthday'

export type OpenLetter =
  | { kind: 'message'; message: BirthdayMessage }
  | { kind: 'special' }

type EnvelopeModalProps = {
  letter: OpenLetter | null
  birthdayName: string
  specialMessage: string
  onClose: () => void
}

export function EnvelopeModal({
  letter,
  birthdayName,
  specialMessage,
  onClose,
}: EnvelopeModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const message = letter?.kind === 'message' ? letter.message : null
  const isSpecial = letter?.kind === 'special'
  const photoUrl = message?.photo_path ? getPublicPhotoUrl(message.photo_path) : null

  useEffect(() => {
    if (!letter) return

    const previousOverflow = document.body.style.overflow
    const previouslyFocused =
      document.activeElement instanceof HTMLElement ? document.activeElement : null
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
      if (event.key === 'Tab') {
        event.preventDefault()
        closeButtonRef.current?.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
      previouslyFocused?.focus()
    }
  }, [letter, onClose])

  return (
    <AnimatePresence>
      {letter && (
        <motion.div
          className="letter-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose()
          }}
        >
          <motion.section
            className={`opened-letter${isSpecial ? ' opened-letter-special' : ''}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="opened-letter-title"
            tabIndex={-1}
            initial={{ opacity: 0, y: 30, scale: 0.96, rotate: 1.5 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ type: 'spring', damping: 25, stiffness: 230 }}
          >
            <div className="opened-letter-topline">
              <span className="opened-letter-kicker">
                {isSpecial ? 'guardada com muito amor' : 'uma lembrança para guardar'}
              </span>
              <button
                ref={closeButtonRef}
                className="icon-button letter-close"
                type="button"
                onClick={onClose}
                aria-label="Fechar carta"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>

            <span className="opened-letter-flower" aria-hidden="true">
              {isSpecial ? '♡' : '✳'}
            </span>
            <h2 id="opened-letter-title">
              {isSpecial ? `Para ${birthdayName}` : `Com carinho, ${message?.name}`}
            </h2>
            <p className="opened-letter-message">
              {isSpecial
                ? specialMessage ||
                  'Tem palavras que merecem ser escritas por quem te conhece melhor. Esta carta está guardada para receber a mensagem mais especial de todas.'
                : message?.message}
            </p>

            {photoUrl && message && (
              <figure className="opened-letter-photo">
                <Image
                  src={photoUrl}
                  alt={`Foto enviada por ${message.name}`}
                  width={720}
                  height={540}
                  sizes="(max-width: 640px) 82vw, 520px"
                  className="h-auto max-h-80 w-full object-cover"
                />
                <figcaption>Um pedacinho desse dia, enviado por {message.name}.</figcaption>
              </figure>
            )}

            <div className="opened-letter-signoff">
              <span aria-hidden="true">✳</span>
              {isSpecial ? 'sempre seu' : message?.name}
            </div>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  )
}