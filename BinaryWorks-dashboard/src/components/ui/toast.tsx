import { useEffect } from "react"
import { X, CheckCircle, XCircle, AlertCircle, Info } from "lucide-react"
import { clsx } from "clsx"

export interface Toast {
  id: string
  type: "success" | "error" | "warning" | "info"
  message: string
  duration?: number
}

interface ToastItemProps {
  toast: Toast
  onClose: (id: string) => void
}

export function ToastItem({ toast, onClose }: ToastItemProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id)
    }, toast.duration || 5000)

    return () => clearTimeout(timer)
  }, [toast.id, toast.duration, onClose])

  const icons = {
    success: <CheckCircle className="h-5 w-5" />,
    error: <XCircle className="h-5 w-5" />,
    warning: <AlertCircle className="h-5 w-5" />,
    info: <Info className="h-5 w-5" />
  }

  const styles = {
    success: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200",
    error: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200",
    warning: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200",
    info: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200"
  }

  return (
    <div
      className={clsx(
        "flex items-center gap-3 p-4 rounded-lg border shadow-lg backdrop-blur-sm animate-slide-in-right",
        styles[toast.type]
      )}
    >
      <div className="flex-shrink-0">
        {icons[toast.type]}
      </div>
      <p className="flex-1 text-sm font-medium">
        {toast.message}
      </p>
      <button
        onClick={() => onClose(toast.id)}
        className="flex-shrink-0 hover:opacity-70 transition-opacity"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

interface ToastContainerProps {
  toasts: Toast[]
  onClose: (id: string) => void
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none">
      <div className="flex flex-col gap-2 pointer-events-auto">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={onClose} />
        ))}
      </div>
    </div>
  )
}
