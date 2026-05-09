import Link from 'next/link'
import Image from 'next/image'
import { JikanManga } from '@/types/jikan'

interface JikanCardProps {
  manga: JikanManga
}

export function JikanCard({ manga }: JikanCardProps) {
  return (
    <Link href={manga.url} className="group min-w-[180px] overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-lg shadow-black/10 transition hover:-translate-y-1 hover:shadow-2xl">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-900">
        <Image
          src={manga.images.jpg.image_url}
          alt={manga.title}
          fill
          sizes="180px"
          className="object-cover transition duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <h3 className="text-sm font-semibold text-foreground truncate">{manga.title}</h3>
        <p className="mt-2 text-xs text-neutral-400">Rank #{manga.rank ?? '—'}</p>
      </div>
    </Link>
  )
}
