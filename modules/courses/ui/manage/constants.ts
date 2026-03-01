import {
    FileText,
    Video,
    Link as LinkIcon,
    FileAudio,
    BookOpenCheck,
    ClipboardList,
    Layers3,
} from "lucide-react"
import React from "react"

export const MATERIAL_TYPE_LABELS: Record<"pdf" | "video" | "link" | "audio", string> = {
    pdf: "PDF",
    video: "Vídeo",
    link: "Link",
    audio: "Áudio",
}

export const MATERIAL_TYPE_ICONS: Record<
    "pdf" | "video" | "link" | "audio",
    React.ComponentType<{ className?: string }>
> = {
    pdf: FileText,
    video: Video,
    link: LinkIcon,
    audio: FileAudio,
}

export const ACTIVITY_TYPE_LABELS = {
    lesson: "Aula",
    quiz: "Quiz",
    assignment: "Atividade",
    project: "Projeto",
} as const

export const ACTIVITY_TYPE_ICONS: Record<
    keyof typeof ACTIVITY_TYPE_LABELS,
    React.ComponentType<{ className?: string }>
> = {
    lesson: BookOpenCheck,
    quiz: ClipboardList,
    assignment: FileText,
    project: Layers3,
}
