"use client"

import * as React from "react"
import { BarChart3, GraduationCap, Users2 } from "lucide-react"

import { DashboardHeader } from "@/components/dashboard-header"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchAdminOverview } from "@/lib/firebase/firestore"
import type { AdminOverview } from "@/lib/firebase/types"

export default function Page() {
  const { role, isFirebaseReady } = useAuth()
  const [overview, setOverview] = React.useState<AdminOverview | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!isFirebaseReady || role !== "admin") {
      return
    }

    let isMounted = true

    const loadOverview = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchAdminOverview()
        if (isMounted) {
          setOverview(data)
        }
      } catch {
        if (isMounted) {
          setError("Não foi possível carregar os indicadores.")
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadOverview()

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
        title="Admin"
        description="Visão geral do desempenho e gestão da plataforma."
        action={<Button size="sm">Novo relatório</Button>}
      />

      <div className="flex flex-col gap-6 p-6">
        {!isFirebaseReady ? (
          <div className="rounded-2xl border border-dashed bg-accent/40 p-4 text-sm text-muted-foreground">
            Firebase não configurado. Conecte para visualizar dados reais.
          </div>
        ) : null}

        {error ? (
          <div className="rounded-2xl border border-dashed border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">Usuários ativos</CardTitle>
              <Users2 className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">
                {loading ? "..." : overview?.usersCount ?? "-"}
              </div>
              <p className="text-xs text-muted-foreground">Total cadastrado</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">Cursos ativos</CardTitle>
              <GraduationCap className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">
                {loading ? "..." : overview?.coursesCount ?? "-"}
              </div>
              <p className="text-xs text-muted-foreground">Total publicado</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">Engajamento</CardTitle>
              <BarChart3 className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">-</div>
              <p className="text-xs text-muted-foreground">Sem dados disponíveis</p>
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
          <CardContent>
            <div className="rounded-2xl border border-dashed p-6 text-sm text-muted-foreground">
              Nenhuma ação pendente no momento.
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Indicadores por turma</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-2xl border border-dashed p-6 text-sm text-muted-foreground">
              Indicadores serão exibidos quando houver dados.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
