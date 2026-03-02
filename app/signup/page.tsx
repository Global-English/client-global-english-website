"use client"

import Link from "next/link"
import { Sparkles } from "lucide-react"
import { AuthLayout } from "@/components/layouts/auth-layout"
import { SignupForm } from "@/components/signup-form"
import { useRedirectIfAuthenticated } from "@/hooks/use-redirect-if-authenticated"

const isSignupDisabled = process.env.NEXT_PUBLIC_SIGNUP_ENABLED === "false"

export default function SignupPage() {
  const { isChecking } = useRedirectIfAuthenticated()

  if (isChecking) return null

  return (
    <AuthLayout
      reverseLayout
      primaryColorTheme
      imageSrc="https://res.cloudinary.com/dflvo098t/image/upload/v1772349852/ghent-belgica_nkpima.jpg"
      imageAlt="Ghent, Bélgica"
      badgeText={
        <>
          <Sparkles className="size-4" />
          Convite Especial
        </>
      }
      title="Junte-se ao nosso ecossistema de aprendizado."
      description="Sua conta dá acesso a um portal dedicado, onde as trilhas são customizadas e os objetivos são desenhados para a sua evolução no idioma."
      bottomContent={
        <div className="relative z-10 mt-auto pt-24 text-right">
          <p className="text-sm font-medium text-white/80 mb-2">Já faz parte da plataforma?</p>
          <Link
            href="/login"
            className="inline-flex h-12 items-center justify-center rounded-full bg-white/10 px-6 font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:scale-105 active:scale-95 border border-white/20"
          >
            Acessar Minha Conta
          </Link>
        </div>
      }
    >
      <SignupForm isDisabled={isSignupDisabled} />
    </AuthLayout>
  )
}
