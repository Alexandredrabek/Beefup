import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/supabase/server'
import PlanDetailClient from '@/components/PlanDetailClient'

export default async function PlanPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: plan } = await supabase
    .from('plans')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!plan) notFound()

  return (
    <div className="min-h-screen pt-24 pb-16 px-6 max-w-5xl mx-auto">
      <PlanDetailClient plan={plan} />
    </div>
  )
}
