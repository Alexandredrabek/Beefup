import type { DayPlan, Goal, Split, Diet } from '@/types'
import { GOAL_NAMES, SPLIT_NAMES } from '@/lib/planGenerator'
import Link from 'next/link'

interface Props {
  days: DayPlan[]
  goal: Goal
  split: Split
  diet: Diet[]
  mealsPerDay: number
  onSave?: () => void
  saving?: boolean
  onRestart?: () => void
  shareUuid?: string
  planId?: string
  readOnly?: boolean
}

export default function PlanOutput({ days, goal, split, diet, mealsPerDay, onSave, saving, onRestart, shareUuid, planId, readOnly }: Props) {
  const workoutDays = days.filter(d => !d.isRest).length
  const restDays = days.filter(d => d.isRest).length
  const totalMeals = mealsPerDay * 7

  const shareUrl = shareUuid ? `${typeof window !== 'undefined' ? window.location.origin : ''}/p/${shareUuid}` : null

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-6xl tracking-wider leading-none mb-3">
            {GOAL_NAMES[goal]}
          </h1>
          <div className="flex flex-wrap gap-2">
            <span className="font-mono-custom text-xs px-3 py-1 rounded-full border border-accent/30 text-accent bg-accent/6">
              {GOAL_NAMES[goal]}
            </span>
            <span className="font-mono-custom text-xs px-3 py-1 rounded-full border border-accent2/30 text-accent2 bg-accent2/6">
              {SPLIT_NAMES[split]}
            </span>
            {diet.length > 0 && diet[0] !== 'none' && (
              <span className="font-mono-custom text-xs px-3 py-1 rounded-full border border-white/15 text-muted">
                {diet.join(' · ')}
              </span>
            )}
          </div>
        </div>

        {!readOnly && (
          <div className="flex gap-2 flex-shrink-0">
            {onSave && (
              <button
                onClick={onSave}
                disabled={saving}
                className="bg-accent text-bg font-medium text-sm px-5 py-2.5 rounded-lg hover:opacity-85 transition-opacity disabled:opacity-40"
              >
                {saving ? 'Saving…' : '💾 Save plan'}
              </button>
            )}
            {onRestart && (
              <button
                onClick={onRestart}
                className="border border-white/15 text-muted text-sm px-4 py-2.5 rounded-lg hover:border-white/30 hover:text-[#f2f0e8] transition-all"
              >
                Start over
              </button>
            )}
          </div>
        )}
      </div>

      {/* Share link */}
      {shareUrl && (
        <div className="mb-6 p-4 rounded-xl border border-white/10 bg-surface flex items-center gap-3">
          <span className="text-sm text-muted flex-1 font-mono-custom truncate">{shareUrl}</span>
          <button
            onClick={() => navigator.clipboard.writeText(shareUrl)}
            className="text-xs text-accent hover:opacity-75 transition-opacity flex-shrink-0"
          >
            Copy link
          </button>
        </div>
      )}

      {/* Weekly summary */}
      <div className="grid grid-cols-4 gap-3 mb-8">
        {[
          { num: workoutDays, label: 'Training days' },
          { num: restDays, label: 'Rest days' },
          { num: totalMeals, label: 'Meals total' },
          { num: mealsPerDay, label: 'Meals / day' },
        ].map(s => (
          <div key={s.label} className="bg-surface2 rounded-xl p-4 text-center">
            <div className="font-display text-4xl text-accent">{s.num}</div>
            <div className="text-xs text-muted uppercase tracking-wide mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Day cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {days.map(day => (
          <div key={day.day} className="bg-surface border border-white/8 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/8">
              <span className="font-display text-2xl tracking-wide">{day.day}</span>
              <span className={`font-mono-custom text-xs px-3 py-1 rounded-full ${
                day.isRest ? 'bg-white/5 text-muted' : 'bg-accent/10 text-accent'
              }`}>
                {day.isRest ? 'rest' : 'training'}
              </span>
            </div>
            <div className="p-5 space-y-3">
              {day.workout && (
                <div className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                  <div>
                    <div className="text-sm text-[#f2f0e8]">{day.workout}</div>
                    <div className="text-xs text-muted font-mono-custom mt-0.5">workout</div>
                  </div>
                </div>
              )}
              {day.meals.map(meal => (
                <div key={meal.label} className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent2 mt-1.5 flex-shrink-0" />
                  <div>
                    <div className="text-sm text-[#f2f0e8]">{meal.name}</div>
                    <div className="text-xs text-muted font-mono-custom mt-0.5">{meal.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
