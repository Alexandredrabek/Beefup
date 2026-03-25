'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/supabase/client'
import { generatePlan, GOAL_NAMES, SPLIT_NAMES } from '@/lib/planGenerator'
import type { BuilderState, Goal, Split, Diet } from '@/types'
import PlanOutput from '@/components/PlanOutput'

const GOALS: { val: Goal; icon: string; name: string; desc: string }[] = [
  { val: 'muscle', icon: '💪', name: 'Build muscle', desc: 'Hypertrophy focus, caloric surplus, high protein' },
  { val: 'cut', icon: '🔥', name: 'Lose fat', desc: 'Lean out while preserving muscle mass' },
  { val: 'performance', icon: '⚡', name: 'Performance', desc: 'Strength + endurance, athletic output' },
  { val: 'recomp', icon: '⚖️', name: 'Body recomp', desc: 'Lose fat and gain muscle simultaneously' },
  { val: 'health', icon: '🌿', name: 'General health', desc: 'Balanced nutrition and consistent movement' },
  { val: 'endurance', icon: '🏃', name: 'Endurance', desc: 'Cardio-heavy plan, fueling long sessions' },
]

const DIETS: { val: Diet; label: string }[] = [
  { val: 'none', label: 'No restrictions' },
  { val: 'vegetarian', label: 'Vegetarian' },
  { val: 'vegan', label: 'Vegan' },
  { val: 'gluten-free', label: 'Gluten-free' },
  { val: 'dairy-free', label: 'Dairy-free' },
  { val: 'keto', label: 'Keto' },
  { val: 'paleo', label: 'Paleo' },
  { val: 'halal', label: 'Halal' },
]

const SPLITS: { val: Split; icon: string; name: string; desc: string }[] = [
  { val: 'ppl', icon: '🔄', name: 'Push / Pull / Legs', desc: 'Classic 6-day split. Max volume for muscle growth.' },
  { val: 'upper-lower', icon: '↕️', name: 'Upper / Lower', desc: '4-day split. Great balance of frequency and recovery.' },
  { val: 'fullbody', icon: '🏋️', name: 'Full body', desc: '3x per week. Best for beginners and busy schedules.' },
  { val: 'bro', icon: '💿', name: 'Bro split', desc: 'One muscle group per day. Classic bodybuilder style.' },
  { val: 'athletic', icon: '🤸', name: 'Athletic / HIIT', desc: 'Functional training + cardio circuits. High intensity.' },
  { val: 'cardio', icon: '🚴', name: 'Cardio focus', desc: 'Endurance-led plan with light strength work.' },
]

