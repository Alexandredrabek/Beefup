import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20 overflow-hidden">
        {/* Grid background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(232,255,71,0.035) 1px, transparent 1px),
              linear-gradient(90deg, rgba(232,255,71,0.035) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            maskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, black 0%, transparent 100%)',
          }}
        />

        <div className="relative z-10 flex flex-col items-center animate-fade-up">
          <span className="font-mono-custom text-xs text-accent tracking-widest uppercase bg-accent/10 border border-accent/20 px-4 py-1.5 rounded-full mb-8">
            Free meal + workout planner
          </span>

          <h1 className="font-display text-[clamp(72px,12vw,140px)] leading-[0.92] tracking-wider text-[#f2f0e8]">
            YOUR PLAN.<br />
            <span className="text-accent">YOUR RULES.</span>
          </h1>

          <p className="text-lg font-light text-muted max-w-md mt-6 mb-10 leading-relaxed">
            Stop guessing. Get a <span className="text-[#f2f0e8] font-medium">custom weekly plan</span> built
            around your goal, diet, and training style — in under 2 minutes.
          </p>

          <Link
            href="/builder"
            className="bg-accent text-bg font-medium text-base px-10 py-4 rounded hover:opacity-90 transition-all hover:-translate-y-0.5"
          >
            Build my plan free →
          </Link>

          <div className="flex gap-12 mt-16">
            {[
              { num: '3', label: 'quick questions' },
              { num: '7', label: 'day plan' },
              { num: '0', label: 'cost' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className="font-display text-4xl text-accent">{s.num}</div>
                <div className="text-xs text-muted mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-white/5 py-24 px-6 max-w-5xl mx-auto">
        <p className="font-mono-custom text-xs text-accent tracking-widest uppercase mb-3">// why beefup</p>
        <h2 className="font-display text-6xl tracking-wider mb-16">BUILT DIFFERENT</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: '🎯', title: 'Goal-first planning', desc: 'Every meal and session is calibrated to your specific objective — not a generic template.' },
            { icon: '🥦', title: 'Real dietary support', desc: 'Vegan, keto, gluten-free and more — your plan adapts to your food requirements.' },
            { icon: '📆', title: 'Full week mapped out', desc: 'Every day planned — what to eat, when to train, and when to rest. Zero guesswork.' },
            { icon: '💾', title: 'Save & revisit', desc: 'Create an account to save your plan and track your weekly progress over time.' },
            { icon: '✏️', title: 'Edit anytime', desc: 'Swap meals, change workouts, adjust your plan as your goals evolve.' },
            { icon: '🔗', title: 'Share your plan', desc: 'Generate a public link to share your plan with friends, coaches, or your team.' },
          ].map(f => (
            <div key={f.title} className="p-6 border border-white/5 rounded-xl bg-surface hover:border-white/10 transition-colors">
              <div className="text-2xl mb-4">{f.icon}</div>
              <div className="font-medium text-[#f2f0e8] mb-2">{f.title}</div>
              <div className="text-sm text-muted leading-relaxed">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA strip */}
      <section className="border-t border-white/5 py-24 px-6 text-center">
        <h2 className="font-display text-7xl tracking-wider mb-6">READY TO<br /><span className="text-accent">BEEF UP?</span></h2>
        <Link
          href="/builder"
          className="inline-block bg-accent text-bg font-medium text-base px-12 py-4 rounded hover:opacity-90 transition-all hover:-translate-y-0.5"
        >
          Start building →
        </Link>
      </section>

      <footer className="border-t border-white/5 py-6 px-8 flex items-center justify-between">
        <span className="font-display text-xl tracking-widest text-muted2">
          BEEF<span className="text-accent">UP</span>
        </span>
        <span className="text-xs text-muted2">© 2026 beefup.com — free forever</span>
      </footer>
    </div>
  )
}
