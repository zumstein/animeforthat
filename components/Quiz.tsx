'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MOOD_SHORTCUTS, STREAMING_LINKS } from '@/lib/recommend'
import type { StreamingPlatform } from '@/lib/types'

const QUESTIONS = [
  { id: 'genre', text: 'What pulls you in first?', sub: 'Pick the vibe that hits hardest',
    options: [
      { label: 'Action & battles',       value: 'action',    icon: '⚔️' },
      { label: 'Deep emotions',          value: 'emotional', icon: '💔' },
      { label: 'Mystery & mind games',   value: 'mystery',   icon: '🔍' },
      { label: 'Warmth & slice-of-life', value: 'cozy',      icon: '☕' },
    ]},
  { id: 'tone', text: 'How dark can we go?', sub: "Be honest — we won't judge",
    options: [
      { label: 'Full dark, no sugar', value: 'dark',    icon: '🌑' },
      { label: 'Bittersweet edge',    value: 'edgy',    icon: '🌒' },
      { label: 'Mostly hopeful',      value: 'hopeful', icon: '🌤️' },
      { label: 'Pure wholesome',      value: 'light',   icon: '☀️' },
    ]},
  { id: 'pace', text: 'How do you binge?', sub: 'One episode or one season?',
    options: [
      { label: 'Full chaos, fast burn',      value: 'fast',     icon: '🔥' },
      { label: 'Slow build, massive payoff', value: 'slow',     icon: '🌊' },
      { label: 'Balanced arcs',              value: 'balanced', icon: '⚖️' },
      { label: 'Episodic, chill',            value: 'episodic', icon: '🎐' },
    ]},
  { id: 'protagonist', text: 'Who do you root for?', sub: "The hero's soul matters",
    options: [
      { label: 'Clever strategist',                    value: 'smart',    icon: '🧠' },
      { label: 'Raw unstoppable force',                value: 'power',    icon: '💥' },
      { label: 'Broken but trying',                    value: 'broken',   icon: '🩹' },
      { label: 'Ordinary person, extraordinary world', value: 'ordinary', icon: '🌀' },
    ]},
  { id: 'romance', text: 'Romance subplot?', sub: 'Set the emotional temperature',
    options: [
      { label: 'Central — all the tension', value: 'heavy', icon: '💘' },
      { label: 'There but not the focus',   value: 'light', icon: '💫' },
      { label: 'Friendship > romance',      value: 'none',  icon: '🤝' },
      { label: 'Surprise me',               value: 'any',   icon: '🎲' },
    ]},
  { id: 'length', text: 'How much time do you have?', sub: 'Be honest about your evening',
    options: [
      { label: 'One movie night',         value: 'movie',  icon: '🎬' },
      { label: 'Quick fix, under 13 eps', value: 'short',  icon: '⚡' },
      { label: 'A proper season',         value: 'season', icon: '📺' },
      { label: 'I have no life',          value: 'long',   icon: '🌌' },
    ]},
]

const ALL_PLATFORMS = Object.keys(STREAMING_LINKS) as StreamingPlatform[]

