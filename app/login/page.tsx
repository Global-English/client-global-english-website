import Link from "next/link"
import { Globe2 } from "lucide-react"

import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="min-h-svh bg-background">
      <div className="mx-auto grid min-h-svh max-w-6xl grid-cols-1 gap-10 px-6 py-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <div className="flex flex-col justify-between rounded-3xl border bg-muted/40 p-8 lg:p-10">
          <div className="flex items-center gap-3 text-sm font-medium">
            <span className="flex size-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <Globe2 className="size-5" />
            </span>
            Global English
          </div>
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Plataforma de aprendizagem
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground lg:text-4xl">
              Tenha controle total das suas trilhas e materiais de inglês.
            </h1>
            <p className="text-base text-muted-foreground">
              Acompanhe cursos, atividades e entregas com uma visão clara do seu
              progresso. Uma experiência feita para estudantes e equipes
              corporativas.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span>Precisa de uma conta?</span>
            <Link className="text-foreground underline-offset-4 hover:underline" href="/signup">
              Criar conta
            </Link>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <div className="w-full max-w-md">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  )
}

