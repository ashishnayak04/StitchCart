import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-luxury-charcoal text-luxury-ivory hover:bg-luxury-brown px-8 py-3 tracking-wider uppercase text-xs",
        destructive: "bg-luxury-charcoal text-white hover:bg-red-600 px-8 py-3",
        outline: "border border-luxury-beige bg-transparent hover:bg-luxury-cream text-luxury-charcoal hover:border-luxury-gold px-8 py-3",
        secondary: "bg-luxury-cream text-luxury-charcoal hover:bg-luxury-beige px-8 py-3",
        ghost: "hover:bg-luxury-cream text-luxury-taupe hover:text-luxury-charcoal",
        link: "text-luxury-charcoal underline-offset-4 hover:underline hover:text-luxury-gold",
        gold: "bg-luxury-gold text-luxury-ivory hover:bg-luxury-brown px-8 py-3 tracking-wider uppercase text-xs",
        "outline-gold": "border border-luxury-gold text-luxury-gold bg-transparent hover:bg-luxury-gold hover:text-luxury-ivory px-8 py-3 uppercase text-xs tracking-wider",
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
