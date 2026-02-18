"use client"

import * as React from "react"

import { useAuth } from "@/hooks/use-auth"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

type DashboardHeaderProps = {
  title: string
  breadcrumb?: string
  description?: string
  action?: React.ReactNode
}

export function DashboardHeader({
  title,
  breadcrumb,
  description,
  action,
}: DashboardHeaderProps) {
  const { role } = useAuth()

  return (
    <div className="border-b">
      <header className="flex h-16 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard">Global English</BreadcrumbLink>
              </BreadcrumbItem>
              {breadcrumb ? (
                <>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{breadcrumb}</BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              ) : (
                <>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{title}</BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              )}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="ml-auto flex items-center gap-3 pr-4 text-sm text-muted-foreground">
          {role === "admin" ? "Administrador" : "Aluno"}
          {action ? <div>{action}</div> : null}
        </div>
      </header>
      <div className="px-6 pb-4 pt-3">
        <h1 className="text-2xl font-semibold">{title}</h1>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
    </div>
  )
}
