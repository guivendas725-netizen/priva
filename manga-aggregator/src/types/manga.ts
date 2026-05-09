export interface Manga {
  id: string
  type: string
  attributes: {
    title: { [key: string]: string }
    description: { [key: string]: string }
    status: string
    tags: Array<{
      id: string
      type: string
      attributes: {
        name: { [key: string]: string }
        group: string
      }
    }>
    lastChapter: string
    publicationDemographic: string
  }
  relationships: Array<{
    id: string
    type: string
    attributes?: {
      fileName: string
    }
  }>
}

export interface Chapter {
  id: string
  type: string
  attributes: {
    chapter: string
    title: string
    translatedLanguage: string
    pages: number
    publishAt: string
  }
}

export interface MangaResponse {
  data: Manga[]
  limit: number
  offset: number
  total: number
}

export interface ChapterResponse {
  data: Chapter[]
  limit: number
  offset: number
  total: number
}

export interface AtHomeResponse {
  baseUrl: string
  chapter: {
    hash: string
    data: string[]
    dataSaver: string[]
  }
}