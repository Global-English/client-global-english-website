import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import admin, { adminAuth, adminDb } from "@/lib/firebase/admin"
import { COLLECTIONS } from "@/lib/firebase/collections"
import type { Activity } from "@/lib/firebase/types"

type CreateActivityBody = {
  courseId?: string
  trackId?: string
  title?: string
  type?: "lesson" | "quiz" | "assignment" | "project"
  order?: number
  estimatedMinutes?: number
  visibility?: "module" | "users" | "private"
  userIds?: string[]
  releaseAt?: string | null
}

async function assertIsAdmin(req: NextRequest) {
  const authHeader = req.headers.get("authorization")
  const token = authHeader?.split(" ")[1]
  if (!token) {
    return { ok: false, status: 401, message: "Missing auth token" }
  }

  try {
    const decoded = await adminAuth.verifyIdToken(token)
    const doc = await adminDb.collection(COLLECTIONS.users).doc(decoded.uid).get()
    const data = doc.data()

    if (data?.role === "admin") {
      return { ok: true, uid: decoded.uid }
    }

    return { ok: false, status: 403, message: "Admin access required" }
  } catch (err) {
    console.error("token verification failed", err)
    return { ok: false, status: 401, message: "Invalid auth token" }
  }
}

function normalizeUserIds(input?: unknown) {
  if (!Array.isArray(input)) {
    return []
  }

  const cleaned = input
    .map((value) => (typeof value === "string" ? value.trim() : ""))
    .filter(Boolean)

  return Array.from(new Set(cleaned))
}

function resolveReleaseAt(input?: string | null) {
  if (!input) {
    return null
  }
  const parsed = new Date(input)
  if (Number.isNaN(parsed.getTime())) {
    return null
  }
  return admin.firestore.Timestamp.fromDate(parsed)
}

function parseOrder(input?: number) {
  if (input === undefined || input === null) {
    return null
  }

  const value = Number(input)
  if (!Number.isFinite(value) || value <= 0) {
    return null
  }

  return Math.floor(value)
}

async function resolveNextOrder(trackId: string) {
  const snapshot = await adminDb
    .collection(COLLECTIONS.activities)
    .where("trackId", "==", trackId)
    .get()

  if (snapshot.empty) {
    return 1
  }

  let maxOrder = 0
  snapshot.docs.forEach((docSnap) => {
    const value = Number(docSnap.data()?.order ?? 0)
    if (Number.isFinite(value) && value > maxOrder) {
      maxOrder = value
    }
  })

  return maxOrder + 1
}

export async function GET(req: NextRequest) {
  const authCheck = await assertIsAdmin(req)
  if (!authCheck.ok) {
    return NextResponse.json(
      { error: authCheck.message },
      { status: authCheck.status }
    )
  }

  const { searchParams } = new URL(req.url)
  const courseId = searchParams.get("courseId")?.trim()

  if (!courseId) {
    return NextResponse.json({ error: "courseId is required" }, { status: 400 })
  }

  try {
    const snapshot = await adminDb
      .collection(COLLECTIONS.activities)
      .where("courseId", "==", courseId)
      .get()

    const activities: Activity[] = snapshot.docs.map((docSnap) => {
      const data = docSnap.data()
      return {
        id: docSnap.id,
        courseId: data.courseId,
        trackId: data.trackId,
        title: data.title ?? "",
        type: data.type ?? "lesson",
        order: Number(data.order ?? 0),
        estimatedMinutes: Number(data.estimatedMinutes ?? 0),
        visibility: data.visibility ?? "private",
        userIds: Array.isArray(data.userIds) ? data.userIds : [],
        releaseAt: data.releaseAt?.toDate?.() ?? null,
      }
    })

    activities.sort((a, b) => a.order - b.order)

    return NextResponse.json(activities)
  } catch (err) {
    console.error("list activities failed", err)
    return NextResponse.json(
      { error: "Could not list activities" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  const authCheck = await assertIsAdmin(req)
  if (!authCheck.ok) {
    return NextResponse.json(
      { error: authCheck.message },
      { status: authCheck.status }
    )
  }

  let body: CreateActivityBody

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const courseId = body.courseId?.trim()
  const trackId = body.trackId?.trim()
  const title = body.title?.trim() ?? ""
  const type = body.type
  const estimatedMinutes = Number(body.estimatedMinutes ?? 0)
  const visibility = body.visibility ?? "private"

  if (!courseId || !trackId || !title || !type || estimatedMinutes <= 0) {
    return NextResponse.json(
      { error: "courseId, trackId, title, type and estimatedMinutes are required" },
      { status: 400 }
    )
  }

  const userIds = normalizeUserIds(body.userIds)
  if (visibility === "users" && userIds.length === 0) {
    return NextResponse.json(
      { error: "userIds are required for users visibility" },
      { status: 400 }
    )
  }

  let order = parseOrder(body.order)
  if (order === null) {
    order = await resolveNextOrder(trackId)
  }

  const releaseAt = visibility === "private" ? null : resolveReleaseAt(body.releaseAt)
  const now = admin.firestore.FieldValue.serverTimestamp()

  try {
    const ref = adminDb.collection(COLLECTIONS.activities).doc()

    await ref.set({
      courseId,
      trackId,
      title,
      type,
      order,
      estimatedMinutes,
      visibility,
      userIds: visibility === "users" ? userIds : [],
      releaseAt,
      createdAt: now,
      updatedAt: now,
      createdBy: authCheck.uid,
    })

    const result: Activity = {
      id: ref.id,
      courseId,
      trackId,
      title,
      type,
      order,
      estimatedMinutes,
      visibility,
      userIds: visibility === "users" ? userIds : [],
      releaseAt: releaseAt ? releaseAt.toDate() : null,
    }

    return NextResponse.json(result, { status: 201 })
  } catch (err) {
    console.error("create activity failed", err)
    return NextResponse.json(
      { error: "Could not create activity" },
      { status: 500 }
    )
  }
}
