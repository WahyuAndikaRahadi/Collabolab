'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Toast, ToastType } from '@/lib/toast'

const TOAST_CONFIG: Record<ToastType, {
  icon: string
  accentColor: string
  bgColor: string
}> = {
  success: { icon: '✅', accentColor: '#00D37F', bgColor: '#FFFFFF' },
  error:   { icon: '❌', accentColor: '#FF4D4D', bgColor: '#FFFFFF' },
  warning: { icon: '⚠️', accentColor: '#FFE500', bgColor: '#FFFFFF' },
  info:    { icon: 'ℹ️', accentColor: '#0047FF', bgColor: '#FFFFFF' },
  loading: { icon: '⏳', accentColor: '#999999', bgColor: '#FFFFFF' },
  mention: { icon: '💬', accentColor: '#7C3AED', bgColor: '#FFFFFF' },
}

interface ToastItemProps {
  toast: Toast
  onDismiss: (id: string) => void
}

export function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const [visible, setVisible] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const config = TOAST_CONFIG[toast.type]

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
  }, [])

  const handleDismiss = () => {
    setLeaving(true)
    setTimeout(() => onDismiss(toast.id), 200)
  }

  return (
    <div
      style={{
        backgroundColor: config.bgColor,
        border: '2px solid #000000',
        boxShadow: leaving ? '1px 1px 0px #000' : '3px 3px 0px #000000',
        borderLeft: `4px solid ${config.accentColor}`,
        borderRadius: '8px',
        padding: '12px 16px',
        minWidth: '280px',
        maxWidth: '360px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        transform: visible && !leaving
          ? 'translateX(0) translateY(0)'
          : 'translateX(20px)',
        opacity: visible && !leaving ? 1 : 0,
        transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
        <span style={{ fontSize: '16px', flexShrink: 0, marginTop: '1px' }}>
          {toast.type === 'loading' ? <LoadingDots /> : config.icon}
        </span>
        <div style={{ flex: 1 }}>
          <p style={{
            fontFamily: "var(--font-space-grotesk), sans-serif",
            fontWeight: 700,
            fontSize: '14px',
            color: '#000000',
            margin: 0,
            lineHeight: '1.3',
          }}>
            {toast.title}
          </p>
          {toast.description && (
            <p style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: '12px',
              color: '#3D3D3D',
              margin: '2px 0 0',
              lineHeight: '1.4',
            }}>
              {toast.description}
            </p>
          )}
        </div>
        <button
          onClick={handleDismiss}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            color: '#999',
            padding: '0',
            flexShrink: 0,
            fontWeight: 700,
            lineHeight: 1,
          }}
        >
          ×
        </button>
      </div>

      {toast.actionLabel && toast.actionHref && (
          <Link
            href={toast.actionHref}
            onClick={handleDismiss}
            style={{
              display: 'inline-block',
              marginTop: '6px',
              marginLeft: '24px',
              fontFamily: "var(--font-space-grotesk), sans-serif",
              fontWeight: 700,
              fontSize: '12px',
              color: '#0047FF',
              textDecoration: 'underline',
              cursor: 'pointer',
            }}
          >
            {toast.actionLabel}
          </Link>
      )}
    </div>
  )
}

function LoadingDots() {
  return (
    <span style={{ display: 'inline-flex', gap: '2px', alignItems: 'center' }}>
      {[0, 1, 2].map(i => (
        <span
          key={i}
          style={{
            width: '4px',
            height: '4px',
            borderRadius: '50%',
            backgroundColor: '#999',
            display: 'inline-block',
            animation: `bounce 1s ease-in-out ${i * 0.15}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>
    </span>
  )
}
