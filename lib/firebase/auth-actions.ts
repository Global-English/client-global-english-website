"use server"

import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase/client"
import { COLLECTIONS } from "@/lib/firebase/collections"
import { resolveUserRole } from "@/lib/firebase/roles"
import { UserRole } from "@/lib/firebase/types"

export async function syncUserProfile(params: {
    uid: string
    name: string
    email: string
    role?: UserRole
}) {
    if (!db) throw new Error("Firestore não configurado.")

    const userRef = doc(db, COLLECTIONS.users, params.uid)
    const snapshot = await getDoc(userRef)

    const existingRole = snapshot.exists()
        ? ((snapshot.data().role ?? "user") as UserRole)
        : null

    // Role resolution happens HERE on the server where process.env.ADMIN_EMAILS is available
    const resolvedRole = resolveUserRole({
        email: params.email,
        existingRole: params.role ?? existingRole,
    })

    await setDoc(
        userRef,
        {
            uid: params.uid,
            name: params.name,
            email: params.email,
            role: resolvedRole,
            updatedAt: serverTimestamp(),
            // We don't overwrite createdAt if it exists
            ...(!snapshot.exists() ? { createdAt: serverTimestamp() } : {}),
            // Set default for password change if new user
            ...(!snapshot.exists() ? { mustChangePassword: false } : {}),
        },
        { merge: true }
    )

    return { role: resolvedRole }
}
