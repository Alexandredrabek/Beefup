'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') ?? '/dashboard'
  const supabase = createClient()

  const sendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?redirect=${redirect}` },
    })
    if (error) setError(error.message)
    else setSent(true)
    setLoading(false)
  }

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?redirect=${redirect}` },
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 pt-20">
      <div className="w-full max-w-sm">
        <Link href="/" className="font-display text-3xl tracking-widest block mb-10">
          BEEF<span className="text-accent">UP</span>
        </Link>

        {sent ? (
          <div className="border border-white/10 rounded-xl p-8 bg-surface text-center">
            <div className="text-3xl mb-4">📬</div>
            <h2 className="font-medium text-lg mb-2">Check your inbox</h2>
            <p className="text-sm text-muted leading-relaxed">
              We sent a magic link to <span className="text-[#f2f0e8]">{email}</span>.<br />
              Click it to sign in — no password needed.
            </p>
            <button
              onClick={() => setSent(false)}
              className="mt-6 text-sm text-muted hover:text-[#f2f0e8] transition-colors"
            >
              Use a different email
            </button>
          </div>
        ) : (
          <div className="border border-white/10 rounded-xl p-8 bg-surface">
            <h1 className="font-display text-4xl tracking-wider mb-1">SIGN IN</h1>
            <p className="text-sm text-muted mb-8">Save plans, track progress, share your week.</p>

            <button
              onClick={signInWithGoogle}
              className="w-full flex items-center justify-center gap-3 py-3 rounded-lg border border-white/10 bg-surface2 hover:border-white/20 transition-colors text-sm font-medium mb-6"
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/8" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-surface px-3 text-xs text-muted">or email magic link</span>
              </div>
            </div>

            <form onSubmit={sendMagicLink} className="space-y-4">
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-surface2 border border-white/10 rounded-lg px-4 py-3 text-sm text-[#f2f0e8] placeholder-muted outline-none focus:border-accent/50 transition-colors"
              />
              {error && <p className="text-xs text-red-400">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-accent text-bg font-medium py-3 rounded-lg text-sm hover:opacity-85 transition-opacity disabled:opacity-40"
              >
                {loading ? 'Sending…' : 'Send magic link →'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
