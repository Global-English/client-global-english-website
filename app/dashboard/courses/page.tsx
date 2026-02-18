"use client"

import * as React from "react"
import { BookOpen, CalendarClock, GraduationCap, Users } from "lucide-react"

import { DashboardHeader } from "@/components/dashboard-header"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const demoCourses = [
  {
    id: "course-1",
    title: "Inglês Corporativo Avançado",
    description: "Reuniões, apresentações e reportes críticos.",
    level: "Advanced",
    duration: "8 semanas",
    cohort: "Turma executiva",
  },
  {
    id: "course-2",
    title: "Fluência para equipes globais",
    description: "Conversação e listening para contextos multiculturais.",
    level: "Intermediate",
    duration: "6 semanas",
    cohort: "Times distribuídos",
  },
  {
    id: "course-3",
    title: "Business Writing Essentials",
    description: "Emails, reports e comunicação clara.",
    level: "Beginner",
    duration: "4 semanas",
    cohort: "Novos colaboradores",
  },
]

export default function Page() {
  const { isFirebaseReady } = useAuth()

  return (
    <div>
      <DashboardHeader
        title="Cursos"
        description="Gerencie seus cursos ativos e descubra novas trilhas."
        action={<Button size="sm">Novo curso</Button>}
      />

      <div className="flex flex-col gap-6 p-6">
        {!isFirebaseReady ? (
          <div className="rounded-2xl border border-dashed bg-muted/40 p-4 text-sm text-muted-foreground">
            Firebase não configurado. Exibindo catálogo de demonstração.
          </div>
        ) : null}

        <div className="grid gap-4 lg:grid-cols-3">
          {demoCourses.map((course) => (
            <Card key={course.id} className="flex flex-col">
              <CardHeader className="space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{course.level}</span>
                  <span>{course.duration}</span>
                </div>
                <CardTitle className="text-lg">{course.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col gap-4">
                <p className="text-sm text-muted-foreground">
                  {course.description}
                </p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <Users className="size-4" />
                  {course.cohort}
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <CalendarClock className="size-4" />
                  Próxima revisão em 2 dias
                </div>
                <div className="mt-auto flex items-center gap-3">
                  <Button size="sm">Abrir</Button>
                  <Button size="sm" variant="outline">
                    Ver detalhes
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader className="flex items-center justify-between gap-4 sm:flex-row">
            <div>
              <CardTitle className="text-base">Catálogo aberto</CardTitle>
              <p className="text-sm text-muted-foreground">
                Explore cursos extras recomendados para sua equipe.
              </p>
            </div>
            <Button variant="outline">Explorar catálogo</Button>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            {["Pronúncia e clareza", "Inglês para vendas", "Soft skills globais"].map(
              (item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-2xl border bg-muted/30 p-4"
                >
                  <GraduationCap className="size-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{item}</p>
                    <p className="text-xs text-muted-foreground">
                      Disponível sob demanda
                    </p>
                  </div>
                </div>
              )
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Materiais recomendados</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            {["Guia de apresentações", "Checklist de reuniões", "Roteiro de feedback"].map(
              (item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-2xl border p-3"
                >
                  <BookOpen className="size-4 text-muted-foreground" />
                  <span className="text-sm">{item}</span>
                </div>
              )
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}