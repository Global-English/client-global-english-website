import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import admin, { adminAuth, adminDb } from "@/lib/firebase/admin"
import { COLLECTIONS } from "@/lib/firebase/collections"
import type { Track } from "@/lib/firebase/types"

type CreateTrackBody = {
  id?: string
  courseId?: string
  title?: string
  description?: string
  order?: number
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

async function resolveNextOrder(courseId: string) {
  const snapshot = await adminDb
    .collection(COLLECTIONS.tracks)
    .where("courseId", "==", courseId)
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
      .collection(COLLECTIONS.tracks)
      .where("courseId", "==", courseId)
      .get()

    const tracks: Track[] = snapshot.docs.map((docSnap) => {
      const data = docSnap.data()
      return {
        id: docSnap.id,
        courseId: data.courseId,
        title: (data.title as string) ?? "",
        description: (data.description as string) ?? "",
        order: Number(data.order ?? 0),
      }
    })

    tracks.sort((a, b) => a.order - b.order)

    return NextResponse.json(tracks)
  } catch (err) {
    console.error("list tracks failed", err)
    return NextResponse.json({ error: "Could not list tracks" }, { status: 500 })
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

  let body: CreateTrackBody

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const courseId = body.courseId?.trim()
  const title = body.title?.trim() ?? ""
  const description = body.description?.trim() ?? ""

  if (!courseId || !title || !description) {
    return NextResponse.json(
      { error: "courseId, title and description are required" },
      { status: 400 }
    )
  }

  let order = parseOrder(body.order)
  if (order === null) {
    order = await resolveNextOrder(courseId)
  }

  const now = admin.firestore.FieldValue.serverTimestamp()

  try {
    const ref = adminDb.collection(COLLECTIONS.tracks).doc()

    await ref.set({
      courseId,
      title,
      description,
      order,
      createdAt: now,
      updatedAt: now,
      createdBy: authCheck.uid,
    })

    const result: Track = {
      id: ref.id,
      courseId,
      title,
      description,
      order,
    }

    return NextResponse.json(result, { status: 201 })
  } catch (err) {
    console.error("create track failed", err)
    return NextResponse.json({ error: "Could not create track" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  const authCheck = await assertIsAdmin(req)
  if (!authCheck.ok) {
    return NextResponse.json(
      { error: authCheck.message },
      { status: authCheck.status }
    )
  }

  let body: CreateTrackBody

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const id = body.id?.trim()
  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 })
  }

  const updates: Record<string, unknown> = {
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  }

  if (body.title !== undefined) {
    const title = body.title.trim()
    if (!title) {
      return NextResponse.json({ error: "title cannot be empty" }, { status: 400 })
    }
    updates.title = title
  }

  if (body.description !== undefined) {
    const description = body.description.trim()
    if (!description) {
      return NextResponse.json(
        { error: "description cannot be empty" },
        { status: 400 }
      )
    }
    updates.description = description
  }

  if (body.order !== undefined) {
    const order = parseOrder(body.order)
    if (order === null) {
      return NextResponse.json(
        { error: "order must be a positive number" },
        { status: 400 }
      )
    }
    updates.order = order
  }

  try {
    await adminDb.collection(COLLECTIONS.tracks).doc(id).set(updates, {
      merge: true,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("update track failed", err)
    return NextResponse.json({ error: "Could not update track" }, { status: 500 })
  }
}
