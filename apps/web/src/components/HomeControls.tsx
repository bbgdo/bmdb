"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useDebounce } from "@/hooks/useDebounce"
import type { Genre } from "@/types/movie"

type Props = {
  search: string
  genreId: string
  page: number
  genres: Genre[]
}

const HomeControls = ({ search, genreId, page, genres }: Props) => {
  const router = useRouter()
  const [searchValue, setSearchValue] = useState(search)
  const [selectedGenreId, setSelectedGenreId] = useState(genreId)
  const debouncedSearch = useDebounce(searchValue, 400)

  useEffect(() => {
    const params = new URLSearchParams()
    if (debouncedSearch) params.set("search", debouncedSearch)
    if (selectedGenreId) params.set("genreId", selectedGenreId)
    if (debouncedSearch === search && selectedGenreId === genreId && page > 1) {
      params.set("page", String(page))
    }

    const query = params.toString()
    const href = query ? `/?${query}` : "/"
    router.replace(href)
  }, [debouncedSearch, genreId, page, router, search, selectedGenreId])

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <Input
        placeholder="Search movies..."
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        className="sm:max-w-xs"
      />
      <Select
        value={selectedGenreId || "all"}
        onValueChange={(value) =>
          setSelectedGenreId(value === "all" ? "" : value)
        }
      >
        <SelectTrigger className="sm:max-w-[180px]">
          <SelectValue placeholder="Genre" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All genres</SelectItem>
          {genres.map((genre) => (
            <SelectItem key={genre.id} value={genre.id}>
              {genre.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export default HomeControls
