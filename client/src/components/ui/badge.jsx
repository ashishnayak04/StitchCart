import * as React from "react"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-sm px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] transition-colors",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground",
        secondary:
          "bg-surface-hover text-muted",
        destructive:
          "bg-danger/10 text-danger border border-danger/20",
        outline:
          "text-muted border border-border bg-transparent",
        premium:
          "bg-accent/12 text-brown border border-accent/30",
        limited:
          "bg-espresso/5 text-brown border border-espresso/15",
        new:
          "bg-accent text-accent-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  ...props
}) {
  return (<div className={cn(badgeVariants({ variant }), className)} {...props} />);
}

export { Badge, badgeVariants }
