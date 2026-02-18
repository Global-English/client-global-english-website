"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  BookOpen,
  ClipboardCheck,
  GraduationCap,
  Layers,
  ListChecks,
  Users,
} from "lucide-react"

import { DashboardHeader } from "@/components/dashboard-header"
import { useAuth } from "@/hooks/use-auth"
import { fetchUserDashboard } from "@/lib/firebase/firestore"
import type { DashboardCourse } from "@/lib/firebase/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const fallbackCourses: DashboardCourse[] = [
  {
    id: "demo-course-1",
    title: "Inglês Corporativo Avançado",
    description: "Foco em reuniões, apresentações e relatórios.",
    level: "Advanced",
    durationWeeks: 8,
    coverUrl: undefined,
    enrollment: {
      id: "demo-enroll-1",
      userId: "demo",
      courseId: "demo-course-1",
      status: "active",
      progress: 72,
    },
    tracks: [
      {
        id: "track-1",
        courseId: "demo-course-1",
        title: "Comunicação estratégica",
        description: "Pitch, storytelling e influência.",
        order: 1,
      },
      {
        id: "track-2",
        courseId: "demo-course-1",
        title: "Writing executivo",
        description: "Emails, reports e memos.",
        order: 2,
      },
    ],
    activities: [
      {
        id: "activity-1",
        courseId: "demo-course-1",
        trackId: "track-1",
        title: "Apresentação de resultados",
        type: "project",
        order: 1,
        estimatedMinutes: 45,
      },
      {
        id: "activity-2",
        courseId: "demo-course-1",
        trackId: "track-2",
        title: "Revisão de e-mails críticos",
        type: "assignment",
        order: 2,
        estimatedMinutes: 30,
      },
    ],
  },
  {
    id: "demo-course-2",
    title: "Fluência para equipes globais",
    description: "Conversação e listening para contextos multiculturais.",
    level: "Intermediate",
    durationWeeks: 6,
    coverUrl: undefined,
    enrollment: {
      id: "demo-enroll-2",
      userId: "demo",
      courseId: "demo-course-2",
      status: "active",
      progress: 38,
    },
    tracks: [
      {
        id: "track-3",
        courseId: "demo-course-2",
        title: "Daily syncs",
        description: "Rotina de alinhamento rápido.",
        order: 1,
      },
    ],
    activities: [
      {
        id: "activity-3",
        courseId: "demo-course-2",
        trackId: "track-3",
        title: "Simulação de reunião",
        type: "lesson",
        order: 1,
        estimatedMinutes: 25,
      },
    ],
  },
]

export default function Page() {
  const router = useRouter()
  const { user, loading, isFirebaseReady } = useAuth()
  const [courses, setCourses] = React.useState<DashboardCourse[]>(fallbackCourses)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    if (!loading && !user && isFirebaseReady) {
      router.push("/login")
    }
  }, [loading, user, router, isFirebaseReady])

  React.useEffect(() => {
    async function loadDashboard() {
      if (!user || !isFirebaseReady) {
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      try {
        const data = await fetchUserDashboard(user.uid)
        setCourses(data.length ? data : fallbackCourses)
      } catch {
        setCourses(fallbackCourses)
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboard()
  }, [user, isFirebaseReady])

  const stats = {
    courses: courses.length,
    tracks: courses.reduce((total, course) => total + course.tracks.length, 0),
    activities: courses.reduce(
      (total, course) => total + course.activities.length,
      0
    ),
    progress: courses.length
      ? Math.round(
          courses.reduce((sum, course) => sum + course.enrollment.progress, 0) /
            courses.length
        )
      : 0,
  }

  return (
    <div>
      <DashboardHeader
        title="Painel do aluno"
        description="Acompanhe seus cursos, trilhas e atividades atuais."
      />

      <div className="flex flex-1 flex-col gap-6 p-6">
        {!isFirebaseReady ? (
          <div className="rounded-2xl border border-dashed bg-muted/40 p-4 text-sm text-muted-foreground">
            Firebase não configurado. Mostrando dados de demonstração.
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">Cursos</CardTitle>
              <GraduationCap className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{stats.courses}</div>
              <p className="text-xs text-muted-foreground">Matrículas ativas</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">Trilhas</CardTitle>
              <Layers className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{stats.tracks}</div>
              <p className="text-xs text-muted-foreground">
                Trilhas em andamento
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">Atividades</CardTitle>
              <ClipboardCheck className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{stats.activities}</div>
              <p className="text-xs text-muted-foreground">Itens planejados</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">Progresso</CardTitle>
              <ListChecks className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{stats.progress}%</div>
              <p className="text-xs text-muted-foreground">Média dos cursos</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <Card>
            <CardHeader className="flex items-center justify-between gap-2 sm:flex-row">
              <div>
                <CardTitle className="text-base">Cursos ativos</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Sua visão rápida das trilhas e atividades.
                </p>
              </div>
              <Button variant="outline" size="sm">
                Ver catálogo
              </Button>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-sm text-muted-foreground">
                  Carregando seus cursos...
                </p>
              ) : courses.length ? (
                <div className="space-y-4">
                  {courses.map((course) => (
                    <div
                      key={course.id}
                      className="flex flex-col gap-3 rounded-2xl border p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold">{course.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {course.description ||
                              "Plano de estudos com foco em conversação."}
                          </p>
                        </div>
                        <span className="rounded-full bg-muted px-3 py-1 text-xs">
                          {course.enrollment.progress}% concluído
                        </span>
                      </div>
                      <div className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-3">
                        <span>{course.level}</span>
                        <span>{course.tracks.length} trilhas</span>
                        <span>{course.activities.length} atividades</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-2 rounded-2xl border border-dashed p-6 text-center">
                  <GraduationCap className="mx-auto size-6 text-muted-foreground" />
                  <p className="text-sm font-medium">
                    Nenhum curso atribuído ainda
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Quando você for matriculado, seus cursos aparecerão aqui.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Próximos passos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3 rounded-xl border p-3">
                <BookOpen className="mt-1 size-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Acesse a biblioteca</p>
                  <p className="text-xs text-muted-foreground">
                    Consulte materiais recomendados e recursos extras.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl border p-3">
                <Users className="mt-1 size-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Participe do grupo</p>
                  <p className="text-xs text-muted-foreground">
                    Conecte-se com colegas para práticas semanais.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl border p-3">
                <ClipboardCheck className="mt-1 size-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Revise suas tarefas</p>
                  <p className="text-xs text-muted-foreground">
                    Veja o que está pendente nas atividades atuais.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}