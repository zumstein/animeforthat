export type StreamingPlatform = 'crunchyroll' | 'hidive' | 'netflix' | 'prime' | 'hulu' | 'disney'

export interface Anime {
  id: string
  title: string
  slug: string
  emoji: string
  tagline: string
  description: string
  genre: string
  episodes: number | null
  tags: string[]
  streaming: string[]
  color: string
  matchGenre: string
  matchTone: string
  matchPace: string
  matchProtagonist: string
  matchRomance: string
}

export interface QuizAnswers {
  genre:       'action' | 'emotional' | 'mystery' | 'cozy'
  tone:        'dark' | 'edgy' | 'hopeful' | 'light'
  pace:        'fast' | 'slow' | 'balanced' | 'episodic'
  protagonist: 'smart' | 'power' | 'broken' | 'ordinary'
  romance:     'heavy' | 'light' | 'none' | 'any'
  length?:     'movie' | 'short' | 'season' | 'long'
  platforms?:  string[]
}
