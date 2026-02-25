import type { Track } from "@/lib/firebase/types"

type CreateTrackPayload = {
  courseId: string
  title: string
  description: string
  order?: number
}

type UpdateTrackPayload = {
  id: string
  title: string
  description: string
  order?: number
}

export async function fetchAdminCourseTracks(
  idToken: string | null,
  courseId: string
) {
  const resp = await fetch(`/api/admin/tracks?courseId=${encodeURIComponent(courseId)}`, {
    headers: {
      ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
    },
  })

  if (!resp.ok) {
    throw new Error("failed to load tracks")
  }

  return (await resp.json()) as Track[]
}

export async function createAdminCourseTrack(
  idToken: string | null,
  payload: CreateTrackPayload
) {
  const resp = await fetch("/api/admin/tracks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
    },
    body: JSON.stringify(payload),
  })

  if (!resp.ok) {
    throw new Error("create failed")
  }

  return (await resp.json()) as Track
}

export async function updateAdminCourseTrack(
  idToken: string | null,
  payload: UpdateTrackPayload
) {
  const resp = await fetch("/api/admin/tracks", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
    },
    body: JSON.stringify(payload),
  })

  if (!resp.ok) {
    throw new Error("update failed")
  }
}
