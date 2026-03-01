import { Quote } from "lucide-react"
import { AuthLayout } from "@/components/layouts/auth-layout"
import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <AuthLayout
      imageSrc="https://res.cloudinary.com/dflvo098t/image/upload/v1772349852/toronto-canada_glefp0.jpg"
      imageAlt="Toronto, Canada"
      badgeText="Área Exclusiva"
      title={
        <>
          Sua jornada para a <span className="text-primary">fluência</span> continua aqui.
        </>
      }
      description="Acompanhe seu progresso, acesse materiais exclusivos e conecte-se com sua turma em um ambiente focado no seu aprendizado."
      bottomContent={
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
      }
    >
      <LoginForm />
    </AuthLayout>
  )
}
