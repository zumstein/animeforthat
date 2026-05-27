import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: { default: 'Anime For That — Find Your Next Anime', template: '%s | Anime For That' },
  description: 'Answer 5 questions and find the perfect anime for your mood right now. Streaming links for Crunchyroll, HIDIVE, Netflix, and more.',
  keywords: ['anime recommendation','what anime should I watch','anime quiz','best anime'],
  metadataBase: new URL('https://animeforthat.com'),
  openGraph: { siteName: 'Anime For That', type: 'website' },
  twitter: { card: 'summary_large_image', site: '@animeforthat' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <div className="bg-ambient" />
        {children}
        <footer className="relative z-10 border-t border-border mt-16 py-6 px-4 text-center">
          <p className="text-xs text-muted max-w-2xl mx-auto leading-relaxed">
            Some links on this site are affiliate links. We may earn a small commission
            if you subscribe — at no extra cost to you. This helps keep the site free.
            {' · '}
            <a href="/privacy" className="underline hover:text-soft transition-colors">Privacy</a>
            {' · '}
            <a href="/about" className="underline hover:text-soft transition-colors">About</a>
          </p>
        </footer>
      </body>
    </html>
  )
}
