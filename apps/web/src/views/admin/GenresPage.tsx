"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  adminGetGenres,
  adminCreateGenre,
  adminUpdateGenre,
  adminDeleteGenre,
} from "@/api/admin"
import { invalidateGenres } from "@/lib/invalidateApollo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import FormDialog from "@/components/admin/FormDialog"
import ConfirmDialog from "@/components/admin/ConfirmDialog"
import type { Genre } from "@/types/movie"

const genreSchema = z.object({
  name: z.string().min(2).max(50),
})

type GenreInput = z.infer<typeof genreSchema>

const GenresPage = () => {
  const [genres, setGenres] = useState<Genre[]>([])
  const [dialog, setDialog] = useState<{ open: boolean; genre?: Genre }>({
    open: false,
  })
  const [deleteTarget, setDeleteTarget] = useState<Genre | null>(null)
  const [deleting, setDeleting] = useState(false)

  const load = async () => {
    const res = await adminGetGenres()
    setGenres(res.data)
  }

  useEffect(() => {
    void (async () => {
      await load()
    })()
  }, [])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<GenreInput>({ resolver: zodResolver(genreSchema) })

  useEffect(() => {
    if (dialog.open) {
      reset({ name: dialog.genre?.name ?? "" })
    }
  }, [dialog, reset])

  const onSubmit = async (values: GenreInput) => {
    if (dialog.genre) {
      await adminUpdateGenre(dialog.genre.id, values.name)
    } else {
      await adminCreateGenre(values.name)
    }
    setDialog({ open: false })
    await load()
    invalidateGenres()
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    await adminDeleteGenre(deleteTarget.id)
    setDeleteTarget(null)
    setDeleting(false)
    await load()
    invalidateGenres()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Genres</h2>
        <Button size="sm" onClick={() => setDialog({ open: true })}>
          Add Genre
        </Button>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2 font-medium">Name</th>
            <th className="text-right py-2 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {genres.map((g) => (
            <tr key={g.id} className="border-b last:border-0">
              <td className="py-2">{g.name}</td>
              <td className="py-2 text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDialog({ open: true, genre: g })}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setDeleteTarget(g)}
                  >
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <FormDialog
        open={dialog.open}
        title={dialog.genre ? "Edit Genre" : "Add Genre"}
        onClose={() => setDialog({ open: false })}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register("name")} />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </form>
      </FormDialog>
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Genre"
        description={`Delete "${deleteTarget?.name}"? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  )
}

export default GenresPage
