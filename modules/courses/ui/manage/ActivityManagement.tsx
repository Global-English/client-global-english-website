"use client"

import * as React from "react"
import {
    Plus,
    Target,
    Trash2,
    X,
    FileText,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCourseManagement, ActivityForm } from "./CourseManagementContext"
import { ACTIVITY_TYPE_LABELS, ACTIVITY_TYPE_ICONS } from "./constants"

export function ActivityManagement() {
    const {
        tracks,
        activities,
        availableUsers,
        loading,
        loadActivities,
        handleCreateActivity,
        handleDeleteActivity,
    } = useCourseManagement()

    const [form, setForm] = React.useState<ActivityForm>({
        trackId: "",
        title: "",
        type: "lesson",
        estimatedMinutes: "",
        order: "",
        visibility: "module",
        userIds: [],
        scheduleMode: "now",
        releaseAt: "",
        attachments: [],
        questions: [],
    })

    const [localCreating, setLocalCreating] = React.useState(false)
    const [userSearch, setUserSearch] = React.useState("")

    const resetForm = () => {
        setForm({
            trackId: "",
            title: "",
            type: "lesson",
            estimatedMinutes: "",
            order: "",
            visibility: "module",
            userIds: [],
            scheduleMode: "now",
            releaseAt: "",
            attachments: [],
            questions: [],
        })
        setUserSearch("")
    }

    const onSubmit = async () => {
        setLocalCreating(true)
        await handleCreateActivity(form)
        setLocalCreating(false)
        resetForm()
    }

    const addQuestion = () => {
        setForm((prev) => ({
            ...prev,
            questions: [
                ...prev.questions,
                {
                    id: `q-${Date.now()}`,
                    type: "essay",
                    prompt: "",
                    options: [],
                    correctAnswers: [],
                    points: "10",
                    required: true,
                },
            ],
        }))
    }

    const removeQuestion = (index: number) => {
        setForm((prev) => ({
            ...prev,
            questions: prev.questions.filter((_, i) => i !== index),
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

    const selectedUsers = React.useMemo(() => {
        return availableUsers.filter((user) => form.userIds.includes(user.uid))
    }, [availableUsers, form.userIds])



    return (
        <div className="grid gap-6 lg:grid-cols-[1.5fr,1fr]">
            {/* Creation and Form Card */}
            <div className="flex flex-col gap-6">
                <Card className="border-primary/10 bg-card/40 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-base font-bold">Estrutura da Atividade</CardTitle>
                        <p className="text-xs text-muted-foreground leading-relaxed">Defina o tipo de exercício, tempo estimado e critérios.</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">Módulo</Label>
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
                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">Título da Atividade</Label>
                                <Input
                                    placeholder="Ex.: Simulação de Reunião"
                                    value={form.title}
                                    onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                                    className="bg-background/50 border-primary/10"
                                />
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-3">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">Categoria</Label>
                                <select
                                    className="bg-background/50 text-foreground border-primary/10 h-9 w-full rounded-md border px-3 py-1 text-sm shadow-xs outline-none focus:border-primary/30"
                                    value={form.type}
                                    onChange={(e) => setForm((p) => ({ ...p, type: e.target.value as ActivityForm["type"] }))}
                                >
                                    {Object.entries(ACTIVITY_TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">Duração (Min)</Label>
                                <Input
                                    type="number"
                                    placeholder="Ex.: 45"
                                    value={form.estimatedMinutes}
                                    onChange={(e) => setForm((p) => ({ ...p, estimatedMinutes: e.target.value }))}
                                    className="bg-background/50 border-primary/10"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">Ordem na Trilha</Label>
                                <Input
                                    type="number"
                                    placeholder="Ex.: 2"
                                    value={form.order}
                                    onChange={(e) => setForm((p) => ({ ...p, order: e.target.value }))}
                                    className="bg-background/50 border-primary/10"
                                />
                            </div>
                        </div>

                        <div className="space-y-3 pt-4 border-t border-primary/5">
                            <div className="flex items-center justify-between">
                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">Questões e Critérios</Label>
                                <Button variant="ghost" size="xs" onClick={addQuestion} className="text-[10px] font-bold uppercase tracking-widest text-primary">
                                    <Plus className="mr-1 size-3" /> Adicionar Questão
                                </Button>
                            </div>

                            <div className="space-y-4">
                                {form.questions.length === 0 ? (
                                    <div className="rounded-xl border border-dashed border-primary/5 p-6 text-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">Nenhuma questão definida</div>
                                ) : (
                                    form.questions.map((q, qIdx) => (
                                        <Card key={q.id} className="relative border-primary/10 bg-primary/1 overflow-hidden">
                                            <div className="absolute top-0 left-0 w-1 h-full bg-primary/20" />
                                            <CardHeader className="p-4 pb-0 flex flex-row items-center justify-between">
                                                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40">Questão {qIdx + 1}</div>
                                                <Button variant="ghost" size="xs" onClick={() => removeQuestion(qIdx)} className="h-6 w-6 p-0 text-destructive/40 hover:text-destructive">
                                                    <Trash2 className="size-3" />
                                                </Button>
                                            </CardHeader>
                                            <CardContent className="p-4 pt-4 space-y-3">
                                                <div className="grid gap-3 sm:grid-cols-2">
                                                    <div className="space-y-1">
                                                        <Label className="text-[9px] font-bold uppercase text-muted-foreground/50">Tipo de Resposta</Label>
                                                        <select
                                                            className="bg-background/50 text-foreground border-primary/5 h-8 w-full rounded-md border px-2 text-[10px] font-bold outline-none"
                                                            value={q.type}
                                                            onChange={(e) => setForm(p => {
                                                                const next = [...p.questions];
                                                                next[qIdx] = { ...next[qIdx], type: e.target.value as typeof next[number]["type"] };
                                                                return { ...p, questions: next };
                                                            })}
                                                        >
                                                            <option value="essay">Dissertativa</option>
                                                            <option value="single_choice">Escolha Única</option>
                                                            <option value="multiple_choice">Múltipla Escolha</option>
                                                            <option value="true_false">V/F</option>
                                                        </select>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <Label className="text-[9px] font-bold uppercase text-muted-foreground/50">Pontos</Label>
                                                        <Input
                                                            type="number"
                                                            value={q.points}
                                                            onChange={(e) => setForm(p => {
                                                                const next = [...p.questions];
                                                                next[qIdx] = { ...next[qIdx], points: e.target.value };
                                                                return { ...p, questions: next };
                                                            })}
                                                            className="h-8 text-[10px] bg-background/50 border-primary/5"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-1">
                                                    <Label className="text-[9px] font-bold uppercase text-muted-foreground/50">Enunciado</Label>
                                                    <textarea
                                                        className="bg-background/50 text-foreground border-primary/5 min-h-[60px] w-full rounded-md border p-2 text-xs outline-none"
                                                        value={q.prompt}
                                                        onChange={(e) => setForm(p => {
                                                            const next = [...p.questions];
                                                            next[qIdx] = { ...next[qIdx], prompt: e.target.value };
                                                            return { ...p, questions: next };
                                                        })}
                                                    />
                                                </div>

                                                {(q.type === "single_choice" || q.type === "multiple_choice") && (
                                                    <div className="space-y-2 border-t border-primary/5 pt-2 mt-2">
                                                        <Label className="text-[9px] font-black uppercase text-primary/40">Opções de Resposta</Label>
                                                        <div className="space-y-2">
                                                            {(q.options.length ? q.options : [""]).map((opt, oIdx) => (
                                                                <div key={oIdx} className="flex gap-2">
                                                                    <Input
                                                                        placeholder={`Opção ${oIdx + 1}`}
                                                                        value={opt}
                                                                        onChange={(e) => setForm(p => {
                                                                            const next = [...p.questions];
                                                                            const opts = [...next[qIdx].options];
                                                                            opts[oIdx] = e.target.value;
                                                                            next[qIdx] = { ...next[qIdx], options: opts };
                                                                            return { ...p, questions: next };
                                                                        })}
                                                                        className="h-8 text-xs bg-background/50 border-primary/5"
                                                                    />
                                                                    <Button variant="ghost" size="xs" onClick={() => setForm(p => {
                                                                        const next = [...p.questions];
                                                                        const opts = next[qIdx].options.filter((_, idx) => idx !== oIdx);
                                                                        next[qIdx] = { ...next[qIdx], options: opts };
                                                                        return { ...p, questions: next };
                                                                    })} className="h-8 w-8 text-muted-foreground/40 hover:text-destructive">
                                                                        <X className="size-3" />
                                                                    </Button>
                                                                </div>
                                                            ))}
                                                            <Button variant="ghost" size="xs" onClick={() => setForm(p => {
                                                                const next = [...p.questions];
                                                                next[qIdx] = { ...next[qIdx], options: [...next[qIdx].options, ""] };
                                                                return { ...p, questions: next };
                                                            })} className="text-[9px] font-bold uppercase tracking-widest">+ Add Opção</Button>
                                                        </div>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    ))
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-primary/10 bg-card/40 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-base font-bold">Disponibilidade & Liberação</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-3">
                            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">Público Alvo</Label>
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { value: "module", label: "Módulo" },
                                    { value: "users", label: "Alunos" },
                                    { value: "private", label: "Privado" },
                                ].map((opt) => (
                                    <button
                                        key={opt.value}
                                        onClick={() => setForm((p) => ({ ...p, visibility: opt.value as ActivityForm["visibility"] }))}
                                        className={`p-3 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all ${form.visibility === opt.value ? "bg-primary/10 border-primary/30 text-primary" : "border-primary/5 bg-primary/1 text-muted-foreground hover:bg-primary/5"
                                            }`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {form.visibility === "users" && (
                            <div className="space-y-3 p-4 rounded-2xl border border-dashed border-primary/10 bg-primary/1">
                                <Input
                                    placeholder="Pesquisar participantes..."
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
                            </div>
                        )}

                        <div className="pt-4 flex gap-2">
                            <Button onClick={onSubmit} disabled={localCreating} className="flex-1 shadow-lg shadow-primary/20">
                                {localCreating ? "Processando..." : "Salvar Atividade"}
                            </Button>
                            <Button variant="outline" onClick={resetForm} disabled={localCreating}>Limpar</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* List Card */}
            <Card className="border-primary/10 bg-card/20 backdrop-blur-sm h-fit sticky top-6">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div className="flex flex-col">
                        <CardTitle className="text-base font-bold">Banco de Atividades</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                            <Target className="size-3 text-primary/40" />
                            <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">{activities.length} exercícios</span>
                        </div>
                    </div>
                    <Button variant="ghost" size="xs" onClick={() => void loadActivities(true)} disabled={loading.activities} className="text-[10px] font-bold uppercase tracking-widest">Atualizar</Button>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {loading.activities ? (
                            <div className="h-32 flex items-center justify-center text-muted-foreground animate-pulse text-[10px] uppercase font-bold tracking-[0.3em]">Sincronizando...</div>
                        ) : tracks.length === 0 || activities.length === 0 ? (
                            <p className="text-[10px] text-muted-foreground/40 text-center py-12 font-bold uppercase tracking-widest">Aguardando novos desafios...</p>
                        ) : (
                            tracks.map(track => {
                                const trackActivities = activities.filter(a => a.trackId === track.id)
                                if (!trackActivities.length) return null
                                return (
                                    <div key={track.id} className="space-y-2">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500/60 border-b border-blue-500/10 pb-1 mb-3">{track.title}</p>
                                        {trackActivities.map(a => {
                                            const Icon = ACTIVITY_TYPE_ICONS[a.type as keyof typeof ACTIVITY_TYPE_ICONS] || FileText
                                            return (
                                                <div key={a.id} className="flex items-center justify-between p-3 rounded-2xl border border-primary/5 bg-primary/1 transition-all hover:bg-primary/5 hover:border-primary/20 group">
                                                    <div className="flex items-center gap-3">
                                                        <div className="size-8 rounded-xl bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                                            <Icon className="size-4 text-primary/60" />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold tracking-tight">{a.title}</p>
                                                        <div className="flex items-center gap-2 mt-0.5">
                                                            <span className="text-[9px] font-bold uppercase text-muted-foreground/40">{ACTIVITY_TYPE_LABELS[a.type as keyof typeof ACTIVITY_TYPE_LABELS]}</span>
                                                            <span className="text-[9px] font-bold uppercase text-muted-foreground/20">•</span>
                                                            <span className="text-[9px] font-medium text-muted-foreground/40">{a.estimatedMinutes || 0} min</span>
                                                        </div>
                                                    </div>
                                                    <Button variant="ghost" size="xs" onClick={() => handleDeleteActivity(a)} className="h-8 w-8 p-0 text-destructive/20 hover:text-destructive hover:bg-destructive/5 transition-all opacity-0 group-hover:opacity-100">
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
