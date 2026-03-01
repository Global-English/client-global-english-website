import Image from "next/image"
import { Quote } from "lucide-react"
import { Logo } from "@/components/ui/logo"

import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="min-h-svh bg-background flex flex-col lg:flex-row">
      {/* Informational Pane - Exclusivity & Social Proof */}
      <div className="relative hidden lg:flex flex-col justify-between w-[45%] bg-zinc-950 p-12 text-zinc-50 overflow-hidden">
        {/* Abstract Background for Premium Feel */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://res.cloudinary.com/dflvo098t/image/upload/v1772349852/toronto-canada_glefp0.jpg"
            alt="Toronto, Canada"
            fill
            className="object-cover opacity-60 mix-blend-luminosity blur-[5px] scale-105"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-br from-primary/80 to-accent/40 mix-blend-overlay"></div>
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-primary/20 blur-[120px] translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-accent/20 blur-[100px] -translate-x-1/2 translate-y-1/2"></div>
          <div className="absolute inset-0 bg-zinc-950/40"></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 text-sm font-semibold tracking-tight">
            <Logo className="size-10" />
            <span className="text-xl">Global English</span>
          </div>
        </div>

        <div className="relative z-10 space-y-8 max-w-lg mt-24">
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-700/50 bg-zinc-800/50 px-3 py-1 text-xs font-medium text-zinc-300 backdrop-blur-sm">
            Área Exclusiva
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-zinc-50 leading-[1.15]">
            Sua jornada para a <span className="text-primary">fluência</span> continua aqui.
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed">
            Acompanhe seu progresso, acesse materiais exclusivos e conecte-se com sua turma em um ambiente focado no seu aprendizado.
          </p>
        </div>

        {/* Social Proof Pattern */}
        <div className="relative z-10 mt-auto pt-24">
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-md">
            <Quote className="size-8 text-primary/60 mb-4" />
            <p className="text-zinc-300 italic mb-4">
              "A organização da plataforma mudou minha forma de estudar inglês. Tudo que eu preciso está centralizado e as trilhas são extremamente claras."
            </p>
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-zinc-800 overflow-hidden border border-zinc-700">
                <img src="https://i.pravatar.cc/100?img=33" alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="text-sm font-medium text-zinc-100">Marcos Pilgrim</div>
                <div className="text-xs text-zinc-500">Aluno Advanced</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Pane - Cognitive Ease */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative overflow-hidden">
        {/* Subtle background glow for mobile */}
        <div className="absolute inset-0 lg:hidden -z-10 bg-linear-to-b from-primary/5 to-transparent"></div>

        <div className="w-full max-w-[420px] space-y-8 relative z-10">
          <div className="flex items-center justify-center gap-3 text-sm font-bold tracking-tight">
            <Logo className="size-10 text-primary" />
            <span className="text-xl">Global English</span>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
