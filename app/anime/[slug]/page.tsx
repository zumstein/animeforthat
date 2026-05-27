import Nav from '@/components/Nav'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import animeDb from '@/lib/anime.json'
import { STREAMING_LINKS } from '@/lib/recommend'
import type { Anime, StreamingPlatform } from '@/lib/types'

const db = animeDb as Anime[]

export function generateStaticParams() {
  return db.map(a => ({ slug: a.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const anime = db.find(a => a.slug === params.slug)
  if (!anime) return {}
  return {
    title: `${anime.title} — Anime For That`,
    description: anime.tagline,
  }
}

export default function AnimePage({ params }: { params: { slug: string } }) {
  const anime = db.find(a => a.slug === params.slug)
  if (!anime) notFound()

  const related = db
    .filter(a => a.id !== anime.id && (a.matchGenre === anime.matchGenre || a.matchTone === anime.matchTone))
    .slice(0, 4)

  return (
    <main className="relative z-10 min-h-screen">
      <Nav />

      <div className="max-w-2xl mx-auto px-4 pt-10 pb-16">
        {/* Back */}
        <Link href="/browse" className="text-xs font-bold tracking-widest uppercase text-muted hover:text-soft transition-colors mb-8 inline-block">
          ← Browse All
        </Link>

        {/* Card */}
        <div className="bg-surface border border-border rounded-2xl overflow-hidden mb-8">
          <div className="h-1.5" style={{ background: anime.color }} />
          <div className="p-6 sm:p-8">
            <div className="text-4xl mb-3">{anime.emoji}</div>
            <h1 className="font-display text-4xl sm:text-5xl text-offwhite leading-none mb-2">{anime.title}</h1>
            <p className="text-muted text-sm mb-5">{anime.genre} · {anime.episodes === 1 ? 'Film' : `${anime.episodes} episodes`}</p>

            <p className="text-soft italic text-sm sm:text-base leading-relaxed mb-4 font-light border-l-2 border-red pl-4">
              "{anime.tagline}"
            </p>

            <p className="text-[#8890b0] text-sm leading-relaxed mb-6">{anime.description}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-6">
              {anime.tags.map(t => <span key={t} className="tag-pill">{t}</span>)}
            </div>

            {/* Stream */}
            <div className="border-t border-border pt-5">
              <p className="text-xs font-bold tracking-widest uppercase text-muted mb-3">Where to Watch</p>
              <div className="flex flex-wrap gap-2">
                {anime.streaming.map((s, i) => (
                  <a key={s}
                     href={STREAMING_LINKS[s as StreamingPlatform]?.url ?? '#'}
                     target="_blank" rel="noopener noreferrer"
                     className={`btn-stream ${i === 0 ? 'btn-stream-primary' : 'btn-stream-alt'}`}>
                    {i === 0 ? '▶ ' : ''}
                    {STREAMING_LINKS[s as StreamingPlatform]?.label ?? s}
                  </a>
                ))}
              </div>
              {anime.streaming.some(s => ['crunchyroll','hidive'].includes(s)) && (
                <p className="text-[10px] text-muted mt-2">Crunchyroll & HIDIVE are affiliate links.</p>
              )}
            </div>
          </div>
        </div>

        {/* Match tags */}
        <div className="bg-panel border border-border rounded-xl p-5 mb-8">
          <p className="text-xs font-bold tracking-widest uppercase text-muted mb-3">Good Match If You Want</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            {[
              ['Genre', anime.matchGenre],
              ['Tone',  anime.matchTone],
              ['Pace',  anime.matchPace],
              ['Hero',  anime.matchProtagonist],
              ['Romance', anime.matchRomance],
            ].map(([label, val]) => (
              <div key={label} className="flex flex-col bg-surface rounded-lg p-2.5">
                <span className="text-muted text-[10px] uppercase tracking-wider mb-0.5">{label}</span>
                <span className="text-soft font-semibold capitalize">{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Take quiz CTA */}
        <div className="text-center mb-8">
          <Link href="/"
            className="btn-stream btn-stream-primary text-sm">
            ✦ Take the Quiz to Find Your Match
          </Link>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div>
            <h2 className="font-display text-2xl text-offwhite mb-4">YOU MIGHT ALSO LIKE</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {related.map(r => (
                <Link key={r.id} href={`/anime/${r.slug}`}
                  className="group flex items-center gap-3 bg-surface border border-border rounded-xl p-3 hover:border-[rgba(232,57,74,0.4)] transition-all">
                  <div className="h-10 w-1 rounded-full flex-shrink-0" style={{ background: r.color }} />
                  <div>
                    <div className="text-sm font-bold text-offwhite group-hover:text-red transition-colors">{r.emoji} {r.title}</div>
                    <div className="text-xs text-muted">{r.genre}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
