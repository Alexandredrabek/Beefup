import type { Goal, Split, Diet, DayPlan, BuilderState } from '@/types'

export const GOAL_NAMES: Record<Goal, string> = {
  muscle: 'Build Muscle', cut: 'Lean Out', performance: 'Peak Performance',
  recomp: 'Body Recomp', health: 'General Health', endurance: 'Endurance',
}

export const SPLIT_NAMES: Record<Split, string> = {
  ppl: 'Push/Pull/Legs', 'upper-lower': 'Upper/Lower', fullbody: 'Full Body',
  bro: 'Bro Split', athletic: 'Athletic HIIT', cardio: 'Cardio Focus',
}

const SPLIT_PLANS: Record<Split, { workouts: string[]; isRest: boolean[] }> = {
  ppl: {
    workouts: ['Push — chest · shoulders · triceps', 'Pull — back · biceps · rear delts', 'Legs — quads · hamstrings · glutes', 'Push — incline focus · lateral delts', 'Pull — back width · arm detail', 'Legs — posterior chain emphasis', 'Rest / mobility'],
    isRest: [false, false, false, false, false, false, true],
  },
  'upper-lower': {
    workouts: ['Upper — push emphasis', 'Lower — quad dominant', 'Rest', 'Upper — pull emphasis', 'Lower — hinge dominant', 'Active rest', 'Rest'],
    isRest: [false, false, true, false, false, true, true],
  },
  fullbody: {
    workouts: ['Full body A — squat pattern', 'Active rest / cardio', 'Full body B — hinge pattern', 'Active rest / cardio', 'Full body C — push + pull', 'Active rest', 'Rest'],
    isRest: [false, true, false, true, false, true, true],
  },
  bro: {
    workouts: ['Chest day', 'Back day', 'Shoulder day', 'Arm day', 'Leg day', 'Core + cardio', 'Rest'],
    isRest: [false, false, false, false, false, false, true],
  },
  athletic: {
    workouts: ['HIIT circuit A', 'Strength + power', 'Rest', 'HIIT circuit B', 'Functional strength', 'Conditioning', 'Rest'],
    isRest: [false, false, true, false, false, false, true],
  },
  cardio: {
    workouts: ['Steady-state run 45min', 'Light strength', 'Cycling / rowing 40min', 'Active rest', 'Interval run', 'Long run / ride', 'Rest'],
    isRest: [false, false, false, true, false, false, true],
  },
}

