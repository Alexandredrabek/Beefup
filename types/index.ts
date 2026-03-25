export type Goal = 'muscle' | 'cut' | 'performance' | 'recomp' | 'health' | 'endurance'
export type Split = 'ppl' | 'upper-lower' | 'fullbody' | 'bro' | 'athletic' | 'cardio'
export type Diet = 'none' | 'vegetarian' | 'vegan' | 'gluten-free' | 'dairy-free' | 'keto' | 'paleo' | 'halal'

export interface DayPlan {
  day: string
  workout: string | null
  isRest: boolean
  meals: { label: string; name: string }[]
}

export interface Plan {
  id: string
  user_id: string
  title: string
  goal: Goal
  split: Split
  diet: Diet[]
  meals_per_day: number
  days: DayPlan[]
  is_public: boolean
  share_uuid: string
  created_at: string
  updated_at: string
}

export interface ProgressLog {
  id: string
  user_id: string
  plan_id: string
  week: number
  weight_kg: number | null
  notes: string | null
  workouts_completed: number
  created_at: string
}

export interface BuilderState {
  goal: Goal | null
  diet: Diet[]
  mealsPerDay: number
  split: Split | null
}
