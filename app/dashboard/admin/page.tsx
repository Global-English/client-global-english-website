"use client"

import * as React from "react"
import { BarChart3, GraduationCap, Users2 } from "lucide-react"

import { DashboardHeader } from "@/components/dashboard-header"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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
        title="Admin"
        description="Visão geral do desempenho e gestão da plataforma."
        action={<Button size="sm">Novo relatório</Button>}
      />

      <div className="flex flex-col gap-6 p-6">
        {!isFirebaseReady ? (
          <div className="rounded-2xl border border-dashed bg-accent/40 p-4 text-sm text-muted-foreground">
            Firebase não configurado. Exibindo dados de demonstração.
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">Usuários ativos</CardTitle>
              <Users2 className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">128</div>
              <p className="text-xs text-muted-foreground">+12 esta semana</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">Cursos ativos</CardTitle>
              <GraduationCap className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">14</div>
              <p className="text-xs text-muted-foreground">3 lançamentos</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">Engajamento</CardTitle>
              <BarChart3 className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">82%</div>
              <p className="text-xs text-muted-foreground">média semanal</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex items-center justify-between gap-4 sm:flex-row">
            <div>
              <CardTitle className="text-base">Ações prioritárias</CardTitle>
              <p className="text-sm text-muted-foreground">
                Itens que precisam de atenção administrativa.
              </p>
            </div>
            <Button variant="outline">Ver todas</Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              "Revisar curso: Business Writing",
              "Validar trilha: Fluência Global",
              "Atualizar permissões de 3 usuários",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center justify-between rounded-2xl border p-3 text-sm"
              >
                <span>{item}</span>
                <Button size="sm" variant="ghost">
                  Abrir
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Indicadores por turma</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {[
              { label: "Turma Executiva", value: "90%" },
              { label: "Times Globais", value: "76%" },
              { label: "Novos colaboradores", value: "81%" },
              { label: "Pré-embarque", value: "68%" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between rounded-2xl border p-4"
              >
                <span className="text-sm">{item.label}</span>
                <span className="text-sm font-semibold">{item.value}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
