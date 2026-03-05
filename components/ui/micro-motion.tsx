"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

type MotionItemProps = React.HTMLAttributes<HTMLDivElement> & {
  delay?: number
  lift?: boolean
}

export function MotionItem({
  delay = 0,
  lift = false,
  className,
  style,
  children,
  ...props
}: MotionItemProps) {
  return (
    <div
      className={cn("ge-reveal", lift && "ge-hover-lift", className)}
      style={{ ...style, animationDelay: `${delay}ms` }}
      {...props}
    >
      {children}
    </div>
  )
}
