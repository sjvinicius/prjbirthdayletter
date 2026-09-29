'use client'

import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { getPublicPhotoUrl } from '@/lib/supabase/photos'
import type { BirthdayMessage } from '@/types/birthday'

type PhotoLightboxProps = {
  photos: BirthdayMessage[]
  initialIndex: number
  supabaseUrl: string | null
  onClose: () => void
}

export function PhotoLightbox({
  photos,
  initialIndex,
  supabaseUrl,
  onClose,
}: PhotoLightboxProps) {
  const [activeIndex, setActiveIndex] = useState(initialIndex)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const photo = photos[activeIndex]
  const photoUrl = photo?.photo_path
    ? getPublicPhotoUrl(photo.photo_path, supabaseUrl)
    : null

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    const previouslyFocused =
      document.activeElement instanceof HTMLElement ? document.activeElement : null
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
      if (photos.length < 2) return

      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        setActiveIndex((current) => (current - 1 + photos.length) % photos.length)
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault()
        setActiveIndex((current) => (current + 1) % photos.length)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
      previouslyFocused?.focus()
    }
  }, [onClose, photos.length])

  if (!photo || !photoUrl) return null

  function showPrevious() {
    setActiveIndex((current) => (current - 1 + photos.length) % photos.length)
  }

  function showNext() {
    setActiveIndex((current) => (current + 1) % photos.length)
  }

  return (
    <AnimatePresence>
      <motion.div
        className="photo-lightbox"
        role="presentation"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) onClose()
        }}
      >
        <motion.div
          className="photo-lightbox-dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby="photo-lightbox-caption"
          initial={{ opacity: 0, y: 12, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.99 }}
        >
          <div className="photo-lightbox-toolbar">
            <button
              ref={closeButtonRef}
              className="photo-lightbox-close"
              type="button"
              onClick={onClose}
              aria-label="Fechar visualizador"
              title="Fechar"
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>

          <div className="photo-lightbox-stage">
            <button
              className="photo-lightbox-nav"
              type="button"
              onClick={showPrevious}
              disabled={photos.length < 2}
              aria-label="Foto anterior"
              title="Foto anterior"
            >
              <span aria-hidden="true">‹</span>
            </button>

            <div className="photo-lightbox-image-frame" aria-live="polite">
              <AnimatePresence mode="wait">
                <motion.div
                  key={photo.id}
                  className="photo-lightbox-image-frame"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <Image
                    src={photoUrl}
                    alt={`Foto de aniversário enviada por ${photo.name}`}
                    fill
                    sizes="(max-width: 768px) 82vw, 74vw"
                    className="photo-lightbox-image"
                    priority
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            <button
              className="photo-lightbox-nav"
              type="button"
              onClick={showNext}
              disabled={photos.length < 2}
              aria-label="Próxima foto"
              title="Próxima foto"
            >
              <span aria-hidden="true">›</span>
            </button>
          </div>

          <div className="photo-lightbox-caption" id="photo-lightbox-caption">
            <span>com carinho, {photo.name}</span>
            <span className="photo-lightbox-count" aria-label={`Foto ${activeIndex + 1} de ${photos.length}`}>
              {activeIndex + 1} / {photos.length}
            </span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}