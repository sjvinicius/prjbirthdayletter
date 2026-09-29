'use client'

import { motion } from 'framer-motion'
import type { BirthdayMessage } from '@/types/birthday'

const ROTATIONS = [-3, 2.5, -1.5, 3.5, -2, 1, 4, -3.5]

type EnvelopeCardProps = {
  message: BirthdayMessage
  index: number
  onOpen: (message: BirthdayMessage) => void
}

export function EnvelopeCard({ message, index, onOpen }: EnvelopeCardProps) {
  const rotation = ROTATIONS[index % ROTATIONS.length]
  const number = String(index + 1).padStart(2, '0')

  return (
    <motion.li
      className="envelope-item"
      initial={{ opacity: 0, y: 18, rotate: rotation - 2 }}
      animate={{ opacity: 1, y: 0, rotate: rotation }}
      transition={{ duration: 0.42, delay: Math.min(index * 0.025, 0.3) }}
      layout
    >
      <button
        className={`envelope envelope-${message.envelope_style}`}
        type="button"
        onClick={() => onOpen(message)}
        aria-label={`Abrir a carta de ${message.name}`}
      >
        <span className="envelope-back" aria-hidden="true" />
        <span className="envelope-flap" aria-hidden="true" />
        <span className="envelope-face" aria-hidden="true" />
        <span className="envelope-seal" aria-hidden="true">✳</span>
        <span className="envelope-number" aria-hidden="true">{number}</span>
        <span className="envelope-label">uma carta para você</span>
        <span className="envelope-from">— {message.name}</span>
      </button>
    </motion.li>
  )
}