'use client'
import { useEffect, useState } from 'react'

export default function QuizCounter() {
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    fetch('/api/counter')
      .then(r => r.json())
      .then(d => setCount(d.count))
      .catch(() => setCount(null))
  }, [])

  if (count === null) return null

  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-panel border border-border">
      <span className="w-1.5 h-1.5 rounded-full bg-red animate-pulse-dot" />
      <span className="text-xs font-bold tracking-widest text-soft">
        {count.toLocaleString()} QUIZZES TAKEN
      </span>
    </div>
  )
}
