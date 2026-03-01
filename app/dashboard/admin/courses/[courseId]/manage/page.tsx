"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowLeft, Layers3, FileText, ClipboardList, BookOpen } from "lucide-react"

import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { CourseManagementProvider } from "@/modules/courses/ui/manage/CourseManagementContext"
import { TrackManagement } from "@/modules/courses/ui/manage/TrackManagement"
import { MaterialManagement } from "@/modules/courses/ui/manage/MaterialManagement"
import { ActivityManagement } from "@/modules/courses/ui/manage/ActivityManagement"
import { CourseOverview } from "@/modules/courses/ui/manage/CourseOverview"

type SectionId = "overview" | "modules" | "materials" | "activities"

export default function Page() {
  const { role, isFirebaseReady } = useAuth()
  const [activeSection, setActiveSection] = React.useState<SectionId>("overview")

  if (!isFirebaseReady) return null
  if (role !== "admin") {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Acesso negado</h1>
        <p className="text-muted-foreground">Você não tem permissão para acessar esta página.</p>
        <Link href="/dashboard">
          <Button>Voltar ao Dashboard</Button>
        </Link>
      </div>
    )
  }

  const sections = [
    { id: "overview", label: "Geral", icon: BookOpen },
    { id: "modules", label: "Módulos", icon: Layers3 },
    { id: "materials", label: "Materiais", icon: FileText },
    { id: "activities", label: "Atividades", icon: ClipboardList },
  ] as const

  return (
    <CourseManagementProvider>
      <div className="flex flex-col gap-8 pb-12">
        <div className="flex flex-col gap-4">
          <Link href="/dashboard/admin/courses" className="flex w-fit items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary">
            <ArrowLeft className="size-3" />
            Voltar para cursos
          </Link>
          <DashboardHeader
            title="Gestão do Curso"
            description="Estruture o conteúdo, defina trilhas e acompanhe o engajamento."
          />
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-primary/5 border border-primary/10 w-fit backdrop-blur-md">
          {sections.map((section) => {
            const Icon = section.icon
            const isActive = activeSection === section.id
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold tracking-tight transition-all ${isActive
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "text-muted-foreground hover:bg-primary/5 hover:text-foreground"
                  }`}
              >
                <Icon className="size-3.5" />
                {section.label}
              </button>
            )
          })}
        </div>

        {/* Main Content Areas */}
        <div className="transition-all duration-300 animate-in fade-in slide-in-from-bottom-2">
          {activeSection === "overview" && <CourseOverview />}
          {activeSection === "modules" && <TrackManagement />}
          {activeSection === "materials" && <MaterialManagement />}
          {activeSection === "activities" && <ActivityManagement />}
        </div>
      </div>
    </CourseManagementProvider>
  )
}
