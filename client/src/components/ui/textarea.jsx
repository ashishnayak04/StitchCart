import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    (<textarea
      className={cn(
        "flex min-h-[120px] w-full rounded-none border border-stone-200 bg-white px-4 py-3 text-sm transition-all duration-300 placeholder:text-stone-400 placeholder:uppercase placeholder:text-[10px] placeholder:tracking-[0.2em] focus-visible:outline-none focus-visible:border-zinc-950 focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 resize-none",
        className
      )}
      ref={ref}
      {...props} />)
  );
})
Textarea.displayName = "Textarea"

export { Textarea }