export default function Quiz() {
  const router = useRouter()
  const [phase, setPhase]         = useState<'welcome' | 'quiz' | 'platforms'>('welcome')
  const [step, setStep]           = useState(0)
  const [answers, setAnswers]     = useState<Record<string, string>>({})
  const [platforms, setPlatforms] = useState<StreamingPlatform[]>([])
  const [animKey, setAnimKey]     = useState(0)
  const [moodLabel, setMoodLabel] = useState<string | null>(null)

  const current  = QUESTIONS[step]
  const selected = answers[current?.id]
  const progress = (step / QUESTIONS.length) * 100

  function pick(val: string) { setAnswers(prev => ({ ...prev, [current.id]: val })) }

  function goNext() {
    if (step < QUESTIONS.length - 1) { setAnimKey(k => k + 1); setStep(s => s + 1) }
    else setPhase('platforms')
  }

  function goBack() {
    if (phase === 'platforms') setPhase('quiz')
    else if (step > 0) { setAnimKey(k => k + 1); setStep(s => s - 1) }
    else { setPhase('welcome'); setMoodLabel(null) }
  }

  function pickMood(mood: typeof MOOD_SHORTCUTS[number]) {
    setAnswers(mood.answers as Record<string, string>)
    setMoodLabel(`${mood.emoji} ${mood.label}`)
    setPhase('platforms')
  }

  function togglePlatform(p: StreamingPlatform) {
    setPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p])
  }

  async function submit(skipPlatforms = false) {
    const params = new URLSearchParams()
    Object.entries(answers).forEach(([k, v]) => { if (v) params.set(k, v) })
    if (!skipPlatforms && platforms.length) params.set('platforms', platforms.join(','))
    if (moodLabel) params.set('mood', encodeURIComponent(moodLabel))

    // Increment quiz counter
    fetch('/api/counter', { method: 'POST' }).catch(() => {})

    router.push(`/results?${params.toString()}`)
  }

  return (
    <div className="w-full max-w-xl mx-auto">

      {/* WELCOME */}
      {phase === 'welcome' && (
        <div className="animate-fade-up text-center pb-8">
          <p className="text-xs font-semibold tracking-widest uppercase text-[#5a5f7a] mb-3">Quick pick by mood</p>
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {MOOD_SHORTCUTS.map(mood => (
              <button key={mood.label} onClick={() => pickMood(mood)}
                className="px-3 py-1.5 rounded-full border border-[#252836] bg-[#1a1d28] text-sm text-[#8890b0] hover:border-[#e8394a] hover:text-[#eef0ff] hover:bg-[rgba(232,57,74,0.08)] transition-all">
                {mood.emoji} {mood.label}
              </button>
            ))}
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-[#252836] to-transparent mb-8" />
          <p className="text-[#8890b0] font-light leading-relaxed mb-6 max-w-sm mx-auto">
            Answer <strong className="text-[#eef0ff] font-bold">6 quick questions</strong> and we'll match you with the
            anime that fits your mood — with streaming links, a full description, and up to{' '}
            <strong className="text-[#eef0ff] font-bold">8 rerolls</strong>.
          </p>
          <button onClick={() => setPhase('quiz')}
            className="bg-[#e8394a] text-white font-bold tracking-widest uppercase text-sm px-8 py-3 rounded-lg hover:brightness-110 hover:shadow-lg hover:shadow-[rgba(232,57,74,0.3)] hover:-translate-y-0.5 transition-all">
            Find My Anime →
          </button>
        </div>
      )}

      {/* QUIZ */}
      {phase === 'quiz' && (
        <>
          <div className="mb-6">
            <div className="flex justify-between text-xs font-semibold tracking-widest uppercase text-[#5a5f7a] mb-2">
              <span>Question {step + 1} / {QUESTIONS.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-0.5 bg-[#252836] rounded-full overflow-hidden">
              <div className="h-full bg-[#e8394a] rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(232,57,74,0.5)]"
                   style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div key={animKey} className="bg-[#14171f] border border-[#252836] rounded-2xl p-6 mb-4 animate-fade-up">
            <div className="text-[10px] font-bold tracking-widest uppercase text-[#e8394a] mb-2">Question {step + 1}</div>
            <div className="font-display text-3xl text-[#eef0ff] leading-none mb-1">{current.text}</div>
            <div className="text-sm text-[#5a5f7a] italic mb-6">{current.sub}</div>
            <div className="grid grid-cols-2 gap-2.5">
              {current.options.map(opt => (
                <button key={opt.value} onClick={() => pick(opt.value)}
                  className={`flex items-center gap-2.5 p-3.5 rounded-xl border text-left text-sm font-medium transition-all
                    ${selected === opt.value
                      ? 'border-[#e8394a] bg-[rgba(232,57,74,0.1)] text-[#eef0ff] shadow-[0_0_0_1px_#e8394a]'
                      : 'border-[#252836] bg-[#1a1d28] text-[#8890b0] hover:border-[rgba(232,57,74,0.5)] hover:text-[#eef0ff] hover:bg-[rgba(232,57,74,0.05)]'}`}>
                  <span className="text-xl flex-shrink-0">{opt.icon}</span>
                  <span className="leading-snug">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={goBack}
              className="px-4 py-2.5 rounded-lg border border-[#252836] text-[#5a5f7a] text-sm font-semibold hover:border-[#8890b0] hover:text-[#8890b0] transition-all flex-shrink-0">
              ← Back
            </button>
            <button onClick={goNext} disabled={!selected}
              className="flex-1 bg-[#e8394a] text-white font-bold tracking-wide text-sm py-2.5 rounded-lg hover:brightness-110 hover:shadow-lg hover:shadow-[rgba(232,57,74,0.3)] hover:-translate-y-0.5 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none">
              {step === QUESTIONS.length - 1 ? 'Choose Platforms →' : 'Next →'}
            </button>
          </div>
        </>
      )}

      {/* PLATFORMS */}
      {phase === 'platforms' && (
        <div className="animate-fade-up">
          <div className="bg-[#14171f] border border-[#252836] rounded-2xl p-6 mb-4">
            {moodLabel && (
              <div className="text-xs font-bold tracking-widest uppercase text-[#e8394a] mb-3">Mood: {moodLabel}</div>
            )}
            <div className="font-display text-3xl text-[#eef0ff] leading-none mb-1">What do you have access to?</div>
            <div className="text-sm text-[#5a5f7a] italic mb-6">We'll prioritize anime you can actually watch</div>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {ALL_PLATFORMS.map(p => {
                const info = STREAMING_LINKS[p]
                const active = platforms.includes(p)
                return (
                  <button key={p} onClick={() => togglePlatform(p)}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-sm font-semibold transition-all
                      ${active ? 'border-[#e8394a] bg-[rgba(232,57,74,0.1)] text-[#eef0ff]'
                               : 'border-[#252836] bg-[#1a1d28] text-[#5a5f7a] hover:border-[#8890b0] hover:text-[#8890b0]'}`}>
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${active ? 'bg-[#e8394a]' : 'bg-[#252836]'}`} />
                    {info.label}
                  </button>
                )
              })}
            </div>
            <button onClick={() => submit(true)} className="text-xs text-[#5a5f7a] hover:text-[#8890b0] transition-colors">
              Skip — show everything
            </button>
          </div>
          <div className="flex gap-2">
            <button onClick={goBack}
              className="px-4 py-2.5 rounded-lg border border-[#252836] text-[#5a5f7a] text-sm font-semibold hover:border-[#8890b0] transition-all flex-shrink-0">
              ← Back
            </button>
            <button onClick={() => submit(false)}
              className="flex-1 bg-[#e8394a] text-white font-bold tracking-wide text-sm py-2.5 rounded-lg hover:brightness-110 hover:shadow-lg hover:shadow-[rgba(232,57,74,0.3)] hover:-translate-y-0.5 transition-all">
              Show My Match ✦
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
