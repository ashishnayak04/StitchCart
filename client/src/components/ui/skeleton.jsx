import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-none bg-stone-100/80", 
        className
      )}
      {...props} />
  );
}

export { Skeleton }