export default function BuilderPage() {
  const [step, setStep] = useState(0)
  const [state, setState] = useState<BuilderState>({ goal: null, diet: [], mealsPerDay: 3, split: null })
  const [saving, setSaving] = useState(false)
  const [planId, setPlanId] = useState<string | null>(null)
  const [generated, setGenerated] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const toggleDiet = (val: Diet) => {
    if (val === 'none') { setState(s => ({ ...s, diet: ['none'] })); return }
    setState(s => {
      const without = s.diet.filter(d => d !== 'none' && d !== val)
      return { ...s, diet: s.diet.includes(val) ? without : [...without, val] }
    })
  }

  const days = state.goal && state.split ? generatePlan(state) : []

  const handleGenerate = () => setGenerated(true)

  const savePlan = async () => {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login?redirect=/builder'); return }

    const shareUuid = crypto.randomUUID()
    const { data, error } = await supabase.from('plans').insert({
      user_id: user.id,
      title: GOAL_NAMES[state.goal!],
      goal: state.goal,
      split: state.split,
      diet: state.diet,
      meals_per_day: state.mealsPerDay,
      days,
      is_public: false,
      share_uuid: shareUuid,
    }).select().single()

    setSaving(false)
    if (!error && data) { setPlanId(data.id); router.push(`/plan/${data.id}`) }
  }

  const stepLabels = ['01 — Goal', '02 — Diet', '03 — Training']

  if (generated && days.length > 0) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-6 max-w-5xl mx-auto">
        <PlanOutput
          days={days}
          goal={state.goal!}
          split={state.split!}
          diet={state.diet}
          mealsPerDay={state.mealsPerDay}
          onSave={savePlan}
          saving={saving}
          onRestart={() => { setGenerated(false); setStep(0); setState({ goal: null, diet: [], mealsPerDay: 3, split: null }) }}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-6 max-w-4xl mx-auto">
      <p className="font-mono-custom text-xs text-accent tracking-widest uppercase mb-2">// plan builder</p>
      <h1 className="font-display text-6xl tracking-wider mb-1">CUSTOMIZE<br />YOUR PLAN</h1>
      <p className="text-sm text-muted mb-10">Answer 3 questions. Get a full weekly meal + training schedule.</p>

      {/* Step indicator */}
      <div className="flex rounded-lg overflow-hidden border border-white/10 mb-10">
        {stepLabels.map((label, i) => (
          <button
            key={i}
            onClick={() => i < step || (i === 1 && state.goal) || (i === 2 && state.goal) ? setStep(i) : null}
            className={`flex-1 py-3 text-xs font-mono-custom tracking-wide border-r border-white/10 last:border-r-0 transition-all ${
              i === step ? 'bg-accent text-bg' : i < step ? 'bg-accent/10 text-accent' : 'bg-surface text-muted2'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Step 0: Goal */}
      {step === 0 && (
        <div>
          <p className="text-xs font-medium text-muted uppercase tracking-wider mb-4">What&apos;s your primary goal?</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-8">
            {GOALS.map(g => (
              <button
                key={g.val}
                onClick={() => setState(s => ({ ...s, goal: g.val }))}
                className={`relative text-left p-5 rounded-xl border transition-all ${
                  state.goal === g.val
                    ? 'border-accent bg-accent/5'
                    : 'border-white/8 bg-surface hover:border-white/15 hover:bg-surface2'
                }`}
              >
                {state.goal === g.val && (
                  <span className="absolute top-3 right-3 text-accent text-sm font-bold">✓</span>
                )}
                <span className="text-2xl block mb-2">{g.icon}</span>
                <div className="font-medium text-[#f2f0e8] mb-1">{g.name}</div>
                <div className="text-xs text-muted leading-relaxed">{g.desc}</div>
              </button>
            ))}
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => setStep(1)}
              disabled={!state.goal}
              className="bg-accent text-bg font-medium px-8 py-3 rounded-lg text-sm hover:opacity-85 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* Step 1: Diet */}
      {step === 1 && (
        <div>
          <p className="text-xs font-medium text-muted uppercase tracking-wider mb-4">Dietary preferences</p>
          <div className="flex flex-wrap gap-2 mb-8">
            {DIETS.map(d => (
              <button
                key={d.val}
                onClick={() => toggleDiet(d.val)}
                className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                  state.diet.includes(d.val)
                    ? 'border-accent text-accent bg-accent/8'
                    : 'border-white/15 text-muted hover:border-white/25 hover:text-[#f2f0e8]'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>

          <p className="text-xs font-medium text-muted uppercase tracking-wider mb-4">Meals per day</p>
          <div className="flex items-center gap-4 mb-10">
            <span className="font-display text-5xl text-accent w-14">{state.mealsPerDay}</span>
            <div className="flex-1">
              <input
                type="range" min={2} max={6} step={1}
                value={state.mealsPerDay}
                onChange={e => setState(s => ({ ...s, mealsPerDay: Number(e.target.value) }))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted2 mt-1">
                <span>2</span><span>3</span><span>4</span><span>5</span><span>6</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <button onClick={() => setStep(0)} className="border border-white/15 text-muted px-6 py-3 rounded-lg text-sm hover:border-white/30 hover:text-[#f2f0e8] transition-all">
              ← Back
            </button>
            <button onClick={() => setStep(2)} className="bg-accent text-bg font-medium px-8 py-3 rounded-lg text-sm hover:opacity-85 transition-opacity">
              Next →
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Split */}
      {step === 2 && (
        <div>
          <p className="text-xs font-medium text-muted uppercase tracking-wider mb-4">Choose your workout split</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            {SPLITS.map(s => (
              <button
                key={s.val}
                onClick={() => setState(st => ({ ...st, split: s.val }))}
                className={`relative text-left p-5 rounded-xl border transition-all ${
                  state.split === s.val
                    ? 'border-accent bg-accent/5'
                    : 'border-white/8 bg-surface hover:border-white/15 hover:bg-surface2'
                }`}
              >
                {state.split === s.val && (
                  <span className="absolute top-3 right-3 text-accent text-sm font-bold">✓</span>
                )}
                <span className="text-2xl block mb-2">{s.icon}</span>
                <div className="font-medium text-[#f2f0e8] mb-1">{s.name}</div>
                <div className="text-xs text-muted leading-relaxed">{s.desc}</div>
              </button>
            ))}
          </div>

          <div className="flex justify-between">
            <button onClick={() => setStep(1)} className="border border-white/15 text-muted px-6 py-3 rounded-lg text-sm hover:border-white/30 hover:text-[#f2f0e8] transition-all">
              ← Back
            </button>
            <button
              onClick={handleGenerate}
              disabled={!state.split}
              className="bg-accent text-bg font-medium px-8 py-3 rounded-lg text-sm hover:opacity-85 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Generate my plan →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
