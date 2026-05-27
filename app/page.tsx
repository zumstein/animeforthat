import { Suspense } from 'react'
import Nav from '@/components/Nav'
import Quiz from '@/components/Quiz'
import QuizCounter from '@/components/QuizCounter'

export default function Home() {
  return (
    <main className="relative z-10 min-h-screen">
      <Nav />

      {/* HERO */}
      <section className="pt-14 pb-10 px-4 text-center">
        <div className="inline-block mb-4">
          <Suspense fallback={<CounterSkeleton />}>
            <QuizCounter />
          </Suspense>
        </div>

        <h1 className="font-display text-5xl sm:text-7xl text-offwhite leading-none mb-4 animate-fade-down">
          FIND YOUR<br />
          <span className="text-red">NEXT ANIME</span>
        </h1>

        <p className="text-soft font-light text-base sm:text-lg max-w-sm mx-auto mb-10 leading-relaxed animate-fade-up">
          Answer 6 questions. Get matched to exactly what you're in the mood for — with streaming links, descriptions, and up to 8 rerolls.
        </p>

        {/* QUIZ */}
        <div className="w-full max-w-xl mx-auto animate-fade-up">
          <Quiz />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-3xl mx-auto px-4 py-12 border-t border-border">
        <h2 className="font-display text-3xl text-offwhite text-center mb-10">HOW IT WORKS</h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            { step: '01', icon: '🎯', title: 'Tell us your mood', body: 'Answer 6 quick questions about genre, tone, pace, and how much time you have.' },
            { step: '02', icon: '✦',  title: 'Get your match',   body: 'We score our database against your answers and surface the best fit for right now.' },
            { step: '03', icon: '▶️', title: 'Start watching',   body: 'Direct streaming links — Crunchyroll, HIDIVE, Netflix, and more. Start in seconds.' },
          ].map(({ step, icon, title, body }) => (
            <div key={step} className="bg-surface border border-border rounded-xl p-5">
              <div className="text-xs font-bold tracking-widest text-muted mb-2">{step}</div>
              <div className="text-2xl mb-2">{icon}</div>
              <div className="font-display text-xl text-offwhite mb-2">{title.toUpperCase()}</div>
              <p className="text-sm text-soft leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* AFFILIATE STRIP */}
      <section className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-panel border border-border rounded-2xl p-6 sm:p-8 text-center">
          <p className="text-xs font-bold tracking-widest uppercase text-muted mb-3">Our Pick for Getting Started</p>
          <h3 className="font-display text-3xl text-offwhite mb-2">CRUNCHYROLL</h3>
          <p className="text-soft text-sm max-w-sm mx-auto mb-5 leading-relaxed">
            The largest anime library. Most of our recommendations stream there. 
            Try it free — no commitment required.
          </p>
          <a href="https://amzn.to/4uGEKle" target="_blank" rel="noopener noreferrer"
             className="btn-stream btn-stream-primary text-sm">
            Start Free Trial →
          </a>
          <p className="text-xs text-muted mt-3">Affiliate link — we earn a small commission if you subscribe.</p>
        </div>
      </section>

      {/* BROWSE GENRES */}
      <section className="max-w-3xl mx-auto px-4 py-8 border-t border-border">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl text-offwhite">BROWSE BY MOOD</h2>
          <a href="/browse" className="text-xs font-bold tracking-widest uppercase text-muted hover:text-soft transition-colors">
            See All →
          </a>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { href: '/browse?genre=action',    emoji: '⚔️', label: 'Action'       },
            { href: '/browse?genre=mystery',   emoji: '🔮', label: 'Psychological' },
            { href: '/browse?genre=emotional', emoji: '💕', label: 'Romance'       },
            { href: '/browse?genre=cozy',      emoji: '☕', label: 'Cozy'          },
            { href: '/browse?tone=dark',       emoji: '🌑', label: 'Dark'          },
            { href: '/browse?tag=Sports',      emoji: '🏆', label: 'Sports'        },
            { href: '/browse?tone=light',      emoji: '😂', label: 'Comedy'        },
            { href: '/browse?tag=Ghibli',      emoji: '🌿', label: 'Ghibli'        },
          ].map(({ href, emoji, label }) => (
            <a key={label} href={href}
               className="flex items-center gap-2.5 bg-panel border border-border rounded-xl px-4 py-3 text-sm font-semibold text-soft hover:border-[rgba(232,57,74,0.5)] hover:text-offwhite hover:bg-[rgba(232,57,74,0.05)] transition-all">
              <span className="text-lg">{emoji}</span>
              {label}
            </a>
          ))}
        </div>
      </section>
    </main>
  )
}

function CounterSkeleton() {
  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-panel border border-border">
      <span className="w-1.5 h-1.5 rounded-full bg-red animate-pulse-dot" />
      <span className="text-xs font-bold tracking-widest text-muted">LOADING...</span>
    </div>
  )
}
