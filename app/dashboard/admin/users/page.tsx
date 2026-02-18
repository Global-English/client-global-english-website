"use client"

import * as React from "react"
import { Mail, UserCheck, UserPlus, Users2 } from "lucide-react"

import { DashboardHeader } from "@/components/dashboard-header"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const demoUsers = [
  {
    id: "user-1",
    name: "Camila Souza",
    email: "camila@globalenglish.com",
    role: "Aluno",
    status: "Ativo",
  },
  {
    id: "user-2",
    name: "Rafael Lima",
    email: "rafael@globalenglish.com",
    role: "Instrutor",
    status: "Ativo",
  },
  {
    id: "user-3",
    name: "Marina Torres",
    email: "marina@globalenglish.com",
    role: "Admin",
    status: "Ativo",
  },
]

export default function Page() {
  const { role, isFirebaseReady } = useAuth()

  if (role !== "admin") {
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Acesso restrito</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Esta área é exclusiva para administradores.
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div>
      <DashboardHeader
        title="Usuários"
        description="Gerencie alunos, instrutores e permissões da plataforma."
        action={<Button size="sm">Convidar usuário</Button>}
      />

      <div className="flex flex-col gap-6 p-6">
        {!isFirebaseReady ? (
          <div className="rounded-2xl border border-dashed bg-muted/40 p-4 text-sm text-muted-foreground">
            Firebase não configurado. Exibindo usuários de demonstração.
          </div>
        ) : null}

        <Card>
          <CardHeader className="flex items-center justify-between gap-3 sm:flex-row">
            <div>
              <CardTitle className="text-base">Base de usuários</CardTitle>
              <p className="text-sm text-muted-foreground">
                Acompanhe convites e status de acesso.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Input placeholder="Buscar por nome ou email" className="h-9" />
              <Button size="sm" variant="outline">
                Filtrar
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {demoUsers.map((user) => (
              <div
                key={user.id}
                className="flex flex-col gap-3 rounded-2xl border p-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span className="rounded-full bg-muted px-3 py-1">
                    {user.role}
                  </span>
                  <span className="rounded-full bg-muted px-3 py-1">
                    {user.status}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline">
                    Ver perfil
                  </Button>
                  <Button size="sm">Editar</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Cadastrar novo usuário</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="new-user-name">Nome completo</Label>
              <Input id="new-user-name" placeholder="Nome do usuário" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-user-email">Email</Label>
              <Input
                id="new-user-email"
                type="email"
                placeholder="usuario@empresa.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-user-role">Perfil</Label>
              <Input
                id="new-user-role"
                placeholder="Aluno, Instrutor, Admin"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-user-team">Equipe</Label>
              <Input id="new-user-team" placeholder="Turma ou time" />
            </div>
            <div className="md:col-span-2 flex items-center gap-2">
              <Button>Salvar usuário</Button>
              <Button variant="outline">Enviar convite por email</Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            { label: "Usuários ativos", value: 128, icon: Users2 },
            { label: "Convites pendentes", value: 5, icon: Mail },
            { label: "Admins", value: 3, icon: UserCheck },
          ].map((item) => (
            <Card key={item.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium">{item.label}</CardTitle>
                <item.icon className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">{item.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Ações rápidas</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            {[
              "Enviar convite em massa",
              "Exportar lista de usuários",
              "Atualizar permissões",
              "Gerar relatório de acesso",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center justify-between rounded-2xl border p-3"
              >
                <span className="text-sm">{item}</span>
                <Button size="sm" variant="ghost">
                  Abrir
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
