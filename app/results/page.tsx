'use client'
import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense, useState, useEffect } from 'react'
import Nav from '@/components/Nav'
import animeDb from '@/lib/anime.json'
import { getRanked, STREAMING_LINKS } from '@/lib/recommend'
import type { Anime, QuizAnswers, StreamingPlatform } from '@/lib/types'

function Results() {
  const params = useSearchParams()
  const router = useRouter()

  const answers: QuizAnswers = {
    genre:       (params.get('genre')       || 'action')   as QuizAnswers['genre'],
    tone:        (params.get('tone')        || 'hopeful')  as QuizAnswers['tone'],
    pace:        (params.get('pace')        || 'balanced') as QuizAnswers['pace'],
    protagonist: (params.get('protagonist') || 'ordinary') as QuizAnswers['protagonist'],
    romance:     (params.get('romance')     || 'any')      as QuizAnswers['romance'],
    length:      (params.get('length')      || undefined)  as QuizAnswers['length'],
    platforms:   params.get('platforms')?.split(',') as StreamingPlatform[] | undefined,
  }
  const moodLabel = params.get('mood') ? decodeURIComponent(params.get('mood')!) : null

  const ranked   = getRanked(animeDb as Anime[], answers)
  const MAX_SKIP = 8
  const [skip, setSkip] = useState(0)

  const anime      = ranked[skip]
  const remaining  = MAX_SKIP - skip
  const seenCount  = skip

  function reroll() { if (skip < MAX_SKIP && skip < ranked.length - 1) setSkip(s => s + 1) }
  function retake() { router.push('/') }

  if (!anime) return (
    <div className="text-center py-20">
      <div className="text-4xl mb-4">🤷</div>
      <p className="text-soft mb-4">We ran out of recommendations — you've seen them all!</p>
      <button onClick={retake} className="btn-stream btn-stream-primary">Retake Quiz</button>
    </div>
  )

  const primaryStream  = anime.streaming.find(s => answers.platforms?.includes(s as StreamingPlatform)) || anime.streaming[0]
  const otherStreams    = anime.streaming.filter(s => s !== primaryStream).slice(0, 3)

  return (
    <div className="max-w-xl mx-auto px-4 pb-16">
      {/* Context pill */}
      <div className="text-center mb-8">
        {moodLabel && (
          <span className="tag-pill mr-2">Mood: {moodLabel}</span>
        )}
        {seenCount > 0 && (
          <span className="tag-pill">Reroll #{seenCount}</span>
        )}
      </div>

      {/* Main card */}
      <div className="animate-fade-up bg-surface border border-border rounded-2xl overflow-hidden mb-4">
        {/* Colour accent bar */}
        <div className="h-1.5 w-full" style={{ background: anime.color }} />

        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <div className="text-xs font-bold tracking-widest uppercase text-muted mb-1">
                Your Match
              </div>
              <h1 className="font-display text-4xl sm:text-5xl text-offwhite leading-none">
                {anime.emoji} {anime.title}
              </h1>
            </div>
            <div className="flex-shrink-0 text-right">
              <div className="text-xs text-muted">{anime.episodes === 1 ? 'Film' : `${anime.episodes} eps`}</div>
              <div className="text-xs text-muted mt-0.5">{anime.genre}</div>
            </div>
          </div>

          {/* Tagline */}
          <p className="text-soft italic text-sm sm:text-base leading-relaxed mb-3 font-light">
            "{anime.tagline}"
          </p>

          {/* Description */}
          <p className="text-[#8890b0] text-sm leading-relaxed mb-5">
            {anime.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-6">
            {anime.tags.map(t => <span key={t} className="tag-pill">{t}</span>)}
          </div>

          {/* Streaming buttons */}
          <div className="flex flex-wrap gap-2 mb-2">
            {primaryStream && (
              <a href={STREAMING_LINKS[primaryStream as StreamingPlatform]?.url ?? '#'}
                 target="_blank" rel="noopener noreferrer"
                 className="btn-stream btn-stream-primary">
                ▶ Watch on {STREAMING_LINKS[primaryStream as StreamingPlatform]?.label ?? primaryStream}
              </a>
            )}
            {otherStreams.map(s => (
              <a key={s}
                 href={STREAMING_LINKS[s as StreamingPlatform]?.url ?? '#'}
                 target="_blank" rel="noopener noreferrer"
                 className="btn-stream btn-stream-alt">
                {STREAMING_LINKS[s as StreamingPlatform]?.label ?? s}
              </a>
            ))}
          </div>

          <p className="text-[10px] text-muted leading-relaxed">
            Crunchyroll & HIDIVE links are affiliate links. We earn a small commission at no extra cost to you.
          </p>
        </div>
      </div>

      {/* Reroll */}
      <button onClick={reroll} disabled={skip >= MAX_SKIP || skip >= ranked.length - 1}
        className="btn-reroll mb-3">
        <span className="text-lg">🎲</span>
        {remaining > 0
          ? `Not feeling it — show me another (${remaining} left)`
          : "You've used all your rerolls"}
      </button>

      {/* Seen this / start over */}
      <div className="flex gap-2">
        <button onClick={reroll} disabled={skip >= MAX_SKIP}
          className="flex-1 py-2.5 rounded-lg border border-border text-muted text-xs font-semibold hover:border-soft hover:text-soft transition-all disabled:opacity-30 disabled:cursor-not-allowed">
          ✓ Seen it already
        </button>
        <button onClick={retake}
          className="flex-1 py-2.5 rounded-lg border border-border text-muted text-xs font-semibold hover:border-soft hover:text-soft transition-all">
          ↩ Retake Quiz
        </button>
      </div>

      {/* Email subscribe */}
      <EmailCapture />
    </div>
  )
}

function EmailCapture() {
  const [email, setEmail]   = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')

  async function subscribe() {
    if (!email || status !== 'idle') return
    setStatus('sending')
    try {
      const r = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      setStatus(r.ok ? 'done' : 'error')
    } catch { setStatus('error') }
  }

  if (status === 'done') return (
    <div className="mt-8 p-5 bg-panel border border-border rounded-xl text-center">
      <div className="text-2xl mb-2">🎉</div>
      <p className="text-soft text-sm">You're in! We'll send weekly picks straight to your inbox.</p>
    </div>
  )

  return (
    <div className="mt-8 p-5 bg-panel border border-border rounded-xl">
      <p className="text-xs font-bold tracking-widest uppercase text-muted mb-1">Weekly Picks</p>
      <p className="text-offwhite font-semibold mb-1">Get anime recommendations by email</p>
      <p className="text-soft text-xs leading-relaxed mb-4">
        One email a week. The best anime for your mood. No spam, ever.
      </p>
      <div className="flex gap-2">
        <input type="email" placeholder="your@email.com"
               value={email} onChange={e => setEmail(e.target.value)}
               onKeyDown={e => e.key === 'Enter' && subscribe()}
               className="flex-1 bg-surface border border-border rounded-lg px-3 py-2 text-sm text-offwhite placeholder-muted outline-none focus:border-red transition-colors min-w-0" />
        <button onClick={subscribe} disabled={status === 'sending'}
          className="btn-stream btn-stream-primary flex-shrink-0 disabled:opacity-50">
          {status === 'sending' ? '...' : 'Subscribe'}
        </button>
      </div>
      {status === 'error' && <p className="text-red text-xs mt-2">Something went wrong — try again.</p>}
    </div>
  )
}

export default function ResultsPage() {
  return (
    <main className="relative z-10 min-h-screen">
      <Nav />
      <div className="pt-10">
        <h2 className="font-display text-2xl text-center text-offwhite mb-8">YOUR PICK</h2>
        <Suspense fallback={
          <div className="max-w-xl mx-auto px-4">
            <div className="bg-surface border border-border rounded-2xl h-96 animate-pulse" />
          </div>
        }>
          <Results />
        </Suspense>
      </div>
    </main>
  )
}
