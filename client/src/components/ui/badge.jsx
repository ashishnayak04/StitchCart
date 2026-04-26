import * as React from "react"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-sm border px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-zinc-950 text-white hover:bg-zinc-800 shadow-sm",
        secondary:
          "border-transparent bg-stone-100 text-stone-600 hover:bg-stone-200",
        destructive:
          "border-transparent bg-red-50 text-red-700 hover:bg-red-100 border border-red-100",
        outline: 
          "text-stone-500 border-stone-200 bg-transparent hover:bg-stone-50",
        premium:
          "border-transparent bg-amber-50 text-amber-700 border border-amber-200/50 hover:bg-amber-100",
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