'use client'

import { createContext, useContext, useState } from 'react'
import { AlertDialog } from '@/components/ui/alert/AlertDialog'

export type AlertType = 'confirm' | 'danger' | 'success' | 'error' | 'input'

export interface AlertOptions {
  type: AlertType
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  inputPlaceholder?: string
  extraContent?: React.ReactNode
}

interface AlertContextValue {
  alert: {
    confirm: (opts: Omit<AlertOptions, 'type'>) => Promise<boolean>
    danger: (opts: Omit<AlertOptions, 'type'>) => Promise<boolean>
    success: (opts: Omit<AlertOptions, 'type'>) => Promise<void>
    error: (opts: Omit<AlertOptions, 'type'>) => Promise<void>
    input: (opts: Omit<AlertOptions, 'type'>) => Promise<string | null>
  }
}

const AlertContext = createContext<AlertContextValue | null>(null)

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [queue, setQueue] = useState<{
    options: AlertOptions
    resolve: (value: boolean | string | null) => void
  } | null>(null)

  const show = (options: AlertOptions) => {
    return new Promise<boolean | string | null>(resolve => {
      setQueue({ options, resolve })
    })
  }

  const handleClose = (value: boolean | string | null) => {
    queue?.resolve(value)
    setQueue(null)
  }

  const alert = {
    confirm: (opts: Omit<AlertOptions, 'type'>) =>
      show({ ...opts, type: 'confirm' }) as Promise<boolean>,
    danger: (opts: Omit<AlertOptions, 'type'>) =>
      show({ ...opts, type: 'danger' }) as Promise<boolean>,
    success: (opts: Omit<AlertOptions, 'type'>) =>
      show({ ...opts, type: 'success' }).then(() => {}),
    error: (opts: Omit<AlertOptions, 'type'>) =>
      show({ ...opts, type: 'error' }).then(() => {}),
    input: (opts: Omit<AlertOptions, 'type'>) =>
      show({ ...opts, type: 'input' }) as Promise<string | null>,
  }

  return (
    <AlertContext.Provider value={{ alert }}>
      {children}
      {queue && (
        <AlertDialog
          options={queue.options}
          onClose={handleClose}
        />
      )}
    </AlertContext.Provider>
  )
}

export function useAlert() {
  const ctx = useContext(AlertContext)
  if (!ctx) throw new Error('useAlert must be used within AlertProvider')
  return ctx.alert
}
