'use client'

import { Reader } from '@/components/reader'

interface ReaderPageProps {
  params: {
    chapterId: string
  }
}

export default function ReaderPage({ params }: ReaderPageProps) {
  return <Reader chapterId={params.chapterId} />
}