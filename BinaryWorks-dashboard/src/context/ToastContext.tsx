import { createContext, useContext, useState, useCallback, ReactNode } from "react"
import { ToastContainer, Toast } from "@/components/ui/toast"

interface ToastContextType {
  showSuccess: (message: string, duration?: number) => void
  showError: (message: string, duration?: number) => void
  showWarning: (message: string, duration?: number) => void
  showInfo: (message: string, duration?: number) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { ...toast, id }])
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const showSuccess = useCallback((message: string, duration?: number) => {
    addToast({ type: "success", message, duration })
  }, [addToast])

  const showError = useCallback((message: string, duration?: number) => {
    addToast({ type: "error", message, duration })
  }, [addToast])

  const showWarning = useCallback((message: string, duration?: number) => {
    addToast({ type: "warning", message, duration })
  }, [addToast])

  const showInfo = useCallback((message: string, duration?: number) => {
    addToast({ type: "info", message, duration })
  }, [addToast])

  return (
    <ToastContext.Provider value={{ showSuccess, showError, showWarning, showInfo }}>
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}
