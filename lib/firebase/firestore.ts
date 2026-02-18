import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore"
import { db, hasFirebaseConfig } from "@/lib/firebase/client"
import { COLLECTIONS } from "@/lib/firebase/collections"
import type {
  Activity,
  Course,
  DashboardCourse,
  Enrollment,
  Track,
  UserProfile,
  UserRole,
} from "@/lib/firebase/types"

function assertFirestoreReady() {
  if (!hasFirebaseConfig || !db) {
    throw new Error("Firestore não configurado.")
  }
}

export async function ensureUserProfile(params: {
  uid: string
  name: string
  email: string
  role?: UserRole
}) {
  assertFirestoreReady()

  const userRef = doc(db, COLLECTIONS.users, params.uid)
  const snapshot = await getDoc(userRef)

  if (!snapshot.exists()) {
    await setDoc(userRef, {
      uid: params.uid,
      name: params.name,
      email: params.email,
      role: params.role ?? "user",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  }
}

export async function fetchUserProfile(uid: string) {
  assertFirestoreReady()

  const userRef = doc(db, COLLECTIONS.users, uid)
  const snapshot = await getDoc(userRef)

  if (!snapshot.exists()) {
    return null
  }

  const data = snapshot.data()

  return {
    uid: data.uid,
    name: data.name ?? "",
    email: data.email ?? "",
    role: (data.role ?? "user") as UserRole,
    createdAt: data.createdAt?.toDate?.() ?? null,
    updatedAt: data.updatedAt?.toDate?.() ?? null,
  } satisfies UserProfile
}

export async function fetchUserDashboard(uid: string): Promise<DashboardCourse[]> {
  assertFirestoreReady()

  const enrollmentQuery = query(
    collection(db, COLLECTIONS.enrollments),
    where("userId", "==", uid)
  )

  const enrollmentSnapshots = await getDocs(enrollmentQuery)
  const enrollments: Enrollment[] = enrollmentSnapshots.docs.map((docSnap) => {
    const data = docSnap.data()
    return {
      id: docSnap.id,
      userId: data.userId,
      courseId: data.courseId,
      status: data.status ?? "active",
      progress: data.progress ?? 0,
    }
  })

  if (!enrollments.length) {
    return []
  }

  const courseIds = enrollments.map((enrollment) => enrollment.courseId)
  const courses = await Promise.all(
    courseIds.map(async (courseId) => {
      const courseSnap = await getDoc(doc(db, COLLECTIONS.courses, courseId))
      if (!courseSnap.exists()) {
        return null
      }
      const data = courseSnap.data()
      return {
        id: courseSnap.id,
        title: data.title ?? "",
        description: data.description ?? "",
        level: data.level ?? "Beginner",
        durationWeeks: data.durationWeeks ?? 0,
        coverUrl: data.coverUrl ?? undefined,
      } satisfies Course
    })
  )

  const tracksQuery = query(
    collection(db, COLLECTIONS.tracks),
    where("courseId", "in", courseIds)
  )
  const trackSnapshots = await getDocs(tracksQuery)
  const tracks: Track[] = trackSnapshots.docs.map((docSnap) => {
    const data = docSnap.data()
    return {
      id: docSnap.id,
      courseId: data.courseId,
      title: data.title ?? "",
      description: data.description ?? "",
      order: data.order ?? 0,
    }
  })

  const activitiesQuery = query(
    collection(db, COLLECTIONS.activities),
    where("courseId", "in", courseIds)
  )
  const activitySnapshots = await getDocs(activitiesQuery)
  const activities: Activity[] = activitySnapshots.docs.map((docSnap) => {
    const data = docSnap.data()
    return {
      id: docSnap.id,
      courseId: data.courseId,
      trackId: data.trackId,
      title: data.title ?? "",
      type: data.type ?? "lesson",
      order: data.order ?? 0,
      estimatedMinutes: data.estimatedMinutes ?? 0,
    }
  })

  return enrollments
    .map((enrollment) => {
      const course = courses.find((item) => item?.id === enrollment.courseId)
      if (!course) {
        return null
      }
      const courseTracks = tracks
        .filter((track) => track.courseId === enrollment.courseId)
        .sort((a, b) => a.order - b.order)
      const courseActivities = activities
        .filter((activity) => activity.courseId === enrollment.courseId)
        .sort((a, b) => a.order - b.order)

      return {
        ...course,
        enrollment,
        tracks: courseTracks,
        activities: courseActivities,
      }
    })
    .filter((item): item is DashboardCourse => Boolean(item))
}