'use client'

import { useRef, useState, type FormEvent } from 'react'
import type { BirthdayMessage } from '@/types/birthday'

type CreateEnvelopeProps = {
  disabled: boolean
  onCreated: (message: BirthdayMessage) => void
}

export function CreateEnvelope({ disabled, onCreated }: CreateEnvelopeProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [canShare, setCanShare] = useState(false)

  async function sharePresent() {
    if (!navigator.share) return

    try {
      await navigator.share({
        title: 'Um presente em forma de cartas',
        text: 'Deixei uma carta neste presente. Você também pode participar.',
        url: window.location.href,
      })
    } catch (shareError) {
      if (shareError instanceof Error && shareError.name !== 'AbortError') {
        setError('Não foi possível abrir o compartilhamento agora.')
      }
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending || disabled) return

    setPending(true)
    setError('')
    setSuccess(false)

    try {
      const response = await fetch('/api/envelopes', {
        method: 'POST',
        body: new FormData(event.currentTarget),
      })
      const result = (await response.json()) as {
        error?: string
        message?: BirthdayMessage
      }

      if (!response.ok || !result.message) {
        setError(result.error ?? 'Não consegui enviar sua carta. Tente novamente.')
        return
      }

      onCreated(result.message)
      formRef.current?.reset()
      setCanShare(typeof navigator.share === 'function')
      setSuccess(true)
    } catch {
      setError('A conexão falhou. Confira sua internet e tente novamente.')
    } finally {
      setPending(false)
    }
  }

  return (
    <section className="create-section" id="deixar-carta" aria-labelledby="create-title">
      <div className="create-copy">
        <p className="eyebrow"><span aria-hidden="true">✳</span> sua vez de entrar no presente</p>
        <h2 id="create-title">Deixe um pedacinho seu.</h2>
        <p>
          Uma lembrança, uma piada interna, um desejo bonito. Vale até aquela
          foto que ninguém mais teria coragem de mandar.
        </p>
        <div className="create-scribble" aria-hidden="true">sem cerimônia, com carinho ♡</div>
      </div>

      <form ref={formRef} className="letter-form" onSubmit={handleSubmit}>
        <div className="form-heading">
          <span className="form-heading-seal" aria-hidden="true">✳</span>
          <div>
            <p className="form-kicker">uma carta nova</p>
            <h3>Escreva para ela</h3>
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="letter-name">Seu nome</label>
          <input
            id="letter-name"
            name="name"
            type="text"
            autoComplete="name"
            maxLength={60}
            placeholder="Como ela te chama?"
            required
            disabled={disabled || pending}
          />
        </div>

        <div className="form-field">
          <div className="form-label-row">
            <label htmlFor="letter-message">Sua mensagem</label>
            <span>até 500 caracteres</span>
          </div>
          <textarea
            id="letter-message"
            name="message"
            rows={5}
            minLength={2}
            maxLength={500}
            placeholder="Conte uma história, deixe um desejo ou faça ela rir..."
            required
            disabled={disabled || pending}
          />
        </div>

        <div className="form-field form-photo-field">
          <label htmlFor="letter-photo">Uma foto? (opcional)</label>
          <input
            id="letter-photo"
            name="photo"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            disabled={disabled || pending}
          />
          <span className="form-hint">JPEG, PNG ou WebP · até 3 MB · quanto mais humilhante, melhor.</span>
        </div>

        <div className="honeypot" aria-hidden="true">
          <label htmlFor="letter-website">Não preencha este campo</label>
          <input
            id="letter-website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        {disabled && (
          <p className="form-alert" role="status">
            O envio ainda está sendo preparado. As cartas poderão ser enviadas assim que a conexão estiver pronta.
          </p>
        )}
        {error && <p className="form-alert" role="alert">{error}</p>}
        {success && (
          <p className="form-success" role="status">
            <span aria-hidden="true">♡</span> Agora você também faz parte do presente.
          </p>
        )}
        {success && canShare && (
          <button className="share-button" type="button" onClick={sharePresent}>
            Compartilhar com alguém <span aria-hidden="true">↗</span>
          </button>
        )}

        <button className="send-button" type="submit" disabled={disabled || pending}>
          <span aria-hidden="true">{pending ? '◌' : '✉'}</span>
          {pending ? 'Guardando sua carta…' : 'Enviar com carinho'}
          {!pending && <span className="send-arrow" aria-hidden="true">↗</span>}
        </button>
        <p className="privacy-note">
          Sua mensagem e foto poderão ser vistas por quem visitar este presente.
        </p>
      </form>
    </section>
  )
}