"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

type SwitchProps = {
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange">

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      className,
      checked,
      defaultChecked,
      onCheckedChange,
      disabled,
      ...props
    },
    ref
  ) => {
    const isControlled = typeof checked === "boolean"
    const [internalChecked, setInternalChecked] = React.useState(
      defaultChecked ?? false
    )

    const isChecked = isControlled ? checked : internalChecked

    function toggle() {
      if (disabled) {
        return
      }
      const nextValue = !isChecked
      if (!isControlled) {
        setInternalChecked(nextValue)
      }
      onCheckedChange?.(nextValue)
    }

    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={isChecked}
        data-state={isChecked ? "checked" : "unchecked"}
        disabled={disabled}
        onClick={toggle}
        className={cn(
          "relative inline-flex h-6 w-11 items-center rounded-full border border-transparent transition-colors",
          "bg-muted data-[state=checked]:bg-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      >
        <span
          className={cn(
            "inline-block h-5 w-5 transform rounded-full bg-background shadow transition-transform",
            isChecked ? "translate-x-5" : "translate-x-1"
          )}
        />
      </button>
    )
  }
)
Switch.displayName = "Switch"
