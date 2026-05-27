'use client'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Nav from '@/components/Nav'
import Link from 'next/link'
import animeDb from '@/lib/anime.json'
import type { Anime } from '@/lib/types'

const db = animeDb as Anime[]

const GENRE_FILTERS = [
  { label: 'All',          value: '',         emoji: '✦'  },
  { label: 'Action',       value: 'action',   emoji: '⚔️' },
  { label: 'Psychological',value: 'mystery',  emoji: '🔮' },
  { label: 'Romance',      value: 'emotional',emoji: '💕' },
  { label: 'Cozy',         value: 'cozy',     emoji: '☕' },
]

const TONE_FILTERS = [
  { label: 'Dark',    value: 'dark',    emoji: '🌑' },
  { label: 'Hopeful', value: 'hopeful', emoji: '🌤️' },
  { label: 'Funny',   value: 'light',   emoji: '😂' },
]

function BrowseContent() {
  const params    = useSearchParams()
  const genre     = params.get('genre') || ''
  const tone      = params.get('tone')  || ''
  const tag       = params.get('tag')   || ''

  const filtered = db.filter(a => {
    if (genre && a.matchGenre !== genre) return false
    if (tone  && a.matchTone  !== tone)  return false
    if (tag   && !a.tags.some(t => t.toLowerCase().includes(tag.toLowerCase()))) return false
    return true
  })

  function buildHref(next: { genre?: string; tone?: string; tag?: string }) {
    const p = new URLSearchParams()
    if (next.genre) p.set('genre', next.genre)
    if (next.tone)  p.set('tone',  next.tone)
    if (next.tag)   p.set('tag',   next.tag)
    const s = p.toString()
    return s ? `/browse?${s}` : '/browse'
  }

  return (
    <div className="max-w-5xl mx-auto px-4 pb-16">
      {/* Filter pills */}
      <div className="flex flex-wrap gap-2 mb-4">
        {GENRE_FILTERS.map(f => (
          <Link key={f.value} href={buildHref({ genre: f.value, tone, tag })}
            className={`px-3 py-1.5 rounded-full text-xs font-bold tracking-wide border transition-all
              ${genre === f.value
                ? 'bg-red border-red text-white'
                : 'border-border text-muted hover:border-soft hover:text-soft bg-panel'}`}>
            {f.emoji} {f.label}
          </Link>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 mb-8">
        {TONE_FILTERS.map(f => (
          <Link key={f.value} href={buildHref({ genre, tone: tone === f.value ? '' : f.value, tag })}
            className={`px-3 py-1.5 rounded-full text-xs font-bold tracking-wide border transition-all
              ${tone === f.value
                ? 'bg-red border-red text-white'
                : 'border-border text-muted hover:border-soft hover:text-soft bg-panel'}`}>
            {f.emoji} {f.label}
          </Link>
        ))}
        {/* Special tags */}
        {[{label:'Sports',tag:'sports'},{label:'Ghibli',tag:'Ghibli'},{label:'Mecha',tag:'Mecha'}].map(f => (
          <Link key={f.tag} href={buildHref({ genre, tone, tag: tag === f.tag ? '' : f.tag })}
            className={`px-3 py-1.5 rounded-full text-xs font-bold tracking-wide border transition-all
              ${tag === f.tag
                ? 'bg-red border-red text-white'
                : 'border-border text-muted hover:border-soft hover:text-soft bg-panel'}`}>
            {f.label}
          </Link>
        ))}
      </div>

      <p className="text-xs text-muted mb-6 font-semibold tracking-widest uppercase">
        {filtered.length} anime
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(a => (
          <Link key={a.id} href={`/anime/${a.slug}`}
            className="group bg-surface border border-border rounded-xl overflow-hidden hover:border-[rgba(232,57,74,0.4)] transition-all hover:-translate-y-0.5">
            <div className="h-1" style={{ background: a.color }} />
            <div className="p-4">
              <div className="text-xl mb-1">{a.emoji}</div>
              <h3 className="font-display text-lg text-offwhite leading-tight mb-1 group-hover:text-red transition-colors">
                {a.title}
              </h3>
              <p className="text-xs text-muted mb-2">{a.genre} · {a.episodes === 1 ? 'Film' : `${a.episodes} eps`}</p>
              <p className="text-xs text-soft italic leading-relaxed line-clamp-2">"{a.tagline}"</p>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <p className="text-soft text-lg mb-4">No anime found for that filter combo.</p>
          <Link href="/browse" className="btn-stream btn-stream-alt">Clear Filters</Link>
        </div>
      )}
    </div>
  )
}

export default function BrowsePage() {
  return (
    <main className="relative z-10 min-h-screen">
      <Nav />
      <div className="pt-10 max-w-5xl mx-auto px-4 mb-8">
        <h1 className="font-display text-4xl text-offwhite mb-1">BROWSE ANIME</h1>
        <p className="text-soft text-sm">Filter by mood, tone, or genre</p>
      </div>
      <Suspense fallback={
        <div className="max-w-5xl mx-auto px-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="bg-surface border border-border rounded-xl h-36 animate-pulse" />
          ))}
        </div>
      }>
        <BrowseContent />
      </Suspense>
    </main>
  )
}
