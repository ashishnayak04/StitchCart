import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-xs font-semibold uppercase tracking-[0.08em] transition-colors duration-fast disabled:pointer-events-none disabled:opacity-40",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary-hover",
        destructive: "bg-danger text-danger-foreground hover:bg-danger/90",
        outline: "border border-border bg-transparent text-foreground hover:bg-surface-hover hover:border-border-strong",
        secondary: "bg-surface-hover text-foreground hover:bg-beige",
        ghost: "text-muted hover:bg-surface-hover hover:text-foreground",
        link: "text-foreground underline-offset-4 hover:underline hover:text-accent-hover",
        gold: "bg-accent text-accent-foreground hover:bg-accent-hover",
        "outline-gold": "border border-accent/60 text-accent-hover hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-12 px-8 py-3",
        sm: "h-10 px-5 py-2 text-[11px]",
        lg: "h-14 px-10 py-4 text-sm",
        icon: "h-12 w-12",
        "icon-sm": "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    (<Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props} />)
  );
})
Button.displayName = "Button"

export { Button, buttonVariants }
