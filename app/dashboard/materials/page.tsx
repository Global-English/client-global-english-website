"use client"

import * as React from "react"
import { FileAudio, FileText, Link as LinkIcon, Video } from "lucide-react"

import { DashboardHeader } from "@/components/dashboard-header"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const demoMaterials = [
  {
    id: "material-1",
    title: "Guia de apresentações em inglês",
    type: "PDF",
    icon: FileText,
  },
  {
    id: "material-2",
    title: "Vídeo: pronúncia avançada",
    type: "Vídeo",
    icon: Video,
  },
  {
    id: "material-3",
    title: "Podcast: weekly sync",
    type: "Áudio",
    icon: FileAudio,
  },
  {
    id: "material-4",
    title: "Link: glossário corporativo",
    type: "Link",
    icon: LinkIcon,
  },
]

export default function Page() {
  const { isFirebaseReady } = useAuth()

  return (
    <div>
      <DashboardHeader
        title="Materiais"
        description="Centralize PDFs, vídeos e links de apoio por trilha."
        action={<Button size="sm">Novo material</Button>}
      />

      <div className="flex flex-col gap-6 p-6">
        {!isFirebaseReady ? (
          <div className="rounded-2xl border border-dashed bg-accent/40 p-4 text-sm text-muted-foreground">
            Firebase não configurado. Exibindo biblioteca de demonstração.
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {demoMaterials.map((material) => (
            <Card key={material.id}>
              <CardHeader className="space-y-2">
                <material.icon className="size-5 text-muted-foreground" />
                <CardTitle className="text-base">{material.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{material.type}</span>
                  <Button size="sm" variant="outline">
                    Abrir
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Coleções em destaque</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {["Comunicação executiva", "Listening avançado", "Soft skills"].map(
              (item) => (
                <div
                  key={item}
                  className="flex items-center justify-between rounded-2xl border p-4"
                >
                  <span className="text-sm font-medium">{item}</span>
                  <Button size="sm" variant="ghost">
                    Ver coleção
                  </Button>
                </div>
              )
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
