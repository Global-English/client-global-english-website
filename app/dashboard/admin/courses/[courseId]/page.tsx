"use client"

import * as React from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, ClipboardList, Sparkles } from "lucide-react"

import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/hooks/use-auth"
import type { AdminCourseSummary, Track } from "@/lib/firebase/types"
import { fetchAdminCourses } from "@/modules/courses"
import {
  createAdminCourseTrack,
  fetchAdminCourseTracks,
  updateAdminCourseTrack,
} from "@/modules/tracks"

type TrackForm = {
  title: string
  description: string
  order: string
}

export default function Page() {
  const { role, isFirebaseReady, user } = useAuth()
  const params = useParams<{ courseId?: string }>()
  const courseId = Array.isArray(params?.courseId)
    ? params.courseId[0]
    : params?.courseId

  const [course, setCourse] = React.useState<AdminCourseSummary | null>(null)
  const [tracks, setTracks] = React.useState<Track[]>([])
  const [loadingCourse, setLoadingCourse] = React.useState(false)
  const [loadingTracks, setLoadingTracks] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [trackError, setTrackError] = React.useState<string | null>(null)
  const [creating, setCreating] = React.useState(false)
  const [editingTrackId, setEditingTrackId] = React.useState<string | null>(
    null
  )
  const [form, setForm] = React.useState<TrackForm>({
    title: "",
    description: "",
    order: "",
  })

  const isEditing = editingTrackId !== null

  const loadCourse = React.useCallback(async () => {
    if (!courseId) {
      setError("Curso inválido.")
      return
    }

    try {
      setLoadingCourse(true)
      setError(null)
      const idToken = user ? await user.getIdToken() : null
      const data = await fetchAdminCourses(idToken)
      const match = data.find((item) => item.id === courseId) ?? null
      setCourse(match)
      if (!match) {
        setError("Curso não encontrado.")
      }
    } catch {
      setError("Não foi possível carregar o curso.")
    } finally {
      setLoadingCourse(false)
    }
  }, [courseId, user])

  const loadTracks = React.useCallback(async () => {
    if (!courseId) return
    try {
      setLoadingTracks(true)
      setTrackError(null)
      const idToken = user ? await user.getIdToken() : null
      const data = await fetchAdminCourseTracks(idToken, courseId)
      setTracks(data)
    } catch {
      setTrackError("Não foi possível carregar os módulos.")
    } finally {
      setLoadingTracks(false)
    }
  }, [courseId, user])

  React.useEffect(() => {
    if (!isFirebaseReady || role !== "admin") {
      return
    }

    void loadCourse()
    void loadTracks()
  }, [isFirebaseReady, role, loadCourse, loadTracks])

  const resetForm = React.useCallback(() => {
    setForm({ title: "", description: "", order: "" })
    setEditingTrackId(null)
    setTrackError(null)
  }, [])

  const handleCreateOrUpdateTrack = async () => {
    if (!courseId) {
      setTrackError("Curso inválido.")
      return
    }

    if (!form.title.trim() || !form.description.trim()) {
      setTrackError("Título e descrição são obrigatórios.")
      return
    }

    const orderValue = form.order.trim()
    let resolvedOrder: number | undefined
    if (orderValue) {
      const orderNumber = Number(orderValue)
      if (!Number.isFinite(orderNumber) || orderNumber <= 0) {
        setTrackError("A ordem deve ser um número positivo.")
        return
      }
      resolvedOrder = Math.floor(orderNumber)
    }

    try {
      setCreating(true)
      setTrackError(null)
      const idToken = user ? await user.getIdToken() : null
      if (isEditing) {
        await updateAdminCourseTrack(idToken, {
          id: editingTrackId ?? "",
          title: form.title.trim(),
          description: form.description.trim(),
          order: resolvedOrder,
        })
      } else {
        await createAdminCourseTrack(idToken, {
          courseId,
          title: form.title.trim(),
          description: form.description.trim(),
          order: resolvedOrder,
        })
      }
      resetForm()
      await loadTracks()
    } catch {
      setTrackError(
        isEditing
          ? "Não foi possível salvar o módulo."
          : "Não foi possível criar o módulo."
      )
    } finally {
      setCreating(false)
    }
  }

  if (role !== "admin") {
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Acesso restrito</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Esta área é exclusiva para administradores.
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div>
      <DashboardHeader
        title="Módulos do curso"
        description="Crie e organize os módulos que estruturam o aprendizado."
        action={
          <Button asChild size="sm" variant="outline">
            <Link href="/dashboard/admin/courses">
              <ArrowLeft className="size-4" />
              Voltar para cursos
            </Link>
          </Button>
        }
      />

      <div className="flex flex-col gap-6 p-6">
        {!isFirebaseReady ? (
          <div className="rounded-2xl border border-dashed bg-accent/40 p-4 text-sm text-muted-foreground">
            Firebase nÃ£o configurado. Conecte para gerenciar cursos reais.
          </div>
        ) : null}

        {error ? (
          <div className="rounded-2xl border border-dashed border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        <div className="grid gap-4 lg:grid-cols-[2fr,1fr]">
          <Card className="border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">Detalhes do curso</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Informações gerais e status do treinamento.
                </p>
              </div>
              <span className="inline-flex items-center rounded-full border bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                {course?.status ?? "Carregando"}
              </span>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Curso
                </p>
                <p className="text-lg font-semibold text-foreground">
                  {loadingCourse ? "Carregando..." : course?.title ?? "-"}
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                {course?.description ||
                  (loadingCourse ? "Carregando detalhes..." : "Sem descrição.")}
              </p>
              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span className="rounded-full border px-2 py-1">
                  Nível: {course?.level ?? "-"}
                </span>
                <span className="rounded-full border px-2 py-1">
                  Duração: {course?.durationWeeks ?? "-"} semanas
                </span>
                <span className="rounded-full border px-2 py-1">
                  Módulos: {tracks.length}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Sparkles className="size-4 text-primary" />
                {isEditing ? "Editar módulo" : "Criar módulo"}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {isEditing
                  ? "Atualize o conteúdo e salve as alterações."
                  : "Defina o título, resumo e ordem do módulo."}
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="track-title">Título do módulo</Label>
                <Input
                  id="track-title"
                  placeholder="Ex.: Comunicação estratégica"
                  value={form.title}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, title: event.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="track-description">Descrição</Label>
                <textarea
                  id="track-description"
                  className="bg-card text-foreground border-input min-h-24 w-full rounded-md border p-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                  placeholder="Objetivo, conteúdo e resultados esperados."
                  value={form.description}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      description: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="track-order">Ordem (opcional)</Label>
                <Input
                  id="track-order"
                  type="number"
                  min={1}
                  placeholder="Ex.: 1"
                  value={form.order}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, order: event.target.value }))
                  }
                />
              </div>

              {trackError ? (
                <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
                  {trackError}
                </div>
              ) : null}

              <div className="flex flex-wrap items-center gap-2">
                <Button onClick={handleCreateOrUpdateTrack} disabled={creating}>
                  {creating
                    ? isEditing
                      ? "Salvando módulo..."
                      : "Criando módulo..."
                    : isEditing
                    ? "Salvar alterações"
                    : "Salvar módulo"}
                </Button>
                <Button variant="outline" disabled={creating} onClick={resetForm}>
                  {isEditing ? "Cancelar edição" : "Limpar"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Módulos cadastrados</CardTitle>
              <p className="text-sm text-muted-foreground">
                Acompanhe a sequência e revise o conteúdo de cada módulo.
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => void loadTracks()}
              disabled={loadingTracks}
            >
              Atualizar lista
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {loadingTracks ? (
                <Card className="md:col-span-2 xl:col-span-3">
                  <CardContent className="p-6 text-sm text-muted-foreground">
                    Carregando módulos...
                  </CardContent>
                </Card>
              ) : tracks.length === 0 ? (
                <Card className="md:col-span-2 xl:col-span-3">
                  <CardContent className="p-6 text-sm text-muted-foreground">
                    Nenhum módulo criado. Comece cadastrando o primeiro.
                  </CardContent>
                </Card>
              ) : (
                tracks.map((track) => (
                  <Card key={track.id} className="border-muted-foreground/20">
                    <CardHeader className="flex flex-row items-start justify-between gap-2">
                      <div>
                        <CardTitle className="text-base">{track.title}</CardTitle>
                        <p className="text-xs text-muted-foreground">
                          Ordem {track.order}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                          <ClipboardList className="size-3" />
                          Módulo
                        </span>
                        <Button
                          size="xs"
                          variant="outline"
                          onClick={() => {
                            setEditingTrackId(track.id)
                            setTrackError(null)
                            setForm({
                              title: track.title,
                              description: track.description,
                              order: track.order ? String(track.order) : "",
                            })
                          }}
                        >
                          Editar
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                      {track.description || "Sem descrição cadastrada."}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
