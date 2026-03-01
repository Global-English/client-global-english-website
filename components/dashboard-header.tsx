"use client"

import * as React from "react"

import Link from "next/link"

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
  breadcrumbItems?: Array<{
    label: string
    href?: string
  }>
  description?: string
  action?: React.ReactNode
}

export const DashboardHeader = React.memo(function DashboardHeader({
  title,
  breadcrumb,
  breadcrumbItems,
  description,
  action,
}: DashboardHeaderProps) {
  const { role } = useAuth()
  const resolvedItems = React.useMemo(() => {
    if (breadcrumbItems && breadcrumbItems.length) {
      return breadcrumbItems
    }
    if (breadcrumb) {
      return [{ label: breadcrumb }]
    }
    return []
  }, [breadcrumb, breadcrumbItems])

  return (
    <div className="border-b">
      <header className="flex h-16 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb className="hidden md:block">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/dashboard">Global English</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              {resolvedItems.length ? (
                resolvedItems.map((item, index) => {
                  const isLast = index === resolvedItems.length - 1
                  return (
                    <React.Fragment key={`${item.label}-${index}`}>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        {isLast || !item.href ? (
                          <BreadcrumbPage>{item.label}</BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink asChild>
                            <Link href={item.href}>{item.label}</Link>
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                    </React.Fragment>
                  )
                })
              ) : (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{title}</BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              )}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="ml-auto flex items-center gap-3 pr-4 text-sm text-muted-foreground">
          <span className="hidden md:inline-block">
            {role === "admin" ? "Administrador" : "Aluno"}
          </span>
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
})
