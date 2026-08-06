import { AlertTriangle, CheckCircle2 } from "lucide-react"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

function ToastStatusIcon({ variant }) {
  if (variant === "success") {
    return <CheckCircle2 className="h-5 w-5 shrink-0 text-success-foreground" aria-hidden="true" />
  }
  if (variant === "destructive") {
    return <AlertTriangle className="h-5 w-5 shrink-0 text-primary-foreground" aria-hidden="true" />
  }
  return null
}

export function Toaster() {
  const { toasts } = useToast()

  return (
    (<ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        return (
          (<Toast key={id} variant={variant} {...props}>
            <div className="flex items-start gap-3">
              <ToastStatusIcon variant={variant} />
              <div className={cn("grid gap-1.5")}>
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>)
        );
      })}
      <ToastViewport />
    </ToastProvider>)
  );
}
