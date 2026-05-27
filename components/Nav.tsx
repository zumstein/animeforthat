'use client'
import Link from 'next/link'
import { useState } from 'react'

export default function Nav() {
  const [open, setOpen] = useState(false)
  return (
    <nav className="relative z-20 flex items-center justify-between px-4 sm:px-8 py-4 border-b border-[#252836]">
      <Link href="/" className="group flex items-center gap-1">
        <span className="font-display text-2xl text-[#eef0ff] group-hover:text-[#e8394a] transition-colors">
          ANIME<span className="text-[#e8394a]">FOR</span>THAT
        </span>
      </Link>
      <div className="hidden sm:flex items-center gap-6 text-sm font-semibold tracking-wide text-[#5a5f7a]">
        <Link href="/"        className="hover:text-[#eef0ff] transition-colors">Quiz</Link>
        <Link href="/browse"  className="hover:text-[#eef0ff] transition-colors">Browse</Link>
        <a href="https://amzn.to/4uGEKle" target="_blank" rel="noopener noreferrer"
           className="px-4 py-1.5 rounded bg-[#e8394a] text-white text-xs font-bold tracking-widest uppercase hover:brightness-110 transition-all">
          Crunchyroll
        </a>
      </div>
      <button className="sm:hidden text-[#5a5f7a] hover:text-[#eef0ff]" onClick={() => setOpen(!open)}>
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          {open
            ? <path d="M4 4L18 18M18 4L4 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            : <><rect y="4" width="22" height="2" rx="1" fill="currentColor"/><rect y="10" width="22" height="2" rx="1" fill="currentColor"/><rect y="16" width="22" height="2" rx="1" fill="currentColor"/></>
          }
        </svg>
      </button>
      {open && (
        <div className="absolute top-full left-0 right-0 bg-[#14171f] border-b border-[#252836] p-4 flex flex-col gap-3 sm:hidden">
          <Link href="/"       onClick={() => setOpen(false)} className="text-sm font-semibold text-[#5a5f7a] hover:text-[#eef0ff]">Quiz</Link>
          <Link href="/browse" onClick={() => setOpen(false)} className="text-sm font-semibold text-[#5a5f7a] hover:text-[#eef0ff]">Browse</Link>
          <a href="https://amzn.to/4uGEKle" target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-[#e8394a]">
            Start Crunchyroll →
          </a>
        </div>
      )}
    </nav>
  )
}
