import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}) {
  return (
    <div
      className={cn(
        "animate-pulse bg-luxury-beige/40",
        className
      )}
      {...props} />
  );
}

export { Skeleton }
