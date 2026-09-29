import { BirthdayExperience } from '@/components/birthday/BirthdayExperience'
import { Hero } from '@/components/birthday/Hero'
import { getBirthdayData } from '@/lib/birthday/data'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const data = await getBirthdayData()
  const supabaseUrl = process.env.NEXT_SUPABASE_URL?.trim() || null
  const birthdayName = process.env.NEXT_BIRTHDAY_NAME?.trim() || 'meu amor'
  const specialMessage = process.env.BIRTHDAY_SPECIAL_MESSAGE?.trim() || ''
  const heroStats = data.configurationMissing || data.hasError ? null : data.stats
  const submissionUnavailable = !(
    supabaseUrl &&
    process.env.NEXT_SUPABASE_ANON_KEY?.trim() &&
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
  )

  return (
    <main>
      <Hero birthdayName={birthdayName} stats={heroStats} />
      <BirthdayExperience
        initialMessages={data.messages}
        supabaseUrl={supabaseUrl}
        stats={data.stats}
        birthdayName={birthdayName}
        specialMessage={specialMessage}
        configurationMissing={data.configurationMissing}
        hasError={data.hasError}
        submissionUnavailable={submissionUnavailable}
      />
      <footer className="site-footer">
        <span>Feito com carinho, carta por carta.</span>
        <span aria-hidden="true">✳</span>
      </footer>
    </main>
  )
}