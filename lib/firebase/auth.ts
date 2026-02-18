import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth"
import { auth, hasFirebaseConfig } from "@/lib/firebase/client"
import { ensureUserProfile } from "@/lib/firebase/firestore"

function assertFirebaseReady() {
  if (!hasFirebaseConfig || !auth) {
    throw new Error("Firebase não configurado.")
  }
}

export async function signInWithEmail(params: {
  email: string
  password: string
}) {
  assertFirebaseReady()

  const credential = await signInWithEmailAndPassword(
    auth,
    params.email,
    params.password
  )

  await ensureUserProfile({
    uid: credential.user.uid,
    name: credential.user.displayName ?? "",
    email: credential.user.email ?? params.email,
  })

  return credential.user
}

export async function signUpWithEmail(params: {
  name: string
  email: string
  password: string
}) {
  assertFirebaseReady()

  const credential = await createUserWithEmailAndPassword(
    auth,
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
  })

  return credential.user
}

export async function signOutUser() {
  if (!hasFirebaseConfig || !auth) {
    return
  }

  await signOut(auth)
}