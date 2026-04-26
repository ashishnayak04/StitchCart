import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-none text-xs font-bold uppercase tracking-widest ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-zinc-950 text-white hover:bg-zinc-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] active:translate-y-[1px] active:shadow-none",
        destructive: "bg-white border border-red-200 text-red-600 hover:bg-red-50",
        outline: "border border-stone-200 bg-transparent hover:bg-stone-50 hover:border-stone-800 text-stone-900",
        secondary: "bg-stone-100 text-stone-900 hover:bg-stone-200 border border-transparent",
        ghost: "hover:bg-stone-100 text-stone-600 hover:text-stone-900",
        link: "text-zinc-950 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 px-8 py-2",
        sm: "h-9 px-4 text-[10px]",
        lg: "h-14 px-10 text-sm",
        icon: "h-12 w-12",
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