import { useEffect, useState, useCallback } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  adminGetMovies,
  adminCreateMovie,
  adminUpdateMovie,
  adminDeleteMovie,
  adminActivateMovie,
  adminDeactivateMovie,
  adminGetGenres,
  adminGetActors,
  adminGetDirectors,
} from "@/api/admin"
import { invalidateMovies } from "@/lib/invalidateApollo"
import { useDebounce } from "@/hooks/useDebounce"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import FormDialog from "@/components/admin/FormDialog"
import ConfirmDialog from "@/components/admin/ConfirmDialog"
import type { Movie, Genre, Person } from "@/types/movie"

const movieSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(2000),
  releaseYear: z.coerce.number().int().min(1888).max(2100),
  posterUrl: z.string().url().optional().or(z.literal("")),
  genreIds: z.array(z.string()).default([]),
  actorIds: z.array(z.string()).default([]),
  directorIds: z.array(z.string()).default([]),
})

type MovieInput = z.infer<typeof movieSchema>

const LIMIT = 10

const MoviesPage = () => {
  const [movies, setMovies] = useState<Movie[]>([])
  const [genres, setGenres] = useState<Genre[]>([])
  const [actors, setActors] = useState<Person[]>([])
  const [directors, setDirectors] = useState<Person[]>([])
  const [dialog, setDialog] = useState<{ open: boolean; movie?: Movie }>({
    open: false,
  })
  const [deleteTarget, setDeleteTarget] = useState<Movie | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const debouncedSearch = useDebounce(search, 300)

  const loadMovies = useCallback(async () => {
    const params: Record<string, unknown> = { page, limit: LIMIT }
    if (debouncedSearch) params.search = debouncedSearch
    const res = await adminGetMovies(params)
    setMovies(res.data.data)
    setTotal(res.data.total)
  }, [page, debouncedSearch])

  const loadOptions = async () => {
    const [g, a, d] = await Promise.all([
      adminGetGenres(),
      adminGetActors({ limit: 200 }),
      adminGetDirectors({ limit: 200 }),
    ])
    setGenres(g.data)
    setActors(a.data.data)
    setDirectors(d.data.data)
  }

  useEffect(() => {
    loadOptions()
  }, [])

  useEffect(() => {
    loadMovies()
  }, [loadMovies])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch])

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<MovieInput>({ resolver: zodResolver(movieSchema) })

  useEffect(() => {
    if (dialog.open) {
      reset({
        title: dialog.movie?.title ?? "",
        description: dialog.movie?.description ?? "",
        releaseYear: dialog.movie?.releaseYear ?? new Date().getFullYear(),
        posterUrl: dialog.movie?.posterUrl ?? "",
        genreIds: dialog.movie?.genres?.map((g) => g.id) ?? [],
        actorIds: dialog.movie?.actors?.map((a) => a.id) ?? [],
        directorIds: dialog.movie?.directors?.map((d) => d.id) ?? [],
      })
    }
  }, [dialog, reset])

  const onSubmit = async (values: MovieInput) => {
    const data = { ...values, posterUrl: values.posterUrl || undefined }
    if (dialog.movie) {
      await adminUpdateMovie(dialog.movie.id, data)
    } else {
      await adminCreateMovie(data)
    }
    setDialog({ open: false })
    await loadMovies()
    invalidateMovies()
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    await adminDeleteMovie(deleteTarget.id)
    setDeleteTarget(null)
    setDeleting(false)
    await loadMovies()
    invalidateMovies()
  }

  const handleToggleActive = async (movie: Movie) => {
    if (movie.isActive) {
      await adminDeactivateMovie(movie.id)
    } else {
      await adminActivateMovie(movie.id)
    }
    await loadMovies()
    invalidateMovies()
  }

  const totalPages = Math.ceil(total / LIMIT)

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Movies</h2>
        <Button size="sm" onClick={() => setDialog({ open: true })}>
          Add Movie
        </Button>
      </div>
      <div className="mb-4">
        <Input
          placeholder="Search movies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2 font-medium">Poster</th>
            <th className="text-left py-2 font-medium">Title</th>
            <th className="text-left py-2 font-medium">Year</th>
            <th className="text-left py-2 font-medium">Genres</th>
            <th className="text-left py-2 font-medium">Active</th>
            <th className="text-right py-2 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {movies.map((m) => (
            <tr key={m.id} className="border-b last:border-0">
              <td className="py-2">
                {m.posterUrl ? (
                  <img
                    src={m.posterUrl}
                    alt={m.title}
                    className="w-10 h-14 object-cover rounded"
                  />
                ) : (
                  <div className="w-10 h-14 bg-muted rounded" />
                )}
              </td>
              <td className="py-2 font-medium">{m.title}</td>
              <td className="py-2">{m.releaseYear}</td>
              <td className="py-2 text-muted-foreground">
                {m.genres?.map((g) => g.name).join(", ") || "—"}
              </td>
              <td className="py-2">
                <Switch
                  checked={m.isActive}
                  onCheckedChange={() => handleToggleActive(m)}
                />
              </td>
              <td className="py-2 text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDialog({ open: true, movie: m })}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setDeleteTarget(m)}
                  >
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Prev
          </Button>
          <span className="flex items-center text-sm text-muted-foreground">
            {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
      <FormDialog
        open={dialog.open}
        title={dialog.movie ? "Edit Movie" : "Add Movie"}
        onClose={() => setDialog({ open: false })}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...register("title")} />
            {errors.title && (
              <p className="text-sm text-destructive">
                {errors.title.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              {...register("description")}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[80px]"
            />
            {errors.description && (
              <p className="text-sm text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="releaseYear">Release Year</Label>
              <Input
                id="releaseYear"
                type="number"
                {...register("releaseYear")}
              />
              {errors.releaseYear && (
                <p className="text-sm text-destructive">
                  {errors.releaseYear.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="posterUrl">Poster URL</Label>
              <Input
                id="posterUrl"
                placeholder="https://..."
                {...register("posterUrl")}
              />
              {errors.posterUrl && (
                <p className="text-sm text-destructive">
                  {errors.posterUrl.message}
                </p>
              )}
            </div>
          </div>
          <Controller
            control={control}
            name="genreIds"
            render={({ field }) => (
              <div className="space-y-2">
                <Label>Genres</Label>
                <div className="max-h-32 overflow-y-auto border rounded-md p-2 space-y-1">
                  {genres.map((g) => (
                    <label
                      key={g.id}
                      className="flex items-center gap-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={field.value?.includes(g.id)}
                        onChange={(e) => {
                          const next = e.target.checked
                            ? [...(field.value || []), g.id]
                            : (field.value || []).filter(
                                (id: string) => id !== g.id,
                              )
                          field.onChange(next)
                        }}
                      />
                      {g.name}
                    </label>
                  ))}
                </div>
              </div>
            )}
          />
          <Controller
            control={control}
            name="actorIds"
            render={({ field }) => (
              <div className="space-y-2">
                <Label>Actors</Label>
                <div className="max-h-32 overflow-y-auto border rounded-md p-2 space-y-1">
                  {actors.map((a) => (
                    <label
                      key={a.id}
                      className="flex items-center gap-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={field.value?.includes(a.id)}
                        onChange={(e) => {
                          const next = e.target.checked
                            ? [...(field.value || []), a.id]
                            : (field.value || []).filter(
                                (id: string) => id !== a.id,
                              )
                          field.onChange(next)
                        }}
                      />
                      {a.firstName} {a.lastName}
                    </label>
                  ))}
                </div>
              </div>
            )}
          />
          <Controller
            control={control}
            name="directorIds"
            render={({ field }) => (
              <div className="space-y-2">
                <Label>Directors</Label>
                <div className="max-h-32 overflow-y-auto border rounded-md p-2 space-y-1">
                  {directors.map((d) => (
                    <label
                      key={d.id}
                      className="flex items-center gap-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={field.value?.includes(d.id)}
                        onChange={(e) => {
                          const next = e.target.checked
                            ? [...(field.value || []), d.id]
                            : (field.value || []).filter(
                                (id: string) => id !== d.id,
                              )
                          field.onChange(next)
                        }}
                      />
                      {d.firstName} {d.lastName}
                    </label>
                  ))}
                </div>
              </div>
            )}
          />
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </form>
      </FormDialog>
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Movie"
        description={`Delete "${deleteTarget?.title}"? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  )
}

export default MoviesPage
