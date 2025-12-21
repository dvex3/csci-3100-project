import * as React from "react"
import { cn } from "@/src/lib/utils"

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg"
}

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(({ className, size = "md", ...props }, ref) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  }

  return (
    <div
      ref={ref}
      className={cn(
        "inline-block animate-spin rounded-full border-2 border-muted border-t-primary",
        sizeClasses[size],
        className,
      )}
      {...props}
    />
  )
})

Spinner.displayName = "Spinner"

export { Spinner }
