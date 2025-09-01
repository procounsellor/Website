"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Input } from "./ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

type Props = {
  placeholder?: string
  className?: string
  size?: "sm" | "md" | "lg"
  showButton?: boolean
  onSearch?: (value: string) => void
}

export function SearchBar({
  placeholder = "Search Courses, Colleges, Counsellor...",
  className,
  size = "md",
  showButton = false,
  onSearch,
}: Props) {
  const [value, setValue] = React.useState("")

  const sizing =
    size === "lg"
      ? { icon: "h-5 w-5", input: "py-5 pl-12 pr-4 text-base", btn: "h-10 px-5 text-sm" }
      : size === "sm"
        ? { icon: "h-4 w-4", input: "py-2.5 pl-9 pr-3 text-sm", btn: "h-9 px-4 text-xs" }
        : { icon: "h-4 w-4", input: "py-3 pl-10 pr-3", btn: "h-9 px-4 text-sm" }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    onSearch?.(value)
  }

  return (
    <form onSubmit={submit} className={cn("relative w-full", className)}>
      <Search
        className={cn(
          "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-orange-500",
          sizing.icon,
        )}
      />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        aria-label="Search"
        className={cn(
          "rounded-md bg-background text-foreground placeholder:text-muted-foreground shadow-sm ring-1 ring-muted-foreground/15 focus-visible:ring-2 focus-visible:ring-orange-500",
          sizing.input,
        )}
      />
      {showButton && (
        <Button
          type="submit"
          className={cn(
            "absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-orange-500 text-white hover:bg-orange-600",
            sizing.btn,
          )}
        >
          Search
        </Button>
      )}
    </form>
  )
}
