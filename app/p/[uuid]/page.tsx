import { notFound } from 'next/navigation'
import { createClient } from '@/supabase/server'
import PlanOutput from '@/components/PlanOutput'
import Link from 'next/link'
import type { Plan } from '@/types'

export default async function SharePage({ params }: { params: Promise<{ uuid: string }> }) {
  const { uuid } = await params
  const supabase = await createClient()

  const { data: plan } = await supabase
    .from('plans')
    .select('*')
    .eq('share_uuid', uuid)
    .eq('is_public', true)
    .single()

  if (!plan) notFound()

  const p = plan as Plan

  return (
    <div className="min-h-screen pt-24 pb-16 px-6 max-w-5xl mx-auto">
      <div className="mb-8 p-4 rounded-xl border border-white/8 bg-surface flex items-center justify-between gap-4">
        <p className="text-sm text-muted">
          Shared plan by a <span className="text-[#f2f0e8]">beefup</span> member
        </p>
        <Link
          href="/builder"
          className="text-sm bg-accent text-bg font-medium px-4 py-2 rounded-lg hover:opacity-85 transition-opacity flex-shrink-0"
        >
          Build my own →
        </Link>
      </div>

      <PlanOutput
        days={p.days}
        goal={p.goal}
        split={p.split}
        diet={p.diet}
        mealsPerDay={p.meals_per_day}
        shareUuid={p.share_uuid}
        readOnly
      />
    </div>
  )
}
