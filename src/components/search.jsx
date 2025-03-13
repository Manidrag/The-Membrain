"use client"

import { useState, useCallback, useEffect } from "react"
import { X, Search as SearchIcon, ArrowLeft } from "lucide-react"

import NoteDetail from "./NoteDetails"

const Search = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState({ results: [], total: 0, query: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [selectedNote, setSelectedNote] = useState(null)
  const LINK=import.meta.env.VITE_API_URL;


  useEffect(() => {
    if (!isOpen) {
      setQuery("")
      setResults({ results: [], total: 0, query: "" })
      setError("")
    }
  }, [isOpen])

  const handleSearch = useCallback(async (e) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    setError("")
    setResults({ results: [], total: 0, query: "" })

    try {
      const response = await fetch(LINK +"/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ 
          query: query.trim(),
          limit: 10
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Search failed: ${response.statusText}`)
      }

      const data = await response.json()
      
      // Validate response format
      if (!data || !Array.isArray(data.results)) {
        throw new Error("Invalid response format")
      }

      setResults({
        results: data.results,
        total: data.total || data.results.length,
        query: data.query || query
      })
      
    
    } catch (err) {
      console.error("Search error:", err)
      setError(err.message || "Failed to perform search")
    } finally {
      setLoading(false)
    }
  }, [query])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50">
      <div className="min-h-screen flex flex-col">
        {/* Search header */}
        <div className="flex items-center p-4 border-b border-gray-800">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-400" />
          </button>
          <form onSubmit={handleSearch} className="flex-1 px-4">
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search your notes..."
                className="w-full bg-gray-900 text-gray-100 rounded-lg px-4 py-3 pl-10 focus:outline-none focus:ring-2 focus:ring-accent-primary"
                autoFocus
              />
              <SearchIcon className="absolute left-3 top-3.5 h-5 w-5 text-gray-500" />
            </div>
          </form>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Search results */}
        <div className="flex-1 overflow-y-auto p-4">
          {error && (
            <div className="p-4 bg-red-900/30 border border-red-900 rounded-lg text-red-400">
              {error}
            </div>
          )}

          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-accent-primary border-t-transparent" />
            </div>
          )}

          {results.results.length > 0 && (
            <>
              <div className="text-sm text-gray-400 mb-4">
                Found {results.total} results for "{results.query}"
              </div>
              <div className="space-y-4">
                {results.results.map((resulttt) => (
                  <div
                    key={resulttt.noteId} 
                    onClick={() => setSelectedNote(resulttt)}
                    className="p-4 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 rounded-lg transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-200">
                      Note:{(resulttt.title||"NotPresent ").slice(-200) }
                      </h3>
                      <span className="text-sm text-gray-400">
                        {Math.round(resulttt.similarity * 100)}% match
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-gray-400 line-clamp-3">
                      {resulttt.text}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}

          {!loading && results.results.length === 0 && query && (
            <div className="text-center py-8 text-gray-400">
              No results found
            </div>
          )}
        </div>
      </div>
     
      {selectedNote && (
              <NoteDetail 
                note={selectedNote} 
                onClose={() => setSelectedNote(null)} 
              />)}
    </div>
    
  )
}

export default Search