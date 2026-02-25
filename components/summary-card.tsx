"use client"

import * as React from "react"
import type { LucideIcon } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type SummaryCardProps = {
  label: string
  value: string | number
  icon?: LucideIcon
  className?: string
}

export const SummaryCard = React.memo(function SummaryCard({
  label,
  value,
  icon: Icon,
  className,
}: SummaryCardProps) {
  return (
    <Card className={cn("rounded-b-none p-3 border-b border-dashed border-muted-foreground/15", className)}>
      <CardContent className="flex items-center gap-4 px-3">
        {Icon ? (
          <div className="flex size-10 rounded-t-md items-center justify-center bg-accent/60 text-muted-foreground">
            <Icon className="size-5" />
          </div>
        ) : null}
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-lg font-semibold text-foreground">{value}</p>
        </div>
      </CardContent>
    </Card>
  )
})
