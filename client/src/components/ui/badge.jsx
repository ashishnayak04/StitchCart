import * as React from "react"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center px-3 py-1 text-[10px] font-medium uppercase tracking-[0.15em] transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-luxury-charcoal text-luxury-ivory",
        secondary:
          "bg-luxury-cream text-luxury-taupe",
        destructive:
          "bg-red-50 text-red-700 border border-red-100",
        outline:
          "text-luxury-taupe border border-luxury-beige bg-transparent",
        premium:
          "bg-luxury-gold/10 text-luxury-brown border border-luxury-gold/20",
        limited:
          "bg-luxury-brown text-luxury-ivory",
        new:
          "bg-luxury-gold text-white",
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
