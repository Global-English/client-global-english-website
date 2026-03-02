"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"

/**
 * Redireciona para /dashboard se o usuário já estiver autenticado.
 * Retorna `isChecking: true` enquanto o estado de auth ainda está sendo resolvido,
 * permitindo que a página evite renderizar seu conteúdo antes do redirect.
 */
export function useRedirectIfAuthenticated() {
    const { user, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!loading && user) {
            router.replace("/dashboard")
        }
    }, [user, loading, router])

    return { isChecking: loading || Boolean(user) }
}
