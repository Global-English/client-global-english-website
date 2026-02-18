"use client"

import * as React from "react"
import { ClipboardCheck, Clock, FileText } from "lucide-react"

import { DashboardHeader } from "@/components/dashboard-header"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const demoActivities = [
  {
    id: "activity-1",
    title: "Apresentação de resultados",
    track: "Comunicação estratégica",
    status: "Em andamento",
    due: "Em 2 dias",
  },
  {
    id: "activity-2",
    title: "Revisão de e-mails críticos",
    track: "Writing executivo",
    status: "Pendente",
    due: "Amanhã",
  },
  {
    id: "activity-3",
    title: "Simulação de reunião",
    track: "Daily syncs",
    status: "Concluída",
    due: "Finalizada",
  },
]

export default function Page() {
  const { isFirebaseReady } = useAuth()

  return (
    <div>
      <DashboardHeader
        title="Atividades"
        description="Organize pendências, entregas e feedbacks das aulas."
        action={<Button size="sm">Nova atividade</Button>}
      />

      <div className="flex flex-col gap-6 p-6">
        {!isFirebaseReady ? (
          <div className="rounded-2xl border border-dashed bg-muted/40 p-4 text-sm text-muted-foreground">
            Firebase não configurado. Exibindo atividades de demonstração.
          </div>
        ) : null}

        <div className="grid gap-4 lg:grid-cols-2">
          {demoActivities.map((activity) => (
            <Card key={activity.id}>
              <CardHeader className="space-y-2">
                <CardTitle className="text-base">{activity.title}</CardTitle>
                <p className="text-xs text-muted-foreground">{activity.track}</p>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="flex items-center justify-between text-sm">
                  <span>{activity.status}</span>
                  <span className="rounded-full bg-muted px-3 py-1 text-xs">
                    {activity.due}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <Clock className="size-4" />
                  Estimativa: 30 minutos
                </div>
                <div className="flex items-center gap-3">
                  <Button size="sm">Abrir</Button>
                  <Button size="sm" variant="outline">
                    Marcar como concluída
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Checklist rápido</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-3">
            {[
              "Revisar feedback",
              "Atualizar relatório semanal",
              "Agendar prática em dupla",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-2xl border p-3"
              >
                <ClipboardCheck className="size-4 text-muted-foreground" />
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Relatórios entregues</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {["Resumo de performance", "Checklist de reunião"].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-2xl border p-3"
              >
                <FileText className="size-4 text-muted-foreground" />
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}