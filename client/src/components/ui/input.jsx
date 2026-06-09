import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    (<input
      type={type}
      className={cn(
        "flex h-12 w-full border border-luxury-beige bg-white px-4 py-3 text-sm text-luxury-charcoal transition-all placeholder:text-luxury-taupe/60 placeholder:font-light focus-visible:outline-none focus-visible:border-luxury-gold focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 file:border-0 file:bg-transparent file:text-sm file:font-medium",
        className
      )}
      ref={ref}
      {...props} />)
  );
})
Input.displayName = "Input"

export { Input }
