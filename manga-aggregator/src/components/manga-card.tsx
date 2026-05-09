import Image from 'next/image'
import Link from 'next/link'
import { Manga } from '@/types/manga'
import { getCoverUrl, getMangaTitle } from '@/lib/api'

interface MangaCardProps {
  manga: Manga
}

export function MangaCard({ manga }: MangaCardProps) {
  const coverRel = manga.relationships.find(rel => rel.type === 'cover_art')
  const coverUrl = coverRel ? getCoverUrl(manga.id, coverRel.attributes!.fileName) : ''
  const title = getMangaTitle(manga)

  return (
    <Link href={`/manga/${manga.id}`} className="group">
      <div className="bg-card rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
        <div className="aspect-[3/4] relative">
          {coverUrl && (
            <Image
              src={coverUrl}
              alt={title}
              fill
              sizes="200px"
              className="object-cover group-hover:scale-105 transition-transform"
            />
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-sm truncate">
            {title}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            {manga.attributes.status}
          </p>
        </div>
      </div>
    </Link>
  )
}