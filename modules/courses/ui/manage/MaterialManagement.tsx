"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import {
    FileText,
    Plus,
    Trash2,
    Users2,
    X,
    Calendar,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCourseManagement, MaterialForm } from "./CourseManagementContext"
import { MATERIAL_TYPE_LABELS, MATERIAL_TYPE_ICONS } from "./constants"
import { uploadImage } from "@/lib/cloudinary-actions"

const MarkdownEditor = dynamic(() => import("@uiw/react-md-editor"), {
    ssr: false,
})

export function MaterialManagement() {
    const {
        tracks,
        materials,
        availableUsers,
        loading,
        loadMaterials,
        handleCreateMaterial,
        handleDeleteMaterial,
    } = useCourseManagement()

    const [form, setForm] = React.useState<MaterialForm>({
        trackId: "",
        title: "",
        visibility: "module",
        userIds: [],
        scheduleMode: "now",
        releaseAt: "",
        markdown: "",
        attachments: [],
    })

    const [localCreating, setLocalCreating] = React.useState(false)
    const [userSearch, setUserSearch] = React.useState("")

    const resetForm = () => {
        setForm({
            trackId: "",
            title: "",
            visibility: "module",
            userIds: [],
            scheduleMode: "now",
            releaseAt: "",
            markdown: "",
            attachments: [],
        })
        setUserSearch("")
    }

    const onSubmit = async () => {
        setLocalCreating(true)
        await handleCreateMaterial(form)
        setLocalCreating(false)
        resetForm()
    }

    const addAttachment = () => {
        setForm((prev) => ({
            ...prev,
            attachments: [...prev.attachments, { name: "", url: "", type: "pdf" }],
        }))
    }

    const removeAttachment = (index: number) => {
        setForm((prev) => ({
            ...prev,
            attachments: prev.attachments.filter((_, i) => i !== index),
        }))
    }

    const toggleUserSelection = (uid: string) => {
        setForm((prev) => ({
            ...prev,
            userIds: prev.userIds.includes(uid)
                ? prev.userIds.filter((id) => id !== uid)
                : [...prev.userIds, uid],
        }))
    }

    const handleFileUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const formData = new FormData()
        formData.append("file", file)

        try {
            const result = await uploadImage(formData, "materials")
            setForm((prev) => {
                const next = [...prev.attachments]
                next[index] = {
                    ...next[index],
                    url: result.secure_url,
                    name: next[index].name || file.name,
                }
                return { ...prev, attachments: next }
            })
        } catch (error) {
            console.error("Upload failed", error)
        }
    }

    const selectedUsers = React.useMemo(() => {
        return availableUsers.filter((user) => form.userIds.includes(user.uid))
    }, [availableUsers, form.userIds])

    const suggestedUsers = React.useMemo(() => {
        if (!userSearch.trim()) return []
        const search = userSearch.toLowerCase()
        return availableUsers
            .filter(
                (user) =>
                    !form.userIds.includes(user.uid) &&
                    (user.name?.toLowerCase().includes(search) ||
                        user.email?.toLowerCase().includes(search))
            )
            .slice(0, 5)
    }, [availableUsers, form.userIds, userSearch])

    return (
        <div className="grid gap-6 lg:grid-cols-[1.5fr,1fr]">
            {/* Creation and Form Card */}
            <div className="flex flex-col gap-6">
                <Card className="border-primary/10 bg-card/40 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-base font-bold">Conteúdo do Material</CardTitle>
                        <p className="text-xs text-muted-foreground leading-relaxed">Defina os tópicos, textos e arquivos de apoio.</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">Módulo de Destino</Label>
                                <select
                                    className="bg-background/50 text-foreground border-primary/10 h-9 w-full rounded-md border px-3 py-1 text-sm shadow-xs outline-none focus:border-primary/30"
                                    value={form.trackId}
                                    onChange={(e) => setForm((p) => ({ ...p, trackId: e.target.value }))}
                                >
                                    <option value="">Selecione um módulo</option>
                                    {tracks.map((track) => (
                                        <option key={track.id} value={track.id}>{track.title}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">Título</Label>
                                <Input
                                    placeholder="Ex.: Checklist de Apresentação"
                                    value={form.title}
                                    onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                                    className="bg-background/50 border-primary/10"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">Anexos & Links</Label>
                                <Button variant="ghost" size="xs" onClick={addAttachment} className="text-[10px] font-bold uppercase tracking-widest text-primary">
                                    <Plus className="mr-1 size-3" /> Adicionar
                                </Button>
                            </div>

                            <div className="space-y-2">
                                {form.attachments.length === 0 ? (
                                    <div className="rounded-xl border border-dashed border-primary/5 p-4 text-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">Nenhum anexo configurado</div>
                                ) : (
                                    form.attachments.map((att, idx) => (
                                        <div key={idx} className="flex gap-2 p-2 rounded-lg border border-primary/5 bg-primary/1 items-start transition-all hover:border-primary/20">
                                            <div className="grid grid-cols-[100px,1fr,1.5fr] gap-2 flex-1">
                                                <select
                                                    className="bg-background/50 text-foreground border-primary/10 h-8 w-full rounded-md border px-2 py-0 text-[10px] uppercase font-bold tracking-tight outline-none"
                                                    value={att.type}
                                                    onChange={(e) => setForm((p) => {
                                                        const next = [...p.attachments];
                                                        next[idx] = { ...next[idx], type: e.target.value as typeof next[number]["type"] };
                                                        return { ...p, attachments: next };
                                                    })}
                                                >
                                                    {Object.entries(MATERIAL_TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                                                </select>
                                                <Input
                                                    placeholder="Nome"
                                                    value={att.name}
                                                    onChange={(e) => setForm((p) => {
                                                        const next = [...p.attachments];
                                                        next[idx] = { ...next[idx], name: e.target.value };
                                                        return { ...p, attachments: next };
                                                    })}
                                                    className="h-8 text-xs bg-background/50 border-primary/10"
                                                />
                                                <Input
                                                    placeholder="https://..."
                                                    value={att.url}
                                                    onChange={(e) => setForm((p) => {
                                                        const next = [...p.attachments];
                                                        next[idx] = { ...next[idx], url: e.target.value };
                                                        return { ...p, attachments: next };
                                                    })}
                                                    className="h-8 text-xs bg-background/50 border-primary/10"
                                                />
                                                <div className="flex items-center">
                                                    <input
                                                        type="file"
                                                        id={`file-upload-${idx}`}
                                                        className="hidden"
                                                        onChange={(e) => handleFileUpload(idx, e)}
                                                    />
                                                    <Button
                                                        variant="ghost"
                                                        size="xs"
                                                        onClick={() => document.getElementById(`file-upload-${idx}`)?.click()}
                                                        className="h-8 px-2 text-[10px] font-bold uppercase tracking-widest text-primary hover:bg-primary/10"
                                                    >
                                                        Upload
                                                    </Button>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="xs" onClick={() => removeAttachment(idx)} className="h-8 w-8 p-0 text-destructive/40 hover:text-destructive">
                                                <Trash2 className="size-3" />
                                            </Button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">Texto Markdown (Opcional)</Label>
                            <div className="rounded-xl border border-primary/10 overflow-hidden bg-background/40 p-1">
                                <MarkdownEditor
                                    value={form.markdown}
                                    onChange={(val) => setForm((p) => ({ ...p, markdown: val || "" }))}
                                    height={200}
                                    preview="live"
                                    visibleDragbar={false}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-primary/10 bg-card/40 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-base font-bold">Regras de Liberação</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-3">
                            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">Abrangência da Visibilidade</Label>
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { value: "module", label: "Módulo", icon: Plus },
                                    { value: "users", label: "Alunos", icon: Users2 },
                                    { value: "private", label: "Privado", icon: X },
                                ].map((opt) => (
                                    <button
                                        key={opt.value}
                                        onClick={() => setForm((p) => ({ ...p, visibility: opt.value as MaterialForm["visibility"] }))}
                                        className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${form.visibility === opt.value ? "bg-primary/10 border-primary/30 text-primary" : "border-primary/5 bg-primary/1 text-muted-foreground hover:bg-primary/5"
                                            }`}
                                    >
                                        <div className="text-[10px] font-bold uppercase tracking-widest">{opt.label}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {form.visibility === "users" && (
                            <div className="space-y-3 p-4 rounded-2xl border border-dashed border-primary/10 bg-primary/1">
                                <div className="flex items-center justify-between">
                                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">Alunos Selecionados</Label>
                                    <span className="text-[10px] font-bold text-primary px-2 py-0.5 rounded-full bg-primary/5">{form.userIds.length} total</span>
                                </div>
                                <Input
                                    placeholder="Buscar alunos..."
                                    value={userSearch}
                                    onChange={(e) => setUserSearch(e.target.value)}
                                    className="bg-background/50 border-primary/5 text-xs h-8"
                                />
                                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                                    {selectedUsers.length === 0 ? (
                                        <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/30 text-center w-full py-4">Nenhum aluno selecionado</p>
                                    ) : (
                                        selectedUsers.map((u) => (
                                            <span key={u.uid} className="inline-flex items-center gap-1 rounded-full bg-primary/10 border border-primary/5 px-2 py-0.5 text-[9px] font-bold">
                                                {u.name}
                                                <button onClick={() => toggleUserSelection(u.uid)}><X className="size-2.5" /></button>
                                            </span>
                                        ))
                                    )}
                                </div>
                                {suggestedUsers.length > 0 && (
                                    <div className="space-y-1 pt-2 border-t border-primary/5">
                                        {suggestedUsers.map((u) => (
                                            <button key={u.uid} onClick={() => toggleUserSelection(u.uid)} className="w-full text-left text-[10px] p-1.5 hover:bg-primary/5 rounded border border-transparent hover:border-primary/10 flex justify-between items-center group">
                                                <span>{u.name}</span>
                                                <span className="text-primary font-bold opacity-0 group-hover:opacity-100">+ Add</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="space-y-3">
                            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">Cronograma</Label>
                            <div className="grid grid-cols-2 gap-2">
                                {[
                                    { value: "now", label: "Imediato" },
                                    { value: "scheduled", label: "Agendado" },
                                ].map(opt => (
                                    <button
                                        key={opt.value}
                                        onClick={() => setForm(p => ({ ...p, scheduleMode: opt.value as MaterialForm["scheduleMode"] }))}
                                        className={`p-2 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all ${form.scheduleMode === opt.value ? "bg-primary/10 border-primary/30 text-primary" : "border-primary/5 bg-primary/1 text-muted-foreground hover:bg-primary/5"
                                            }`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                            {form.scheduleMode === "scheduled" && (
                                <div className="flex items-center gap-2 mt-2 p-2 border border-primary/10 rounded-lg bg-background/50">
                                    <Calendar className="size-4 text-primary" />
                                    <Input
                                        type="datetime-local"
                                        value={form.releaseAt}
                                        onChange={(e) => setForm(p => ({ ...p, releaseAt: e.target.value }))}
                                        className="border-none bg-transparent h-7 text-xs focus-visible:ring-0"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="pt-4 flex gap-2">
                            <Button onClick={onSubmit} disabled={localCreating} className="flex-1 shadow-lg shadow-primary/20">
                                {localCreating ? "Criando..." : "Salvar Material"}
                            </Button>
                            <Button variant="outline" onClick={resetForm} disabled={localCreating}>Limpar</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* List Card */}
            <Card className="border-primary/10 bg-card/20 backdrop-blur-sm h-fit sticky top-6">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-base font-bold">Biblioteca do Curso</CardTitle>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Documentos e Aulas</p>
                    </div>
                    <Button variant="ghost" size="xs" onClick={() => void loadMaterials(true)} disabled={loading.materials} className="text-[10px] font-bold uppercase tracking-widest">Atualizar</Button>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {loading.materials ? (
                            <div className="h-32 flex items-center justify-center text-muted-foreground animate-pulse text-[10px] uppercase font-bold tracking-widest">Sincronizando...</div>
                        ) : tracks.length === 0 || materials.length === 0 ? (
                            <p className="text-[10px] text-muted-foreground/40 text-center py-8 font-bold uppercase tracking-widest">Nenhum material cadastrado</p>
                        ) : (
                            tracks.map(track => {
                                const trackMaterials = materials.filter(m => m.trackId === track.id)
                                if (!trackMaterials.length) return null
                                return (
                                    <div key={track.id} className="space-y-2">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 border-b border-primary/10 pb-1 mb-3">{track.title}</p>
                                        {trackMaterials.map(m => {
                                            const primaryAtt = m.attachments?.[0]?.type || "link"
                                            const Icon = MATERIAL_TYPE_ICONS[primaryAtt as keyof typeof MATERIAL_TYPE_ICONS] || FileText
                                            return (
                                                <div key={m.id} className="flex items-center justify-between p-3 rounded-2xl border border-primary/5 bg-primary/1 transition-all hover:bg-primary/5 hover:border-primary/20 group">
                                                    <div className="flex items-center gap-3">
                                                        <div className="size-8 rounded-xl bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                                            <Icon className="size-4 text-primary/60" />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-bold tracking-tight">{m.title}</p>
                                                            <div className="flex items-center gap-2 mt-0.5">
                                                                <span className="text-[9px] font-bold uppercase text-muted-foreground/40">{m.visibility}</span>
                                                                <span className="text-[9px] font-bold uppercase text-muted-foreground/20">•</span>
                                                                <span className="text-[9px] font-medium text-muted-foreground/40">{m.attachments?.length || 0} anexo(s)</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <Button variant="ghost" size="xs" onClick={() => handleDeleteMaterial(m)} className="h-8 w-8 p-0 text-destructive/20 hover:text-destructive hover:bg-destructive/5 transition-all opacity-0 group-hover:opacity-100">
                                                        <X className="size-3" />
                                                    </Button>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )
                            })
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
