"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  adminGetActors,
  adminCreateActor,
  adminUpdateActor,
  adminDeleteActor,
} from "@/api/admin"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import FormDialog from "@/components/admin/FormDialog"
import ConfirmDialog from "@/components/admin/ConfirmDialog"
import type { Person } from "@/types/movie"

const actorSchema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  photoUrl: z.string().url().optional().or(z.literal("")),
})

type ActorInput = z.infer<typeof actorSchema>

const ActorsPage = () => {
  const [actors, setActors] = useState<Person[]>([])
  const [dialog, setDialog] = useState<{ open: boolean; actor?: Person }>({
    open: false,
  })
  const [deleteTarget, setDeleteTarget] = useState<Person | null>(null)
  const [deleting, setDeleting] = useState(false)

  const load = async () => {
    const res = await adminGetActors({ limit: 200 })
    setActors(res.data.data)
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
  } = useForm<ActorInput>({ resolver: zodResolver(actorSchema) })

  useEffect(() => {
    if (dialog.open) {
      reset({
        firstName: dialog.actor?.firstName ?? "",
        lastName: dialog.actor?.lastName ?? "",
        photoUrl: dialog.actor?.photoUrl ?? "",
      })
    }
  }, [dialog, reset])

  const onSubmit = async (values: ActorInput) => {
    const data = { ...values, photoUrl: values.photoUrl || undefined }
    if (dialog.actor) {
      await adminUpdateActor(dialog.actor.id, data)
    } else {
      await adminCreateActor(data)
    }
    setDialog({ open: false })
    await load()
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    await adminDeleteActor(deleteTarget.id)
    setDeleteTarget(null)
    setDeleting(false)
    await load()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Actors</h2>
        <Button size="sm" onClick={() => setDialog({ open: true })}>
          Add Actor
        </Button>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2 font-medium">Full Name</th>
            <th className="text-left py-2 font-medium">Photo URL</th>
            <th className="text-right py-2 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {actors.map((a) => (
            <tr key={a.id} className="border-b last:border-0">
              <td className="py-2">
                {a.firstName} {a.lastName}
              </td>
              <td className="py-2 text-muted-foreground truncate max-w-[200px]">
                {a.photoUrl || "—"}
              </td>
              <td className="py-2 text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDialog({ open: true, actor: a })}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setDeleteTarget(a)}
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
        title={dialog.actor ? "Edit Actor" : "Add Actor"}
        onClose={() => setDialog({ open: false })}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="firstName">First name</Label>
              <Input id="firstName" {...register("firstName")} />
              {errors.firstName && (
                <p className="text-sm text-destructive">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last name</Label>
              <Input id="lastName" {...register("lastName")} />
              {errors.lastName && (
                <p className="text-sm text-destructive">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="photoUrl">Photo URL</Label>
            <Input id="photoUrl" placeholder="https://..." {...register("photoUrl")} />
            {errors.photoUrl && (
              <p className="text-sm text-destructive">
                {errors.photoUrl.message}
              </p>
            )}
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </form>
      </FormDialog>
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Actor"
        description={`Delete "${deleteTarget?.firstName} ${deleteTarget?.lastName}"? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  )
}

export default ActorsPage
