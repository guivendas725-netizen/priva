'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import Link from 'next/link'
import { Reader } from '@/components/reader'
import { getMangaDetails, getChapters, getCoverUrl, getMangaTitle, getMangaDescription } from '@/lib/api'
import { Manga } from '@/types/manga'

export default function MangaPage() {
  const { id } = useParams()

  const mangaQuery = useQuery({
    queryKey: ['manga', id],
    queryFn: () => getMangaDetails(id as string),
    enabled: Boolean(id),
  })

  const chaptersQuery = useQuery({
    queryKey: ['chapters', id],
    queryFn: () => getChapters(id as string),
    enabled: Boolean(id),
  })

  const manga = mangaQuery.data
  const chapters = chaptersQuery.data || []
  const [preferredLocales, setPreferredLocales] = useState<string[]>(['en'])
  const [selectedLanguage, setSelectedLanguage] = useState('')

  const availableLanguages = useMemo(
    () => Array.from(new Set(chapters.map((chapter) => chapter.attributes.translatedLanguage))),
    [chapters]
  )

  useEffect(() => {
    if (typeof window === 'undefined') return
    const browserLocales = navigator.languages?.map((lang) => lang.toLowerCase()) || [navigator.language.toLowerCase()]
    setPreferredLocales(browserLocales)

    if (!selectedLanguage && availableLanguages.length > 0) {
      const matchedLanguage = availableLanguages.find((lang) =>
        browserLocales.some((locale) => locale.startsWith(lang))
      )
      setSelectedLanguage(matchedLanguage || availableLanguages[0])
    }
  }, [availableLanguages, selectedLanguage])

  const filteredChapters = selectedLanguage
    ? chapters.filter((chapter) => chapter.attributes.translatedLanguage === selectedLanguage)
    : chapters

  const languageLabels: Record<string, string> = {
    en: 'English',
    pt: 'Português',
    es: 'Español',
    ja: '日本語',
    'ja-ro': 'Romaji',
    fr: 'Français',
    ko: '한국어',
    zh: '中文',
  }

  const getLanguageLabel = (code: string) => languageLabels[code] || code

  if (!manga) {
    return <div className="flex justify-center items-center h-64">Carregando manga...</div>
  }

  const coverRel = manga.relationships.find(rel => rel.type === 'cover_art')
  const coverUrl = coverRel ? getCoverUrl(manga.id, coverRel.attributes!.fileName) : ''
  const title = getMangaTitle(manga, preferredLocales)

  const firstChapter = filteredChapters.length > 0 ? filteredChapters[0] : null

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <Link href="/" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-foreground transition hover:bg-white/10">
            Voltar para Início
          </Link>
          <h1 className="text-xl font-semibold">{title}</h1>
        </div>
        <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
          <div className="space-y-4">
            {coverUrl && (
              <Image
                src={coverUrl}
                alt={title}
                width={300}
                height={400}
                className="w-full rounded-lg"
              />
            )}
            <div>
              <h1 className="text-2xl font-bold">{title}</h1>
              <p className="text-sm text-neutral-400 mt-2">{manga.attributes.status}</p>
              {manga.attributes.publicationDemographic && (
                <p className="text-sm text-neutral-400">{manga.attributes.publicationDemographic}</p>
              )}
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Descrição</h2>
              <p className="text-neutral-300">{getMangaDescription(manga, preferredLocales)}</p>
            </div>
            {availableLanguages.length > 1 && (
              <div className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-neutral-400">Idioma da obra</span>
                  <select
                    value={selectedLanguage}
                    onChange={(event) => setSelectedLanguage(event.target.value)}
                    className="rounded-2xl border border-white/10 bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary"
                  >
                    {availableLanguages.map((lang) => (
                      <option key={lang} value={lang} className="bg-background text-foreground">
                        {getLanguageLabel(lang)}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="text-xs text-neutral-400">Capítulos exibidos em {getLanguageLabel(selectedLanguage || availableLanguages[0])}.</p>
              </div>
            )}
            {firstChapter && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Ler Agora</h2>
                <Reader chapterId={firstChapter.id} />
              </div>
            )}
            <div>
              <h2 className="text-xl font-semibold mb-4">Capítulos</h2>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredChapters.length > 0 ? (
                  filteredChapters.map((chapter) => (
                    <Link
                      key={chapter.id}
                      href={`/manga/${id}/chapter/${chapter.id}`}
                      className="block p-3 rounded-lg border border-white/10 hover:bg-white/5 transition-colors"
                    >
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <span className="font-medium">Capítulo {chapter.attributes.chapter || 'Extra'}</span>
                        <span className="text-sm text-neutral-400">{chapter.attributes.title || ''}</span>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-neutral-400">
                    Nenhum capítulo encontrado para esta obra.

                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}