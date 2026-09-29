import type { BirthdayStats } from '@/types/birthday'

type HeroProps = {
  birthdayName: string
  stats: BirthdayStats | null
}

export function Hero({ birthdayName, stats }: HeroProps) {
  return (
    <header className="hero" id="topo">
      <div className="hero-grain" aria-hidden="true" />
      <div className="hero-inner">
        <div className="hero-copy">
          <p className="eyebrow hero-eyebrow">
            <span className="eyebrow-star" aria-hidden="true">✳</span>
            uma surpresa feita à mão
          </p>
          <h1>
            Feliz aniversário,
            <span className="hero-name">{birthdayName}.</span>
          </h1>
          <p className="hero-message">
            Hoje é o seu dia. E, pelo visto, eu não fui o único que quis te
            deixar um pedacinho de carinho.
          </p>
          <a className="hero-cta" href="#cartas">
            Encontrar minhas cartas <span aria-hidden="true">↓</span>
          </a>
          <div className="hero-note">
            <span className="hero-note-mark" aria-hidden="true">♡</span>
            <span>De gente que fica feliz só por ter você por perto.</span>
          </div>
        </div>

        <div className="hero-art" aria-hidden="true">
          <span className="hero-scribble hero-scribble-one">para você</span>
          <span className="hero-scribble hero-scribble-two">com amor</span>
          <div className="hero-letter hero-letter-back">
            <span className="letter-stamp">✿</span>
            <span className="letter-lines" />
          </div>
          <div className="hero-letter hero-letter-middle">
            <span className="letter-stamp">✳</span>
            <span className="letter-lines" />
          </div>
          <div className="hero-letter hero-letter-front">
            <span className="letter-front-heart">♡</span>
            <span className="letter-front-label">abre quando quiser</span>
          </div>
          <span className="hero-art-spark hero-art-spark-one">✳</span>
          <span className="hero-art-spark hero-art-spark-two">·</span>
        </div>
      </div>

      <div className="hero-bottom">
        <div className="hero-bottom-copy">
          <span className="hero-bottom-icon" aria-hidden="true">✉</span>
          <span>Seu presente está sendo escrito por muitas mãos.</span>
        </div>
        {stats ? (
          <div className="hero-stats" aria-label="Resumo das mensagens">
            <span><strong>{stats.messages}</strong> cartas</span>
            <span className="hero-stats-divider" aria-hidden="true">/</span>
            <span><strong>{stats.photos}</strong> fotos</span>
          </div>
        ) : (
          <span className="hero-stats-pending">um presente em construção</span>
        )}
      </div>
    </header>
  )
}