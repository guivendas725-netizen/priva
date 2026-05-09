import { Manga, Chapter, MangaResponse, ChapterResponse, AtHomeResponse } from '@/types/manga'
import { JikanManga, JikanTopResponse } from '@/types/jikan'

const BASE_URL = 'https://api.mangadex.org'

export async function searchMangas(query: string, limit = 20): Promise<Manga[]> {
  const params = new URLSearchParams()
  params.set('title', query)
  params.set('limit', limit.toString())
  params.append('includes[]', 'cover_art')
  params.append('order[relevance]', 'desc')

  const response = await fetch(`${BASE_URL}/manga?${params}`)
  const data: MangaResponse = await response.json()
  return data.data
}

export async function fetchLatestMangas(limit = 12): Promise<Manga[]> {
  const params = new URLSearchParams()
  params.set('limit', limit.toString())
  params.append('includes[]', 'cover_art')
  params.append('order[updatedAt]', 'desc')

  const response = await fetch(`${BASE_URL}/manga?${params}`)
  const data: MangaResponse = await response.json()
  return data.data
}

export async function fetchPopularMangas(limit = 12): Promise<Manga[]> {
  const params = new URLSearchParams()
  params.set('limit', limit.toString())
  params.append('includes[]', 'cover_art')
  params.append('order[followedCount]', 'desc')

  const response = await fetch(`${BASE_URL}/manga?${params}`)
  const data: MangaResponse = await response.json()
  return data.data
}

export async function getMangaDetails(id: string): Promise<Manga> {
  const response = await fetch(`${BASE_URL}/manga/${id}?includes[]=cover_art&includes[]=author&includes[]=artist`)
  const data = await response.json()
  return data.data
}

export async function getChapters(mangaId: string, limit = 100): Promise<Chapter[]> {
  const params = new URLSearchParams()
  params.set('limit', limit.toString())
  params.append('order[chapter]', 'asc')

  const response = await fetch(`${BASE_URL}/manga/${mangaId}/feed?${params}`)
  const data: ChapterResponse = await response.json()
  return data.data
}

export async function getChapterPages(chapterId: string): Promise<AtHomeResponse> {
  const response = await fetch(`${BASE_URL}/at-home/server/${chapterId}`)
  return await response.json()
}

export async function fetchTopMangaJikan(limit = 10): Promise<JikanManga[]> {
  const response = await fetch(`https://api.jikan.moe/v4/top/manga?limit=${limit}`)
  const data: JikanTopResponse = await response.json()
  return data.data
}

export function getCoverUrl(mangaId: string, fileName: string, size: '256' | '512' | 'original' = '256'): string {
  return `https://uploads.mangadex.org/covers/${mangaId}/${fileName}.${size}.jpg`
}

export function getPageUrl(baseUrl: string, chapterHash: string, page: string): string {
  return `${baseUrl}/data/${chapterHash}/${page}`
}

export function getTranslationByLocale(map: { [key: string]: string }, preferredLocales: string[] = []): string {
  const normalizedLocales = preferredLocales.map((locale) => locale.toLowerCase())

  for (const locale of normalizedLocales) {
    if (map[locale]) {
      return map[locale]
    }

    const baseLocale = locale.split('-')[0]
    if (map[baseLocale]) {
      return map[baseLocale]
    }
  }

  if (map.en) return map.en
  if (map.ja) return map.ja
  if (map['ja-ro']) return map['ja-ro']
  return Object.values(map)[0] || ''
}

export function getMangaTitle(manga: Manga, preferredLocales: string[] = []): string {
  return getTranslationByLocale(manga.attributes.title, preferredLocales) || 'Sem título'
}

export function getMangaDescription(manga: Manga, preferredLocales: string[] = []): string {
  return getTranslationByLocale(manga.attributes.description, preferredLocales) || 'Descrição indisponível.'
}