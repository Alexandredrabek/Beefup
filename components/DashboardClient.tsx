'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/supabase/client'
import { GOAL_NAMES, SPLIT_NAMES } from '@/lib/planGenerator'
import type { Plan, ProgressLog } from '@/types'

interface Props {
  plans: Partial<Plan>[]
  progressLogs: ProgressLog[]
  userId: string
}

export default function DashboardClient({ plans, progressLogs, userId }: Props) {
  const [activeTab, setActiveTab] = useState<'plans' | 'progress'>('plans')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [logForm, setLogForm] = useState({ planId: '', week: 1, weight: '', notes: '', workouts: 0 })
  const [logging, setLogging] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const deletePlan = async (id: string) => {
    if (!confirm('Delete this plan?')) return
    setDeletingId(id)
    await supabase.from('plans').delete().eq('id', id)
    setDeletingId(null)
    router.refresh()
  }

  const togglePublic = async (plan: Partial<Plan>) => {
    setTogglingId(plan.id!)
    await supabase.from('plans').update({ is_public: !plan.is_public }).eq('id', plan.id!)
    setTogglingId(null)
    router.refresh()
  }

  const copyShareLink = (uuid: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/p/${uuid}`)
  }

  const submitLog = async (e: React.FormEvent) => {
    e.preventDefault()
    setLogging(true)
    await supabase.from('progress_logs').insert({
      user_id: userId,
      plan_id: logForm.planId || plans[0]?.id,
      week: logForm.week,
      weight_kg: logForm.weight ? Number(logForm.weight) : null,
      notes: logForm.notes || null,
      workouts_completed: logForm.workouts,
    })
    setLogging(false)
    setLogForm({ planId: '', week: 1, weight: '', notes: '', workouts: 0 })
    router.refresh()
  }

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-1 mb-8 bg-surface rounded-lg p-1 w-fit">
        {(['plans', 'progress'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-md text-sm font-medium transition-all capitalize ${
              activeTab === tab ? 'bg-surface3 text-[#f2f0e8]' : 'text-muted hover:text-[#f2f0e8]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Plans tab */}
      {activeTab === 'plans' && (
        <div>
          {plans.length === 0 ? (
            <div className="text-center py-20 border border-white/8 rounded-xl bg-surface">
              <div className="text-4xl mb-4">📋</div>
              <p className="text-muted mb-6">No plans yet. Build your first one!</p>
              <Link href="/builder" className="bg-accent text-bg font-medium text-sm px-6 py-2.5 rounded-lg hover:opacity-85 transition-opacity">
                Build a plan →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {plans.map(plan => (
                <div key={plan.id} className="bg-surface border border-white/8 rounded-xl p-5 hover:border-white/15 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-display text-2xl tracking-wide">{plan.title ?? GOAL_NAMES[plan.goal!]}</h3>
                      <p className="text-xs text-muted font-mono-custom mt-0.5">
                        {SPLIT_NAMES[plan.split!]} · {plan.meals_per_day} meals/day
                      </p>
                    </div>
                    {plan.is_public && (
                      <span className="text-xs font-mono-custom text-accent bg-accent/10 border border-accent/20 px-2 py-0.5 rounded-full">
                        public
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {plan.diet && plan.diet.filter(d => d !== 'none').map(d => (
                      <span key={d} className="text-xs text-muted border border-white/10 px-2 py-0.5 rounded-full">{d}</span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <Link
                      href={`/plan/${plan.id}`}
                      className="text-xs bg-surface2 hover:bg-surface3 border border-white/10 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      View & edit
                    </Link>
                    <button
                      onClick={() => togglePublic(plan)}
                      disabled={togglingId === plan.id}
                      className="text-xs border border-white/10 px-3 py-1.5 rounded-lg hover:border-white/20 transition-colors text-muted hover:text-[#f2f0e8] disabled:opacity-40"
                    >
                      {plan.is_public ? 'Make private' : 'Make public'}
                    </button>
                    {plan.is_public && plan.share_uuid && (
                      <button
                        onClick={() => copyShareLink(plan.share_uuid!)}
                        className="text-xs text-accent hover:opacity-75 transition-opacity"
                      >
                        Copy link
                      </button>
                    )}
                    <button
                      onClick={() => deletePlan(plan.id!)}
                      disabled={deletingId === plan.id}
                      className="text-xs text-red-400/60 hover:text-red-400 transition-colors ml-auto disabled:opacity-40"
                    >
                      {deletingId === plan.id ? 'Deleting…' : 'Delete'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Progress tab */}
      {activeTab === 'progress' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Log form */}
          <div>
            <h2 className="font-display text-3xl tracking-wider mb-4">LOG WEEK</h2>
            <form onSubmit={submitLog} className="bg-surface border border-white/8 rounded-xl p-5 space-y-4">
              {plans.length > 1 && (
                <div>
                  <label className="text-xs text-muted uppercase tracking-wider block mb-1.5">Plan</label>
                  <select
                    value={logForm.planId}
                    onChange={e => setLogForm(s => ({ ...s, planId: e.target.value }))}
                    className="w-full bg-surface2 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-[#f2f0e8] outline-none focus:border-accent/50"
                  >
                    {plans.map(p => <option key={p.id} value={p.id}>{p.title ?? GOAL_NAMES[p.goal!]}</option>)}
                  </select>
                </div>
              )}

              <div>
                <label className="text-xs text-muted uppercase tracking-wider block mb-1.5">Week #</label>
                <input
                  type="number" min={1} max={52}
                  value={logForm.week}
                  onChange={e => setLogForm(s => ({ ...s, week: Number(e.target.value) }))}
                  className="w-full bg-surface2 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-[#f2f0e8] outline-none focus:border-accent/50"
                />
              </div>

              <div>
                <label className="text-xs text-muted uppercase tracking-wider block mb-1.5">Weight (kg)</label>
                <input
                  type="number" step="0.1" placeholder="Optional"
                  value={logForm.weight}
                  onChange={e => setLogForm(s => ({ ...s, weight: e.target.value }))}
                  className="w-full bg-surface2 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-[#f2f0e8] placeholder-muted outline-none focus:border-accent/50"
                />
              </div>

              <div>
                <label className="text-xs text-muted uppercase tracking-wider block mb-1.5">Workouts completed</label>
                <div className="flex items-center gap-3">
                  <span className="font-display text-3xl text-accent w-8">{logForm.workouts}</span>
                  <input
                    type="range" min={0} max={7} step={1}
                    value={logForm.workouts}
                    onChange={e => setLogForm(s => ({ ...s, workouts: Number(e.target.value) }))}
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-muted uppercase tracking-wider block mb-1.5">Notes</label>
                <textarea
                  rows={3}
                  placeholder="How was the week? Any wins or struggles?"
                  value={logForm.notes}
                  onChange={e => setLogForm(s => ({ ...s, notes: e.target.value }))}
                  className="w-full bg-surface2 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-[#f2f0e8] placeholder-muted outline-none focus:border-accent/50 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={logging || plans.length === 0}
                className="w-full bg-accent text-bg font-medium py-2.5 rounded-lg text-sm hover:opacity-85 transition-opacity disabled:opacity-40"
              >
                {logging ? 'Saving…' : 'Log this week →'}
              </button>
            </form>
          </div>

          {/* Progress history */}
          <div>
            <h2 className="font-display text-3xl tracking-wider mb-4">HISTORY</h2>
            {progressLogs.length === 0 ? (
              <div className="text-center py-12 border border-white/8 rounded-xl bg-surface">
                <p className="text-muted text-sm">No logs yet. Start tracking!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {progressLogs.map(log => (
                  <div key={log.id} className="bg-surface border border-white/8 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-display text-xl tracking-wide">Week {log.week}</span>
                      <div className="flex gap-3 text-xs font-mono-custom text-muted">
                        {log.weight_kg && <span>{log.weight_kg} kg</span>}
                        <span>{log.workouts_completed}/7 workouts</span>
                      </div>
                    </div>
                    {log.notes && <p className="text-sm text-muted leading-relaxed">{log.notes}</p>}
                    <p className="text-xs text-muted2 mt-2">{new Date(log.created_at).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
