export interface JikanManga {
  mal_id: number
  url: string
  title: string
  images: {
    jpg: {
      image_url: string
    }
  }
  rank?: number
  volumes?: number | null
  status?: string
  synopsis?: string
}

export interface JikanTopResponse {
  data: JikanManga[]
}
