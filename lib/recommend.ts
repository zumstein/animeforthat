import type { Anime, QuizAnswers, StreamingPlatform } from './types'

export const STREAMING_LINKS: Record<StreamingPlatform, { label: string; url: string }> = {
  crunchyroll: { label: 'Crunchyroll', url: 'https://amzn.to/4uGEKle' },
  hidive:      { label: 'HIDIVE',      url: 'https://amzn.to/4adqIz0' },
  netflix:     { label: 'Netflix',     url: 'https://netflix.com' },
  prime:       { label: 'Amazon Prime',url: 'https://amazon.com/prime-video' },
  hulu:        { label: 'Hulu',        url: 'https://hulu.com' },
  disney:      { label: 'Disney+',     url: 'https://disneyplus.com' },
}

export const MOOD_SHORTCUTS = [
  { label: 'Feeling sad',        emoji: '😢', answers: { genre: 'emotional', tone: 'edgy',    pace: 'slow',     protagonist: 'broken',   romance: 'light',  length: 'season'  } },
  { label: 'Need action',        emoji: '⚔️', answers: { genre: 'action',    tone: 'dark',    pace: 'fast',     protagonist: 'power',    romance: 'none',   length: 'season'  } },
  { label: "Can't sleep",        emoji: '🌙', answers: { genre: 'mystery',   tone: 'edgy',    pace: 'episodic', protagonist: 'smart',    romance: 'none',   length: 'short'   } },
  { label: 'Make me laugh',      emoji: '😂', answers: { genre: 'cozy',      tone: 'light',   pace: 'episodic', protagonist: 'ordinary', romance: 'any',    length: 'short'   } },
  { label: 'Emotional damage',   emoji: '💔', answers: { genre: 'emotional', tone: 'dark',    pace: 'balanced', protagonist: 'broken',   romance: 'heavy',  length: 'season'  } },
  { label: 'Something beautiful',emoji: '✨', answers: { genre: 'cozy',      tone: 'hopeful', pace: 'slow',     protagonist: 'ordinary', romance: 'light',  length: 'long'    } },
] as const

export const GENRE_CATEGORIES = [
  { slug: 'action',     label: 'Action & Battles',        emoji: '⚔️',  matchGenre: 'action'    },
  { slug: 'mystery',    label: 'Psychological & Mystery', emoji: '🔮',  matchGenre: 'mystery'   },
  { slug: 'romance',    label: 'Romance & Drama',         emoji: '💕',  matchGenre: 'emotional' },
  { slug: 'cozy',       label: 'Slice of Life & Cozy',   emoji: '☕',  matchGenre: 'cozy'      },
  { slug: 'dark',       label: 'Dark & Brutal',           emoji: '🌑',  matchTone:  'dark'      },
  { slug: 'sports',     label: 'Sports',                  emoji: '🏆',  tag:        'Sports'    },
  { slug: 'comedy',     label: 'Comedy',                  emoji: '😂',  matchTone:  'light'     },
  { slug: 'scifi',      label: 'Sci-Fi & Mecha',          emoji: '🚀',  tag:        'sci-fi'    },
  { slug: 'historical', label: 'Historical & Period',     emoji: '📜',  tag:        'Historical'},
  { slug: 'ghibli',     label: 'Studio Ghibli',           emoji: '🌿',  tag:        'Studio Ghibli' },
] as const

export function score(anime: Anime, answers: QuizAnswers): number {
  let pts = 0
  if (anime.matchGenre === answers.genre)           pts += 2
  else if (anime.matchGenre === 'any' || answers.genre === 'any') pts += 1

  if (anime.matchTone === answers.tone)             pts += 2
  else if (anime.matchTone === 'any' || answers.tone === 'any')   pts += 1

  if (anime.matchPace === answers.pace)             pts += 2
  else if (anime.matchPace === 'any' || answers.pace === 'any')   pts += 1

  if (anime.matchProtagonist === answers.protagonist) pts += 2
  else if (anime.matchProtagonist === 'any' || answers.protagonist === 'any') pts += 1

  if (anime.matchRomance === answers.romance)       pts += 2
  else if (anime.matchRomance === 'any' || answers.romance === 'any') pts += 1

  // Episode length bonus
  if (answers.length) {
    const eps = anime.episodes ?? 999
    const match =
      (answers.length === 'movie'  && eps <= 1) ||
      (answers.length === 'short'  && eps <= 13) ||
      (answers.length === 'season' && eps >= 14 && eps <= 50) ||
      (answers.length === 'long'   && eps > 50)
    if (match) pts += 2
  }

  // Platform bonus
  if (answers.platforms?.length) {
    const hasMatch = anime.streaming.some(p => answers.platforms!.includes(p as StreamingPlatform))
    if (hasMatch) pts += 3
  }

  return pts
}

export function getRanked(db: Anime[], answers: QuizAnswers): Anime[] {
  return [...db].sort((a, b) => score(b, answers) - score(a, answers))
}
