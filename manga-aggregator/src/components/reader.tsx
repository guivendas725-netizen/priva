'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, BookOpen, Scroll } from 'lucide-react'
import { getChapterPages, getPageUrl } from '@/lib/api'
import { AtHomeResponse } from '@/types/manga'

interface ReaderProps {
  chapterId: string
}

type ReaderMode = 'single' | 'cascade' | 'book'

export function Reader({ chapterId }: ReaderProps) {
  const [pages, setPages] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [mode, setMode] = useState<ReaderMode>('single')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPages = async () => {
      try {
        const data: AtHomeResponse = await getChapterPages(chapterId)
        if (data?.chapter?.data) {
          const pageUrls = data.chapter.data.map(page => getPageUrl(data.baseUrl, data.chapter.hash, page))
          setPages(pageUrls)
        }
      } catch (error) {
        console.error('Error loading pages:', error)
      } finally {
        setLoading(false)
      }
    }
    loadPages()
  }, [chapterId])

  const nextPage = () => {
    const step = mode === 'book' ? 2 : 1
    if (currentPage + step < pages.length) {
      setCurrentPage(currentPage + step)
    }
  }

  const prevPage = () => {
    const step = mode === 'book' ? 2 : 1
    if (currentPage - step >= 0) {
      setCurrentPage(currentPage - step)
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">Carregando páginas...</div>
  }

  if (!pages.length) {
    return <div className="flex justify-center items-center h-64 text-neutral-400">Não foi possível carregar as páginas deste capítulo.</div>
  }

  const renderPage = (page: string, index: number) => (
    <div key={index} className="rounded-3xl overflow-hidden border border-white/10 bg-slate-950 shadow-lg">
      <Image
        src={page}
        alt={`Page ${index + 1}`}
        width={800}
        height={1200}
        className="w-full h-auto"
        loading={index < 3 ? 'eager' : 'lazy'}
      />
    </div>
  )

  const pagesToShow = mode === 'book'
    ? pages.slice(currentPage, currentPage + 2)
    : [pages[currentPage]]

  const maxPageLabel = mode === 'book' ? Math.ceil(pages.length / 2) : pages.length
  const currentLabel = mode === 'book' ? Math.floor(currentPage / 2) + 1 : currentPage + 1

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-4">
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => setMode('single')} variant={mode === 'single' ? 'default' : 'outline'}>
            <BookOpen className="w-4 h-4 mr-2" />
            Página
          </Button>
          <Button onClick={() => {
            setMode('book')
            setCurrentPage((prev) => prev - (prev % 2))
          }} variant={mode === 'book' ? 'default' : 'outline'}>
            <span className="mr-2">📖</span>
            Livro
          </Button>
          <Button onClick={() => setMode('cascade')} variant={mode === 'cascade' ? 'default' : 'outline'}>
            <Scroll className="w-4 h-4 mr-2" />
            Cascata
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm text-neutral-300">
          <span>{mode === 'book' ? `Página dupla ${currentLabel} de ${maxPageLabel}` : `Página ${currentLabel} / ${maxPageLabel}`}</span>
          <div className="flex items-center gap-2">
            <Button onClick={prevPage} disabled={currentPage === 0}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button onClick={nextPage} disabled={mode === 'book' ? currentPage >= pages.length - 2 : currentPage >= pages.length - 1}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {mode === 'book' ? (
        <div className="relative">
          <div className="grid gap-4 lg:grid-cols-2">
            {pagesToShow.map((page, index) => renderPage(page, currentPage + index))}
          </div>
          <button
            type="button"
            onClick={prevPage}
            disabled={currentPage === 0}
            className="absolute left-0 top-0 h-full w-1/2 bg-transparent text-transparent focus:outline-none"
            aria-label="Voltar página"
          />
          <button
            type="button"
            onClick={nextPage}
            disabled={currentPage >= pages.length - 2}
            className="absolute right-0 top-0 h-full w-1/2 bg-transparent text-transparent focus:outline-none"
            aria-label="Avançar página"
          />
        </div>
      ) : mode === 'cascade' ? (
        <div className="space-y-6">
          {pages.map((page, index) => renderPage(page, index))}
        </div>
      ) : (
        <div className="flex justify-center">
          {renderPage(pagesToShow[0], currentPage)}
        </div>
      )}
    </div>
  )
}
