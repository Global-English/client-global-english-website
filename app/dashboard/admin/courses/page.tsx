"use client"

import * as React from "react"
import { BookOpenCheck, ClipboardList, GraduationCap } from "lucide-react"

import { DashboardHeader } from "@/components/dashboard-header"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const demoCourses = [
  {
    id: "course-1",
    title: "Inglês Corporativo Avançado",
    modules: 6,
    students: 42,
    status: "Ativo",
  },
  {
    id: "course-2",
    title: "Fluência para equipes globais",
    modules: 4,
    students: 58,
    status: "Ativo",
  },
  {
    id: "course-3",
    title: "Business Writing Essentials",
    modules: 3,
    students: 28,
    status: "Em revisão",
  },
]

export default function Page() {
  const { role, isFirebaseReady } = useAuth()

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
          <div className="rounded-2xl border border-dashed bg-muted/40 p-4 text-sm text-muted-foreground">
            Firebase não configurado. Exibindo cursos de demonstração.
          </div>
        ) : null}

        <div className="grid gap-4">
          {demoCourses.map((course) => (
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
                    <p className="text-sm font-semibold">{course.students}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border p-3">
                  <ClipboardList className="size-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Módulos</p>
                    <p className="text-sm font-semibold">{course.modules}</p>
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
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Checklist administrativo</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            {[
              "Validar conteúdo novo",
              "Revisar feedback de alunos",
              "Atualizar material base",
              "Publicar calendário mensal",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center justify-between rounded-2xl border p-3"
              >
                <span className="text-sm">{item}</span>
                <Button size="sm" variant="ghost">
                  Abrir
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}