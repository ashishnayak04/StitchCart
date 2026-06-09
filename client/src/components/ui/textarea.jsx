import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    (<textarea
      className={cn(
        "flex min-h-[120px] w-full border border-luxury-beige bg-white px-4 py-3 text-sm text-luxury-charcoal transition-all placeholder:text-luxury-taupe/60 placeholder:font-light focus-visible:outline-none focus-visible:border-luxury-gold focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 resize-none",
        className
      )}
      ref={ref}
      {...props} />)
  );
})
Textarea.displayName = "Textarea"

export { Textarea }
