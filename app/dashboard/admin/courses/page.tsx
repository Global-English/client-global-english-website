"use client"

import * as React from "react"
import { BookOpenCheck, ClipboardList, GraduationCap } from "lucide-react"

import { DashboardHeader } from "@/components/dashboard-header"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchAdminCourses } from "@/lib/firebase/firestore"
import type { AdminCourseSummary } from "@/lib/firebase/types"

export default function Page() {
  const { role, isFirebaseReady } = useAuth()
  const [courses, setCourses] = React.useState<AdminCourseSummary[]>([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!isFirebaseReady || role !== "admin") {
      return
    }

    let isMounted = true

    const loadCourses = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchAdminCourses()
        if (isMounted) {
          setCourses(data)
        }
      } catch {
        if (isMounted) {
          setError("Não foi possível carregar os cursos.")
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadCourses()

    return () => {
      isMounted = false
    }
  }, [isFirebaseReady, role])

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
        title="Cursos (Admin)"
        description="Gerencie catálogo, módulos e matrículas corporativas."
        action={<Button size="sm">Novo curso</Button>}
      />

      <div className="flex flex-col gap-6 p-6">
        {!isFirebaseReady ? (
          <div className="rounded-2xl border border-dashed bg-accent/40 p-4 text-sm text-muted-foreground">
            Firebase não configurado. Conecte para visualizar cursos reais.
          </div>
        ) : null}

        {error ? (
          <div className="rounded-2xl border border-dashed border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        <div className="grid gap-4">
          {loading ? (
            <Card>
              <CardContent className="p-6 text-sm text-muted-foreground">
                Carregando cursos...
              </CardContent>
            </Card>
          ) : courses.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-sm text-muted-foreground">
                Nenhum curso encontrado.
              </CardContent>
            </Card>
          ) : (
            courses.map((course) => (
              <Card key={course.id}>
                <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <CardTitle className="text-base">{course.title}</CardTitle>
                    <p className="text-xs text-muted-foreground">{course.status}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline">
                      Editar
                    </Button>
                    <Button size="sm">Abrir</Button>
                  </div>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-3">
                  <div className="flex items-center gap-3 rounded-2xl border p-3">
                    <GraduationCap className="size-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Alunos</p>
                      <p className="text-sm font-semibold">
                        {course.studentsCount}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-2xl border p-3">
                    <ClipboardList className="size-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Módulos</p>
                      <p className="text-sm font-semibold">
                        {course.modulesCount}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-2xl border p-3">
                    <BookOpenCheck className="size-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Material</p>
                      <p className="text-sm font-semibold">Atualizado</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Checklist administrativo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-2xl border border-dashed p-6 text-sm text-muted-foreground">
              Checklist será exibido quando houver dados.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
