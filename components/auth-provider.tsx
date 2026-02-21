"use client"

import * as React from "react"
import { onAuthStateChanged, type User } from "firebase/auth"
import { auth, hasFirebaseConfig } from "@/lib/firebase/client"
import { fetchUserProfile } from "@/lib/firebase/firestore"
import type { UserProfile, UserRole } from "@/lib/firebase/types"

type AuthContextValue = {
  user: User | null
  role: UserRole | null
  profile: UserProfile | null
  loading: boolean
  isFirebaseReady: boolean
}

const AuthContext = React.createContext<AuthContextValue>({
  user: null,
  role: null,
  profile: null,
  loading: true,
  isFirebaseReady: false,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null)
  const [role, setRole] = React.useState<UserRole | null>(null)
  const [profile, setProfile] = React.useState<UserProfile | null>(null)
  const [loading, setLoading] = React.useState(true)
  const isFirebaseReady = hasFirebaseConfig && Boolean(auth)

  React.useEffect(() => {
    if (!isFirebaseReady || !auth) {
      setUser(null)
      setRole("admin")
      setProfile(null)
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)

      if (!firebaseUser) {
        setRole(null)
        setProfile(null)
        setLoading(false)
        return
      }

      const profile = await fetchUserProfile(firebaseUser.uid)
      setRole(profile?.role ?? "user")
      setProfile(profile)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [isFirebaseReady])

  return (
    <AuthContext.Provider
      value={{ user, role, profile, loading, isFirebaseReady }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  return React.useContext(AuthContext)
}
