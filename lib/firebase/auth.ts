import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth"
import { auth, hasFirebaseConfig } from "@/lib/firebase/client"
import { ensureUserProfile } from "@/lib/firebase/firestore"
import { resolveUserRole } from "@/lib/firebase/roles"

function getAuthOrThrow() {
  if (!hasFirebaseConfig || !auth) {
    throw new Error("Firebase não configurado.")
  }

  return auth
}

export async function signInWithEmail(params: {
  email: string
  password: string
}) {
  const firebaseAuth = getAuthOrThrow()

  const credential = await signInWithEmailAndPassword(
    firebaseAuth,
    params.email,
    params.password
  )

  await ensureUserProfile({
    uid: credential.user.uid,
    name: credential.user.displayName ?? "",
    email: credential.user.email ?? params.email,
    role: resolveUserRole({
      email: credential.user.email ?? params.email,
    }),
  })

  return credential.user
}

export async function signUpWithEmail(params: {
  name: string
  email: string
  password: string
}) {
  const firebaseAuth = getAuthOrThrow()

  const credential = await createUserWithEmailAndPassword(
    firebaseAuth,
    params.email,
    params.password
  )

  await updateProfile(credential.user, {
    displayName: params.name,
  })

  await ensureUserProfile({
    uid: credential.user.uid,
    name: params.name,
    email: params.email,
    role: resolveUserRole({ email: params.email }),
  })

  return credential.user
}

export async function signOutUser() {
  if (!hasFirebaseConfig || !auth) {
    return
  }

  await signOut(auth)
}
