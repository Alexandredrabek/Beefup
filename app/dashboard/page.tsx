import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/supabase/server'
import DashboardClient from '@/components/DashboardClient'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: plans } = await supabase
    .from('plans')
    .select('id, title, goal, split, diet, meals_per_day, is_public, share_uuid, created_at, updated_at')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })

  const { data: progressLogs } = await supabase
    .from('progress_logs')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(20)

  return (
    <div className="min-h-screen pt-24 pb-16 px-6 max-w-5xl mx-auto">
      <div className="flex items-start justify-between mb-10">
        <div>
          <p className="font-mono-custom text-xs text-accent tracking-widest uppercase mb-2">// dashboard</p>
          <h1 className="font-display text-6xl tracking-wider">MY PLANS</h1>
          <p className="text-sm text-muted mt-1">{user.email}</p>
        </div>
        <Link
          href="/builder"
          className="bg-accent text-bg font-medium text-sm px-5 py-2.5 rounded-lg hover:opacity-85 transition-opacity"
        >
          + New plan
        </Link>
      </div>

      <DashboardClient plans={plans ?? []} progressLogs={progressLogs ?? []} userId={user.id} />
    </div>
  )
}
