# beefup

Custom weekly meal prep + workout planner. Built with Next.js 14 App Router + Supabase.

---

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Backend / DB | Supabase (Postgres + Auth + RLS) |
| Deployment | Vercel (recommended) |

---

## Project structure

```
beefup/
├── app/
│   ├── page.tsx              # Landing page / hero
│   ├── layout.tsx            # Root layout + Navbar
│   ├── not-found.tsx         # 404 page
│   ├── login/page.tsx        # Magic link + Google OAuth
│   ├── builder/page.tsx      # 3-step plan wizard (client)
│   ├── dashboard/page.tsx    # Saved plans + progress tracker
│   ├── plan/[id]/page.tsx    # View + inline edit a plan
│   ├── p/[uuid]/page.tsx     # Public share page (no auth)
│   ├── auth/callback/        # OAuth / magic link callback
│   └── api/
│       ├── plans/route.ts        # GET all, POST new
│       ├── plans/[id]/route.ts   # GET one, PATCH, DELETE
│       └── progress/route.ts     # GET logs, POST new log
├── components/
│   ├── Navbar.tsx            # Top nav with auth state
│   ├── PlanOutput.tsx        # Read-only plan display
│   ├── PlanDetailClient.tsx  # Editable plan (inline editing)
│   └── DashboardClient.tsx   # Plans list + progress logger
├── lib/
│   └── planGenerator.ts      # Pure plan generation logic
├── supabase/
│   ├── client.ts             # Browser Supabase client
│   ├── server.ts             # Server Supabase client
│   ├── middleware.ts         # Session refresh + route protection
│   └── migrations.sql        # Full DB schema — run once in Supabase
├── types/index.ts            # Shared TypeScript types
└── middleware.ts             # Next.js middleware entry
```

---

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up Supabase

1. Create a free project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of `supabase/migrations.sql`
3. In **Authentication > Providers**, enable **Google** (optional) and set your redirect URL to `http://localhost:3000/auth/callback`

### 3. Configure environment variables

```bash
cp .env.local.example .env.local
```

Fill in your values from the Supabase project dashboard:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Features

- **3-step builder** — goal → diet → split → generates a full 7-day plan
- **Save plans** — requires login; plans stored in Supabase Postgres
- **Inline editing** — click any meal or workout to edit it on `/plan/[id]`
- **Progress tracker** — log weekly check-ins (weight, workouts, notes)
- **Share links** — toggle a plan public to generate `/p/[uuid]` share URL
- **Auth** — magic link email + Google OAuth via Supabase Auth
- **RLS** — users can only access their own data; public plans readable by anyone

---

## Deploying to Vercel

```bash
npm install -g vercel
vercel
```

Set the same environment variables in your Vercel project settings. Change `NEXT_PUBLIC_APP_URL` to your production URL and update the Supabase auth redirect URLs accordingly.

---

## Database schema

Two tables: `plans` and `progress_logs`. Full schema in `supabase/migrations.sql`.

```
plans
  id, user_id, title, goal, split, diet[], meals_per_day,
  days (jsonb), is_public, share_uuid, created_at, updated_at

progress_logs
  id, user_id, plan_id, week, weight_kg, notes,
  workouts_completed, created_at
```
# Beefup
# Beefup
# Beefup
