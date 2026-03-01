import Link from "next/link"
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  Layers,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Users
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarGroup, AvatarImage } from "@/components/ui/avatar"
import { Logo } from "@/components/ui/logo"

export default function Home() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      {/* Abstract Background Elements */}
      <div className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
        <div className="relative left-[calc(50%-11rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-[#ff80b5] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)" }} />
      </div>

      <div className="mx-auto flex w-full max-w-6xl flex-col px-6 py-6 md:py-10 flex-1">
        {/* Header */}
        <header className="flex items-center justify-between z-10 relative">
          <div className="flex items-center gap-3 text-sm font-bold tracking-tight">
            <Logo className="size-10 text-primary" />
            <span className="text-xl">Global English</span>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium">
            <Link
              className="hidden md:inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              href="/login"
            >
              Já sou aluno
            </Link>
            <Link
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-primary-foreground shadow-md hover:bg-primary/90 transition-all hover:scale-105 active:scale-95"
              href="/login"
            >
              Acessar Painel <ArrowRight className="size-4" />
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex flex-1 flex-col justify-center gap-24 py-16 md:py-24 z-10 relative">

          {/* Hero Section */}
          <section className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm text-primary backdrop-blur-sm">
                <Sparkles className="size-4" />
                <span className="font-medium tracking-wide">Plataforma Exclusiva para Alunos</span>
              </div>

              <h1 className="text-5xl font-extrabold tracking-tight text-foreground lg:text-7xl text-balance leading-[1.1]">
                Seu inglês num só <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">lugar.</span>
              </h1>

              <p className="text-lg text-muted-foreground max-w-xl text-balance leading-relaxed">
                Acesse todos os seus materiais, acompanhe seu progresso e encontre os links das aulas de maneira rápida, organizada e sem distrações.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  className="inline-flex h-14 items-center gap-2 rounded-full bg-primary px-8 text-base font-semibold text-primary-foreground shadow-xl shadow-primary/25 transition-all hover:bg-primary/90 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/30 active:translate-y-0"
                  href="/login"
                >
                  Entrar na Plataforma <ArrowRight className="size-5" />
                </Link>
              </div>

              {/* Social Proof Pattern (Bandwagon Effect) */}
              <div className="flex items-center gap-4 pt-6 border-t border-border/50">
                <AvatarGroup>
                  <Avatar className="ring-background border-2 border-background">
                    <AvatarImage src="https://i.pravatar.cc/100?img=8" />
                    <AvatarFallback>A1</AvatarFallback>
                  </Avatar>
                  <Avatar className="ring-background border-2 border-background">
                    <AvatarImage src="https://i.pravatar.cc/100?img=5" />
                    <AvatarFallback>A2</AvatarFallback>
                  </Avatar>
                  <Avatar className="ring-background border-2 border-background">
                    <AvatarImage src="https://i.pravatar.cc/100?img=9" />
                    <AvatarFallback>A3</AvatarFallback>
                  </Avatar>
                  <Avatar className="ring-background border-2 border-background">
                    <AvatarImage src="https://i.pravatar.cc/100?img=4" />
                    <AvatarFallback>A4</AvatarFallback>
                  </Avatar>
                </AvatarGroup>
                <div className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">Junte-se aos alunos</span> que já estão evoluindo.
                </div>
              </div>
            </div>

            {/* Visual Glassmorphic Dashboard Mockup */}
            <div className="relative mx-auto w-full max-w-[500px] lg:max-w-none perspective-[1000px]">
              <div className="absolute -inset-1 rounded-[2rem] bg-linear-to-tr from-primary/30 to-accent/30 blur-2xl opacity-60"></div>
              <div className="relative rounded-[2rem] border bg-background/60 backdrop-blur-xl p-8 shadow-2xl ring-1 ring-border/50 transition-transform duration-500 hover:rotate-y-[-5deg] hover:rotate-x-[5deg]">
                <div className="space-y-6">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-foreground font-medium">
                      <div className="size-2 rounded-full bg-green-500 animate-pulse"></div>
                      Visão Semanal
                    </div>
                    <span className="text-muted-foreground text-xs bg-muted px-2 py-1 rounded-md">Hoje</span>
                  </div>

                  <div className="space-y-4">
                    {[
                      { title: "Conversação avançada", progress: "85%", days: "Hoje", icon: Users },
                      { title: "Business writing", progress: "40%", days: "Em 2 dias", icon: BookOpen },
                      { title: "Listening lab", progress: "100%", days: "Concluído", icon: CheckCircle2, done: true }
                    ].map((item, i) => (
                      <div
                        key={i}
                        className={`group flex items-center gap-4 rounded-2xl border bg-card/50 p-4 transition-all hover:bg-card hover:shadow-md hover:-translate-y-0.5 ${item.done ? 'border-green-500/20 bg-green-500/5' : ''}`}
                      >
                        <div className={`flex size-10 shrink-0 items-center justify-center rounded-full ${item.done ? 'bg-green-500 text-white' : 'bg-primary/10 text-primary'}`}>
                          <item.icon className="size-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate">
                            {item.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.days}
                          </p>
                        </div>
                        <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${item.done ? 'bg-green-500/20 text-green-700 dark:text-green-400' : 'bg-muted text-foreground'}`}>
                          {item.progress}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary to-accent w-[75%] rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section (Cognitive Ease Pattern) */}
          <section className="space-y-12">
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
                Tudo desenhado para a sua <span className="text-primary">fluência.</span>
              </h2>
              <p className="text-muted-foreground text-lg text-balance">
                Eliminamos a complexidade. Focamos no que importa: seu aprendizado.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="group rounded-3xl border bg-card/40 p-8 transition-all hover:-translate-y-2 hover:bg-card hover:shadow-xl hover:shadow-primary/5">
                <div className="mb-6 inline-flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                  <GraduationCap className="size-6" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Cursos Conectados</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Trilhas completas com níveis e objetivos desenhados sob medida para o seu perfil.
                </p>
              </div>

              <div className="group rounded-3xl border bg-card/40 p-8 transition-all hover:-translate-y-2 hover:bg-card hover:shadow-xl hover:shadow-primary/5">
                <div className="mb-6 inline-flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                  <Layers className="size-6" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Passo a Passo</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Saiba exatamente o que fazer a seguir com trilhas claras, prioridades e prazos bem definidos.
                </p>
              </div>

              <div className="group rounded-3xl border bg-card/40 p-8 transition-all hover:-translate-y-2 hover:bg-card hover:shadow-xl hover:shadow-primary/5">
                <div className="mb-6 inline-flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                  <BookOpen className="size-6" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Biblioteca Viva</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Acesso instantâneo aos seus materiais em PDF, vídeos, áudios e links complementares.
                </p>
              </div>

              <div className="group rounded-3xl border bg-card/40 p-8 transition-all hover:-translate-y-2 hover:bg-card hover:shadow-xl hover:shadow-primary/5">
                <div className="mb-6 inline-flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                  <ShieldCheck className="size-6" />
                </div>
                <h3 className="text-lg font-bold text-foreground">100% Seguro</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Uma conta única, segura e exclusiva com todo o histórico do seu desempenho salvo na nuvem.
                </p>
              </div>
            </div>
          </section>

          {/* Bottom CTA Section */}
          <section className="relative overflow-hidden rounded-[2.5rem] bg-foreground text-background py-16 px-6 md:px-12 text-center shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20 opacity-50"></div>
            <div className="relative z-10 mx-auto max-w-2xl space-y-8">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-background">
                Pronto para retomar os estudos?
              </h2>
              <p className="text-lg text-muted/80">
                Acesse o seu portal do aluno, confira os materiais atualizados desta semana e continue trilhando a sua fluência.
              </p>
              <Link
                className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-primary px-8 text-base font-bold text-primary-foreground transition-all hover:bg-primary/90 hover:scale-105 active:scale-95 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]"
                href="/login"
              >
                Entrar com minha conta <ArrowRight className="size-5" />
              </Link>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="py-8 text-center text-sm text-muted-foreground z-10 relative">
          <p>© {new Date().getFullYear()} Global English Platform. Área Exclusiva para Alunos.</p>
        </footer>
      </div>
    </div>
  )
}
