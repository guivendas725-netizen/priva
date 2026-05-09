import { useState } from 'react'
import './App.css'

function App() {
  const [query, setQuery] = useState('')
  const [mangas, setMangas] = useState([])
  const [selectedManga, setSelectedManga] = useState(null)
  const [chapters, setChapters] = useState([])
  const [selectedChapter, setSelectedChapter] = useState(null)
  const [pages, setPages] = useState([])

  const searchMangas = async () => {
    if (!query) return
    try {
      const response = await fetch(`https://api.mangadex.org/manga?title=${encodeURIComponent(query)}&limit=10&includes[]=cover_art`)
      const data = await response.json()
      setMangas(data.data)
    } catch (error) {
      console.error('Erro ao buscar mangás:', error)
    }
  }

  const loadChapters = async (mangaId) => {
    try {
      const response = await fetch(`https://api.mangadex.org/manga/${mangaId}/feed?translatedLanguage[]=en&order[chapter]=asc`)
      const data = await response.json()
      setChapters(data.data)
      setSelectedManga(mangaId)
    } catch (error) {
      console.error('Erro ao carregar capítulos:', error)
    }
  }

  const loadPages = async (chapterId) => {
    try {
      const response = await fetch(`https://api.mangadex.org/at-home/server/${chapterId}`)
      const data = await response.json()
      const baseUrl = data.baseUrl
      const chapter = data.chapter
      const pages = chapter.data.map(page => `${baseUrl}/data/${chapter.hash}/${page}`)
      setPages(pages)
      setSelectedChapter(chapterId)
    } catch (error) {
      console.error('Erro ao carregar páginas:', error)
    }
  }

  return (
    <div className="app">
      <h1>Leitor de Mangá Gratuito</h1>
      {!selectedChapter ? (
        <>
          <div className="search">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar mangá..."
            />
            <button onClick={searchMangas}>Buscar</button>
          </div>
          <div className="manga-list">
            {mangas.map(manga => {
              const coverRel = manga.relationships.find(rel => rel.type === 'cover_art')
              const coverUrl = coverRel ? `https://uploads.mangadex.org/covers/${manga.id}/${coverRel.attributes.fileName}.256.jpg` : ''
              return (
                <div key={manga.id} className="manga-item" onClick={() => loadChapters(manga.id)}>
                  <img src={coverUrl} alt={manga.attributes.title.en} />
                  <h3>{manga.attributes.title.en || 'Título não disponível'}</h3>
                </div>
              )
            })}
          </div>
          {selectedManga && (
            <div className="chapters">
              <h2>Capítulos</h2>
              {chapters.map(chapter => (
                <div key={chapter.id} onClick={() => loadPages(chapter.id)}>
                  Capítulo {chapter.attributes.chapter}
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="reader">
          <button onClick={() => setSelectedChapter(null)}>Voltar</button>
          {pages.map((page, index) => (
            <img key={index} src={page} alt={`Página ${index + 1}`} />
          ))}
        </div>
      )}
    </div>
  )
}

export default App
