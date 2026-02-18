"use client"

import * as React from "react"
import { CheckCircle2, Flag, FolderKanban } from "lucide-react"

import { DashboardHeader } from "@/components/dashboard-header"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const demoTracks = [
  {
    id: "track-1",
    title: "Comunicação estratégica",
    course: "Inglês Corporativo Avançado",
    progress: 68,
    status: "Em andamento",
  },
  {
    id: "track-2",
    title: "Writing executivo",
    course: "Inglês Corporativo Avançado",
    progress: 42,
    status: "Em andamento",
  },
  {
    id: "track-3",
    title: "Daily syncs",
    course: "Fluência para equipes globais",
    progress: 90,
    status: "Quase concluída",
  },
]

export default function Page() {
  const { isFirebaseReady } = useAuth()

  return (
    <div>
      <DashboardHeader
        title="Trilhas"
        description="Acompanhe o avanço de cada trilha e as próximas entregas."
        action={<Button size="sm">Nova trilha</Button>}
      />

      <div className="flex flex-col gap-6 p-6">
        {!isFirebaseReady ? (
          <div className="rounded-2xl border border-dashed bg-accent/40 p-4 text-sm text-muted-foreground">
            Firebase não configurado. Exibindo trilhas de demonstração.
          </div>
        ) : null}

        <div className="grid gap-4 lg:grid-cols-3">
          {demoTracks.map((track) => (
            <Card key={track.id}>
              <CardHeader className="space-y-2">
                <CardTitle className="text-base">{track.title}</CardTitle>
                <p className="text-xs text-muted-foreground">{track.course}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span>{track.status}</span>
                  <span className="font-semibold">{track.progress}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full bg-foreground"
                    style={{ width: `${track.progress}%` }}
                  />
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Flag className="size-4" />
                  Próxima entrega em 3 dias
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Resumo de trilhas</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            {[
              { label: "Trilhas ativas", value: 4 },
              { label: "Concluídas", value: 2 },
              { label: "Em revisão", value: 1 },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-3 rounded-2xl border p-4"
              >
                <FolderKanban className="size-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="text-lg font-semibold">{item.value}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Trilhas concluídas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {["Pitch em inglês", "Feedback e performance"].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-2xl border p-3"
              >
                <CheckCircle2 className="size-4 text-muted-foreground" />
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