type MealSet = { breakfast: string[]; lunch: string[]; dinner: string[]; snack: string[] }
const MEAL_DATA: Partial<Record<Goal, Partial<Record<string, MealSet>>>> = {
  muscle: {
    none: {
      breakfast: ['Egg white omelette + oats + banana', 'Protein pancakes + greek yogurt', 'Scrambled eggs + avocado toast'],
      lunch: ['Chicken breast + brown rice + broccoli', 'Beef stir fry + jasmine rice', 'Turkey wrap + sweet potato fries'],
      dinner: ['Salmon + quinoa + asparagus', 'Lean beef mince + pasta + tomato sauce', 'Grilled chicken + roasted veg + couscous'],
      snack: ['Cottage cheese + fruit', 'Protein shake + rice cakes', 'Greek yogurt + almonds'],
    },
    vegetarian: {
      breakfast: ['Tofu scramble + whole wheat toast', 'Protein oats + nut butter + berries', 'Egg frittata + spinach'],
      lunch: ['Lentil & chickpea bowl + brown rice', 'Black bean tacos + guac + salsa', 'Paneer tikka + roti + raita'],
      dinner: ['Tempeh stir fry + soba noodles', 'Chickpea curry + basmati rice', 'Stuffed peppers + quinoa'],
      snack: ['Hard-boiled eggs', 'Edamame + hummus', 'String cheese + apple'],
    },
    vegan: {
      breakfast: ['Tofu scramble + sweet potato hash', 'Overnight oats + hemp seeds + berries', 'Smoothie bowl + granola + banana'],
      lunch: ['Chickpea + quinoa power bowl', 'Lentil soup + whole grain bread', 'Tempeh wrap + avocado + veg'],
      dinner: ['Black bean & corn tacos', 'Tofu curry + brown rice', 'Stuffed portobello mushrooms + lentils'],
      snack: ['Edamame + rice cakes', 'Peanut butter + apple', 'Trail mix + dried fruit'],
    },
    keto: {
      breakfast: ['Bacon + eggs + avocado', 'Keto egg muffins + cheese', 'Smoked salmon + cream cheese + cucumber'],
      lunch: ['Bunless burger + coleslaw', 'Tuna salad lettuce wraps', 'Chicken caesar (no croutons)'],
      dinner: ['Steak + roasted veg + butter sauce', 'Baked salmon + creamed spinach', 'Ground beef + zucchini noodles'],
      snack: ['Almonds + macadamia nuts', 'Cheddar + salami', 'Pork rinds + guacamole'],
    },
  },
  cut: {
    none: {
      breakfast: ['Egg whites + oatmeal + berries', 'Low-fat Greek yogurt + flaxseed', 'Protein smoothie (low carb)'],
      lunch: ['Grilled chicken salad + lemon dressing', 'Turkey lettuce wraps + salsa', 'Tuna + brown rice + edamame'],
      dinner: ['White fish + steamed veg', 'Shrimp + cauliflower rice + veg', 'Chicken breast + roasted zucchini'],
      snack: ['Apple + 1 tbsp almond butter', 'Celery + hummus', 'Low-fat cottage cheese'],
    },
    vegan: {
      breakfast: ['Green smoothie + protein powder', 'Overnight oats (light) + berries', 'Tofu scramble + spinach'],
      lunch: ['Big salad + chickpeas + tahini dressing', 'Veggie sushi bowl', 'Lentil + veggie soup'],
      dinner: ['Zucchini noodles + marinara', 'Cauliflower fried rice + tofu', 'Stuffed peppers (low cal)'],
      snack: ['Rice cakes + nut butter', 'Fruit salad', 'Cucumber + hummus'],
    },
    keto: {
      breakfast: ['Eggs + avocado (no toast)', 'Bulletproof coffee + boiled eggs', 'Cheese omelette'],
      lunch: ['Chicken caesar (no croutons)', 'BLT wrap in lettuce', 'Egg salad on cucumber slices'],
      dinner: ['Salmon + green beans', 'Chicken thighs + cauliflower mash', 'Lamb chops + roasted asparagus'],
      snack: ['Mixed nuts (small)', 'Beef jerky', 'Hard cheese + olives'],
    },
  },
}

function getMealSet(goal: Goal, diet: Diet[]): MealSet {
  const goalKey = goal === 'cut' ? 'cut' : 'muscle'
  const data = MEAL_DATA[goalKey] ?? {}
  const match = diet.find(d => data[d])
  return data[match ?? 'none'] ?? data['none'] ?? {
    breakfast: ['Oatmeal + protein shake'],
    lunch: ['Grilled chicken + rice'],
    dinner: ['Salmon + vegetables'],
    snack: ['Greek yogurt'],
  }
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const MEAL_LABELS = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Pre-workout', 'Post-workout']

export function generatePlan(state: BuilderState): DayPlan[] {
  if (!state.goal || !state.split) return []
  const splitPlan = SPLIT_PLANS[state.split]
  const meals = getMealSet(state.goal, state.diet)
  const mealSets = [meals.breakfast, meals.lunch, meals.dinner, meals.snack, meals.snack, meals.snack]

  return DAYS.map((day, i) => ({
    day,
    workout: splitPlan.isRest[i] ? null : splitPlan.workouts[i],
    isRest: splitPlan.isRest[i],
    meals: Array.from({ length: state.mealsPerDay }, (_, mi) => ({
      label: MEAL_LABELS[mi] ?? `Meal ${mi + 1}`,
      name: mealSets[mi]?.[i % mealSets[mi].length] ?? 'Balanced meal',
    })),
  }))
}
