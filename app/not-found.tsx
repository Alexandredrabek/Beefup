import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <p className="font-mono-custom text-xs text-accent tracking-widest uppercase mb-4">404</p>
      <h1 className="font-display text-8xl tracking-wider mb-4">NOT FOUND</h1>
      <p className="text-muted mb-8">This page doesn&apos;t exist — or the plan is private.</p>
      <Link href="/" className="bg-accent text-bg font-medium px-8 py-3 rounded-lg text-sm hover:opacity-85 transition-opacity">
        Back home
      </Link>
    </div>
  )
}
