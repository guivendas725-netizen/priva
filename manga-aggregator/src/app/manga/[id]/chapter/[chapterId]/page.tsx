'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Reader } from '@/components/reader'

export default function ChapterPage() {
  const { id, chapterId } = useParams()

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-3 flex-wrap">
          <Link
            href="/"
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-foreground transition hover:bg-white/10"
          >
            Início
          </Link>
          <Link
            href={`/manga/${id}`}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-neutral-400 transition hover:text-foreground hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao manga
          </Link>
        </div>
      </div>
      <Reader chapterId={chapterId as string} />
    </div>
  )
}