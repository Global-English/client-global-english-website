import Link from "next/link"
import { Sparkles } from "lucide-react"
import { Logo } from "@/components/ui/logo"

import { SignupForm } from "@/components/signup-form"

const isSignupDisabled = process.env.NEXT_PUBLIC_SIGNUP_ENABLED === "false"

export default function SignupPage() {
  return (
    <div className="min-h-svh bg-background flex flex-col lg:flex-row-reverse">
      {/* Informational Pane - Exclusivity & Future Pacing */}
      <div className="relative hidden lg:flex flex-col justify-between w-[45%] bg-primary p-12 text-primary-foreground overflow-hidden">
        {/* Abstract Background for Premium Feel */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent mix-blend-overlay"></div>
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-white/10 blur-[100px] translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-black/10 blur-[120px] -translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="relative z-10 flex justify-end">
          <div className="flex text-white items-center gap-3 text-sm font-semibold tracking-tight">
            <span className="text-xl">Global English</span>
            <Logo className="size-10" />
          </div>
        </div>

        <div className="relative z-10 space-y-8 max-w-lg mt-24">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm border border-white/20">
            <Sparkles className="size-4" />
            Convite Especial
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white leading-[1.15]">
            Junte-se ao nosso ecossistema de aprendizado.
          </h1>
          <p className="text-white/80 text-lg leading-relaxed">
            Sua conta dá acesso a um portal dedicado, onde as trilhas são customizadas e os objetivos são desenhados para a sua evolução no idioma.
          </p>
        </div>

        {/* Action Pattern */}
        <div className="relative z-10 mt-auto pt-24 text-right">
          <p className="text-sm font-medium text-white/80 mb-2">Já faz parte da plataforma?</p>
          <Link
            href="/login"
            className="inline-flex h-12 items-center justify-center rounded-full bg-white/10 px-6 font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:scale-105 active:scale-95 border border-white/20"
          >
            Acessar Minha Conta
          </Link>
        </div>
      </div>

      {/* Form Pane - Cognitive Ease */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative overflow-hidden bg-background">
        <div className="w-full max-w-[420px] space-y-8 relative z-10">
          <div className="flex items-center justify-center gap-3 text-sm font-bold tracking-tight">
            <Logo className="size-10 text-primary" />
            <span className="text-xl">Global English</span>
          </div>
          <SignupForm isDisabled={isSignupDisabled} />
        </div>
      </div>
    </div>
  )
}
