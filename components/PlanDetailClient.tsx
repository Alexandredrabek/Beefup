'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/supabase/client'
import { GOAL_NAMES, SPLIT_NAMES } from '@/lib/planGenerator'
import type { Plan, DayPlan } from '@/types'

export default function PlanDetailClient({ plan }: { plan: Plan }) {
  const [days, setDays] = useState<DayPlan[]>(plan.days)
  const [editing, setEditing] = useState<{ dayIdx: number; type: 'workout' | 'meal'; mealIdx?: number } | null>(null)
  const [editValue, setEditValue] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [isPublic, setIsPublic] = useState(plan.is_public)
  const router = useRouter()
  const supabase = createClient()

  const openEdit = (dayIdx: number, type: 'workout' | 'meal', mealIdx?: number) => {
    const day = days[dayIdx]
    const current = type === 'workout' ? (day.workout ?? '') : (day.meals[mealIdx!]?.name ?? '')
    setEditValue(current)
    setEditing({ dayIdx, type, mealIdx })
  }

  const saveEdit = () => {
    if (!editing) return
    setDays(prev => prev.map((day, i) => {
      if (i !== editing.dayIdx) return day
      if (editing.type === 'workout') return { ...day, workout: editValue, isRest: !editValue }
      const meals = day.meals.map((m, mi) => mi === editing.mealIdx ? { ...m, name: editValue } : m)
      return { ...day, meals }
    }))
    setEditing(null)
  }

  const savePlan = async () => {
    setSaving(true)
    await supabase.from('plans').update({ days, updated_at: new Date().toISOString() }).eq('id', plan.id)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const togglePublic = async () => {
    const next = !isPublic
    await supabase.from('plans').update({ is_public: next }).eq('id', plan.id)
    setIsPublic(next)
  }

  const copyShareLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/p/${plan.share_uuid}`)
  }

  const workoutDays = days.filter(d => !d.isRest).length

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-2">
        <div>
          <Link href="/dashboard" className="text-xs text-muted hover:text-[#f2f0e8] transition-colors mb-3 inline-block">
            ← Dashboard
          </Link>
          <h1 className="font-display text-6xl tracking-wider leading-none">{plan.title}</h1>
        </div>
        <div className="flex gap-2 flex-shrink-0 mt-6">
          <button
            onClick={savePlan}
            disabled={saving}
            className="bg-accent text-bg font-medium text-sm px-5 py-2.5 rounded-lg hover:opacity-85 transition-opacity disabled:opacity-40"
          >
            {saved ? '✓ Saved' : saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </div>

      {/* Badges + share */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <span className="font-mono-custom text-xs px-3 py-1 rounded-full border border-accent/30 text-accent bg-accent/6">
          {GOAL_NAMES[plan.goal]}
        </span>
        <span className="font-mono-custom text-xs px-3 py-1 rounded-full border border-accent2/30 text-accent2">
          {SPLIT_NAMES[plan.split]}
        </span>
        <span className="font-mono-custom text-xs text-muted">{workoutDays} training days</span>

        <div className="ml-auto flex items-center gap-3">
          <button
            onClick={togglePublic}
            className={`text-xs font-mono-custom px-3 py-1.5 rounded-lg border transition-all ${
              isPublic ? 'border-accent/30 text-accent bg-accent/5' : 'border-white/10 text-muted hover:border-white/20'
            }`}
          >
            {isPublic ? '🔓 Public' : '🔒 Private'}
          </button>
          {isPublic && (
            <button onClick={copyShareLink} className="text-xs text-accent hover:opacity-75 transition-opacity">
              Copy share link
            </button>
          )}
        </div>
      </div>

      {/* Edit tip */}
      <p className="text-xs text-muted mb-6">Click any meal or workout to edit it inline.</p>

      {/* Day cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {days.map((day, dayIdx) => (
          <div key={day.day} className="bg-surface border border-white/8 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/8">
              <span className="font-display text-2xl tracking-wide">{day.day}</span>
              <span className={`font-mono-custom text-xs px-3 py-1 rounded-full ${
                day.isRest ? 'bg-white/5 text-muted' : 'bg-accent/10 text-accent'
              }`}>
                {day.isRest ? 'rest' : 'training'}
              </span>
            </div>
            <div className="p-5 space-y-2">
              {/* Workout row */}
              <button
                onClick={() => openEdit(dayIdx, 'workout')}
                className="w-full text-left flex gap-3 group p-2 -mx-2 rounded-lg hover:bg-surface2 transition-colors"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-[#f2f0e8] truncate">{day.workout ?? 'Rest day'}</div>
                  <div className="text-xs text-muted font-mono-custom mt-0.5 flex items-center gap-2">
                    workout
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-accent">edit</span>
                  </div>
                </div>
              </button>

              {/* Meal rows */}
              {day.meals.map((meal, mealIdx) => (
                <button
                  key={meal.label}
                  onClick={() => openEdit(dayIdx, 'meal', mealIdx)}
                  className="w-full text-left flex gap-3 group p-2 -mx-2 rounded-lg hover:bg-surface2 transition-colors"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-accent2 mt-1.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-[#f2f0e8] truncate">{meal.name}</div>
                    <div className="text-xs text-muted font-mono-custom mt-0.5 flex items-center gap-2">
                      {meal.label}
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity text-accent">edit</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Edit modal */}
      {editing && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={e => { if (e.target === e.currentTarget) setEditing(null) }}
        >
          <div className="bg-surface border border-white/15 rounded-2xl p-6 w-full max-w-sm">
            <h3 className="font-display text-2xl tracking-wider mb-1">
              {editing.type === 'workout' ? 'Edit workout' : `Edit ${days[editing.dayIdx].meals[editing.mealIdx!]?.label}`}
            </h3>
            <p className="text-xs text-muted mb-5">{days[editing.dayIdx].day}</p>
            <input
              type="text"
              value={editValue}
              onChange={e => setEditValue(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && saveEdit()}
              autoFocus
              className="w-full bg-surface2 border border-white/10 rounded-lg px-4 py-3 text-sm text-[#f2f0e8] outline-none focus:border-accent/50 mb-4"
              placeholder={editing.type === 'workout' ? 'e.g. Push day — chest & shoulders' : 'e.g. Grilled chicken + rice'}
            />
            <div className="flex gap-2">
              <button onClick={() => setEditing(null)} className="flex-1 border border-white/10 text-muted py-2.5 rounded-lg text-sm hover:border-white/20 hover:text-[#f2f0e8] transition-all">
                Cancel
              </button>
              <button onClick={saveEdit} className="flex-[2] bg-accent text-bg font-medium py-2.5 rounded-lg text-sm hover:opacity-85 transition-opacity">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
