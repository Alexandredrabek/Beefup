'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/supabase/client'
import type { User } from '@supabase/supabase-js'

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const [loaded, setLoaded] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      setLoaded(true)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 border-b border-white/5 bg-bg/85 backdrop-blur-md">
      <Link href="/" className="font-display text-2xl tracking-widest text-[#f2f0e8]">
        BEEF<span className="text-accent">UP</span>
      </Link>

      <div className="flex items-center gap-3">
        {loaded && (
          <>
            {user ? (
              <>
                <Link href="/dashboard" className="text-sm text-muted hover:text-[#f2f0e8] transition-colors">
                  Dashboard
                </Link>
                <button
                  onClick={signOut}
                  className="text-sm text-muted hover:text-[#f2f0e8] transition-colors"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm text-muted hover:text-[#f2f0e8] transition-colors">
                  Sign in
                </Link>
                <Link
                  href="/builder"
                  className="text-sm font-medium bg-accent text-bg px-5 py-2 rounded hover:opacity-85 transition-opacity"
                >
                  Build my plan
                </Link>
              </>
            )}
          </>
        )}
      </div>
    </nav>
  )
}
