'use client'

import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { MangaCard } from '@/components/manga-card'
import { JikanCard } from '@/components/jikan-card'
import { Carousel } from '@/components/carousel'
import { useAuth } from '@/components/auth-context'
import { fetchLatestMangas, fetchPopularMangas, fetchTopMangaJikan, searchMangas, getMangaTitle, getMangaDescription } from '@/lib/api'
import { Manga } from '@/types/manga'

export default function Home() {
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [preferredLocales, setPreferredLocales] = useState<string[]>(['en'])
  const { user, logout } = useAuth()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const browserLocales = navigator.languages?.map((lang) => lang.toLowerCase()) || [navigator.language.toLowerCase()]
      setPreferredLocales(browserLocales)
    }
  }, [])

  const latestQuery = useQuery({
    queryKey: ['latestMangas'],
    queryFn: () => fetchLatestMangas(12),
  })

  const popularQuery = useQuery({
    queryKey: ['popularMangas'],
    queryFn: () => fetchPopularMangas(12),
  })

  const topMangaQuery = useQuery({
    queryKey: ['topMangaJikan'],
    queryFn: () => fetchTopMangaJikan(10),
  })

  const searchQuery = useQuery({
    queryKey: ['searchMangas', debouncedQuery],
    queryFn: () => searchMangas(debouncedQuery),
    enabled: debouncedQuery.length > 1,
    staleTime: 1000 * 60 * 5,
  })

  const handleSearch = () => {
    setDebouncedQuery(query.trim())
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query.trim())
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  const hero = latestQuery.data?.[0]
  const heroTitle = hero ? getMangaTitle(hero, preferredLocales) : 'Destaque'
  const heroDescription = hero ? getMangaDescription(hero, preferredLocales) : ''

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-6 flex-wrap">
              <h1 className="text-xl font-bold">Manga Aggregator</h1>
              <a href="#latest" className="text-sm hover:text-primary transition-colors">Lançamentos</a>
              <a href="#popular" className="text-sm hover:text-primary transition-colors">Populares</a>
              <a href="#top" className="text-sm hover:text-primary transition-colors">Top</a>
              <Link href="/support" className="rounded-full border border-primary bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition hover:bg-primary/20">Apoiar</Link>
            </div>
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <span className="text-sm text-neutral-300">Olá, {user.name}</span>
                  <Button onClick={logout} variant="outline" className="text-sm">Sair</Button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-sm hover:text-primary transition-colors">Entrar</Link>
                  <Link href="/register" className="text-sm hover:text-primary transition-colors">Cadastrar</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      <header className="border-b border-white/10">
        <div className="container mx-auto px-6 py-8">
          <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr] xl:items-start">
            <div className="space-y-6">
              <div className="rounded-4xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/20">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-base font-semibold">Apoie o projeto</p>
                    <p className="mt-2 text-sm text-neutral-300 max-w-xl">Se quiser ajudar com qualquer valor, clique para ir à página de apoio.</p>
                  </div>
                  <Link href="/support" className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary/90">
                    Apoiar agora
                  </Link>
                </div>
              </div>
              <span className="inline-flex rounded-full border border-white/10 px-4 py-1 text-xs uppercase tracking-[0.35em] text-neutral-400">Vitrine de Mangás</span>
              <div>
                <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">Descubra sua próxima leitura.</h1>
                <p className="mt-4 max-w-2xl text-lg text-neutral-300">Atualizações em tempo real, recomendações de APIs gratuitas e seções como na Netflix para navegar por títulos, lançamentos e tendências.</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Input
                  placeholder="Buscar mangá, manhua ou manhwa"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="flex-1"
                />
                <Button onClick={handleSearch} className="flex items-center justify-center gap-2">
                  <Search className="h-4 w-4" /> Buscar
                </Button>
              </div>
              {debouncedQuery.length > 1 && (
                <div className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-4">
                  {searchQuery.isLoading && <p className="text-sm text-neutral-300">Buscando...</p>}
                  {searchQuery.error && <p className="text-sm text-red-300">Erro ao buscar resultados. Tente novamente.</p>}
                  {searchQuery.data?.length ? (
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
                      {searchQuery.data.map((manga: Manga) => (
                        <MangaCard key={manga.id} manga={manga} />
                      ))}
                    </div>
                  ) : searchQuery.isFetched && !searchQuery.isLoading ? (
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center text-neutral-300">Nenhum resultado encontrado.</div>
                  ) : null}
                </div>
              )}
              <div className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-5 shadow-sm shadow-black/10">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-base font-semibold">Quer apoiar o site?</h3>
                    <p className="text-sm text-neutral-300">Clique no botão e ajude com qualquer valor via Pix.</p>
                  </div>
                  <Link href="/support" className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary/90">
                    Quero apoiar
                  </Link>
                </div>
              </div>
            </div>
            <div className="rounded-4xl overflow-hidden border border-white/10 bg-white/5 shadow-2xl shadow-black/20">
              {hero ? (
                <div className="relative h-[420px] bg-slate-900">
                  <img
                    src={hero.relationships.find((rel) => rel.type === 'cover_art') ? `https://uploads.mangadex.org/covers/${hero.id}/${hero.relationships.find((rel) => rel.type === 'cover_art')?.attributes?.fileName}.512.jpg` : '/'}
                    alt={getMangaTitle(hero)}
                    className="h-full w-full object-cover brightness-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-left">
                    <span className="text-xs uppercase tracking-[0.35em] text-neutral-400">Destaque</span>
                    <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{heroTitle}</h2>
                    <p className="mt-3 max-w-xl text-sm text-neutral-300 max-h-24 overflow-hidden">{heroDescription.slice(0, 180) || 'Veja os lançamentos mais recentes e descubra novos títulos.'}</p>
                  </div>
                </div>
              ) : (
                <div className="flex h-full items-center justify-center p-10 text-neutral-400">Carregando destaque...</div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-10 space-y-12">
        <section id="latest">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold">Lançamentos recentes</h2>
              <p className="text-sm text-neutral-400">Novos títulos atualizados em inglês pela MangaDex.</p>
            </div>
          </div>
          <Carousel>
            {latestQuery.data?.map((manga: Manga) => (
              <div key={manga.id} className="min-w-[220px] max-w-[220px]">
                <MangaCard manga={manga} />
              </div>
            ))}
          </Carousel>
        </section>

        <section id="popular">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold">Mais populares</h2>
              <p className="text-sm text-neutral-400">Os mangás mais seguidos e destacados na MangaDex.</p>
            </div>
          </div>
          <Carousel>
            {popularQuery.data?.map((manga: Manga) => (
              <div key={manga.id} className="min-w-[220px] max-w-[220px]">
                <MangaCard manga={manga} />
              </div>
            ))}
          </Carousel>
        </section>

        <section id="top">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold">Top do Jikan</h2>
              <p className="text-sm text-neutral-400">Mais populares nas listas gratuitas do Jikan/MAL.</p>
            </div>
          </div>
          <Carousel>
            {topMangaQuery.data?.map((manga) => (
              <div key={manga.mal_id} className="min-w-[180px] max-w-[180px]">
                <JikanCard manga={manga} />
              </div>
            ))}
          </Carousel>
        </section>

        {debouncedQuery && (
          <section>
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold">Resultados para '{debouncedQuery}'</h2>
                <p className="text-sm text-neutral-400">Explore os títulos encontrados no MangaDex.</p>
              </div>
            </div>
            {searchQuery.isLoading && <div className="text-center text-neutral-300">Buscando...</div>}
            {searchQuery.error && <div className="rounded-3xl border border-red-400 bg-red-500/10 p-6 text-center text-red-200">Erro ao buscar resultados. Tente novamente.</div>}
            {searchQuery.data?.length ? (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
                {searchQuery.data.map((manga: Manga) => (
                  <MangaCard key={manga.id} manga={manga} />
                ))}
              </div>
            ) : searchQuery.isFetched && !searchQuery.isLoading ? (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center text-neutral-300">Nenhum resultado encontrado.</div>
            ) : null}
          </section>
        )}
      </main>
    </div>
  )
}
