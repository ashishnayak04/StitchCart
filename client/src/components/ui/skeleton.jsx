import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}) {
  return (
    <div
      className={cn(
        "animate-pulse bg-beige/60",
        className
      )}
      {...props} />
  );
}

export { Skeleton }
