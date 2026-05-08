'use client'

import { createContext, useContext, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { ToastContainer } from '@/components/ui/toast/ToastContainer'

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading' | 'mention'

export interface Toast {
  id: string
  type: ToastType
  title: string
  description?: string
  actionLabel?: string
  actionHref?: string
  duration?: number
}

interface ToastContextValue {
  toasts: Toast[]
  toast: {
    success: (title: string, description?: string) => string
    error: (title: string, description?: string) => string
    warning: (title: string, description?: string) => string
    info: (title: string, description?: string) => string
    loading: (title: string, description?: string) => string
    mention: (from: string, room: string, project: string, href: string) => string
    dismiss: (id: string) => void
    update: (id: string, data: Partial<Toast>) => void
  }
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const addToast = useCallback((data: Omit<Toast, 'id'>): string => {
    const id = crypto.randomUUID()
    const newToast = { ...data, id }

    setToasts(prev => {
      const updated = [...prev, newToast]
      return updated.length > 4 ? updated.slice(1) : updated
    })

    if (data.type !== 'loading') {
      const duration = data.duration ?? getDuration(data.type)
      setTimeout(() => dismiss(id), duration)
    }

    return id
  }, [dismiss])

  const update = useCallback((id: string, data: Partial<Toast>) => {
    setToasts(prev => prev.map(t => t.id === id ? { ...t, ...data } : t))

    if (data.type && data.type !== 'loading') {
      const duration = getDuration(data.type)
      setTimeout(() => dismiss(id), duration)
    }
  }, [dismiss])

  const toast = {
    success: (title: string, desc?: string) =>
      addToast({ type: 'success', title, description: desc }),
    error: (title: string, desc?: string) =>
      addToast({ type: 'error', title, description: desc }),
    warning: (title: string, desc?: string) =>
      addToast({ type: 'warning', title, description: desc }),
    info: (title: string, desc?: string) =>
      addToast({ type: 'info', title, description: desc }),
    loading: (title: string, desc?: string) =>
      addToast({ type: 'loading', title, description: desc }),
    mention: (from: string, room: string, project: string, href: string) =>
      addToast({
        type: 'mention',
        title: `${from} mention kamu`,
        description: `di ${room} · ${project}`,
        actionLabel: 'Lihat Pesan →',
        actionHref: href,
        duration: 6000
      }),
    dismiss,
    update,
  }

  return (
    <ToastContext.Provider value={{ toasts, toast }}>
      {children}
      {typeof window !== 'undefined' &&
        createPortal(<ToastContainer toasts={toasts} onDismiss={dismiss} />, document.body)
      }
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx.toast
}

function getDuration(type: ToastType): number {
  const durations: Record<ToastType, number> = {
    success: 3000,
    error: 5000,
    warning: 4000,
    info: 3000,
    loading: Infinity,
    mention: 6000,
  }
  return durations[type]
}
