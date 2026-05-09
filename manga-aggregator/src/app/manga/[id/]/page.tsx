'use client'

import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { getMangaDetails, getChapters, getCoverUrl } from '@/lib/api'
import { Manga, Chapter } from '@/types/manga'

export default function MangaPage() {
  const params = useParams()
  const id = params.id as string

  const { data: manga } = useQuery({
    queryKey: ['manga', id],
    queryFn: () => getMangaDetails(id),
  })

  const { data: chapters } = useQuery({
    queryKey: ['chapters', id],
    queryFn: () => getChapters(id),
  })

  if (!manga) return <div>Carregando...</div>

  const coverRel = manga.relationships.find(rel => rel.type === 'cover_art')
  const coverUrl = coverRel ? getCoverUrl(manga.id, coverRel.attributes!.fileName, 'original') : ''

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          {coverUrl && (
            <Image
              src={coverUrl}
              alt={manga.attributes.title.en || 'Cover'}
              width={300}
              height={400}
              className="w-full rounded-lg"
            />
          )}
        </div>
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold mb-4">
            {manga.attributes.title.en || 'Untitled'}
          </h1>
          <p className="text-muted-foreground mb-4">
            {manga.attributes.description.en || 'No description available.'}
          </p>
          <div className="mb-4">
            <span className="font-semibold">Status:</span> {manga.attributes.status}
          </div>
          <div className="mb-4">
            <span className="font-semibold">Demografia:</span> {manga.attributes.publicationDemographic || 'Unknown'}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Capítulos</h2>
        <div className="space-y-2">
          {chapters?.map((chapter: Chapter) => (
            <Link key={chapter.id} href={`/manga/${id}/reader/${chapter.id}`}>
              <Button variant="outline" className="w-full justify-start">
                Capítulo {chapter.attributes.chapter} - {chapter.attributes.title || 'Untitled'}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}