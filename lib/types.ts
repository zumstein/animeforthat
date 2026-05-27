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
  genre:       string
  tone:        string
  pace:        string
  protagonist: string
  romance:     string
  length?:     string
  platforms?:  string[]
}
