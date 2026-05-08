'use client'

import { useEffect, useRef, useState } from 'react'
import { AlertOptions, AlertType } from '@/lib/alert'

const ALERT_CONFIG: Record<AlertType, {
  icon: string
  confirmBg: string
  confirmColor: string
  confirmBorder: string
}> = {
  confirm: {
    icon: '📋',
    confirmBg: '#FFE500',
    confirmColor: '#000000',
    confirmBorder: '#000000',
  },
  danger: {
    icon: '🗑️',
    confirmBg: '#FF4D4D',
    confirmColor: '#FFFFFF',
    confirmBorder: '#000000',
  },
  success: {
    icon: '🎉',
    confirmBg: '#00D37F',
    confirmColor: '#000000',
    confirmBorder: '#000000',
  },
  error: {
    icon: '⛔',
    confirmBg: '#FF4D4D',
    confirmColor: '#FFFFFF',
    confirmBorder: '#000000',
  },
  input: {
    icon: '🔒',
    confirmBg: '#FFE500',
    confirmColor: '#000000',
    confirmBorder: '#000000',
  },
}

interface AlertDialogProps {
  options: AlertOptions
  onClose: (value: boolean | string | null) => void
}

export function AlertDialog({ options, onClose }: AlertDialogProps) {
  const [inputValue, setInputValue] = useState('')
  const [visible, setVisible] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const config = ALERT_CONFIG[options.type]

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
    if (options.type === 'input') {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [options.type])

  const handleConfirm = () => {
    setVisible(false)
    setTimeout(() => {
      if (options.type === 'input') onClose(inputValue || null)
      else onClose(true)
    }, 150)
  }

  const handleCancel = () => {
    setVisible(false)
    setTimeout(() => onClose(false), 150)
  }

  const showCancel = options.type !== 'success' && options.type !== 'error'

  return (
    <div
      id="nb-alert-backdrop"
      onClick={handleCancel}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.15s ease',
      }}
    >
      <div
        id="nb-alert-box"
        onClick={e => e.stopPropagation()}
        style={{
          backgroundColor: '#FFFFFF',
          border: '2px solid #000000',
          boxShadow: visible ? '6px 6px 0px #000000' : '2px 2px 0px #000',
          borderRadius: '12px',
          padding: '28px',
          width: '100%',
          maxWidth: '420px',
          transform: visible ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(8px)',
          transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        <div style={{ marginBottom: '12px' }}>
          <span style={{ fontSize: '28px', display: 'block', marginBottom: '8px' }}>
            {config.icon}
          </span>
          <h2 style={{
            fontFamily: "var(--font-space-grotesk), sans-serif",
            fontWeight: 800,
            fontSize: '20px',
            color: '#000000',
            margin: 0,
            lineHeight: '1.2',
          }}>
            {options.title}
          </h2>
        </div>

        <div style={{
          height: '2px',
          backgroundColor: '#000000',
          marginBottom: '16px'
        }} />

        <p style={{
          fontFamily: "var(--font-inter), sans-serif",
          fontSize: '14px',
          color: '#3D3D3D',
          lineHeight: '1.6',
          margin: '0 0 16px',
        }}>
          {options.description}
        </p>

        {options.extraContent && (
          <div style={{ marginBottom: '16px' }}>
            {options.extraContent}
          </div>
        )}

        {options.type === 'input' && (
          <input
            ref={inputRef}
            id="nb-alert-input"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleConfirm()}
            placeholder={options.inputPlaceholder ?? 'Ketik di sini...'}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '2px solid #000000',
              borderRadius: '6px',
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: '14px',
              outline: 'none',
              boxSizing: 'border-box',
              marginBottom: '16px',
              boxShadow: '2px 2px 0px #000',
            }}
          />
        )}

        <div style={{
          display: 'flex',
          gap: '10px',
          justifyContent: 'flex-end',
        }}>
          {showCancel && (
            <button
              id="nb-alert-cancel-btn"
              onClick={handleCancel}
              style={{
                padding: '10px 20px',
                border: '2px solid #000000',
                borderRadius: '6px',
                backgroundColor: '#F5F0E8',
                fontFamily: "var(--font-space-grotesk), sans-serif",
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer',
                boxShadow: '2px 2px 0px #000',
                transition: 'all 0.1s ease',
              }}
              onMouseEnter={e => {
                (e.target as HTMLElement).style.transform = 'translate(2px, 2px)'
                ;(e.target as HTMLElement).style.boxShadow = 'none'
              }}
              onMouseLeave={e => {
                (e.target as HTMLElement).style.transform = 'none'
                ;(e.target as HTMLElement).style.boxShadow = '2px 2px 0px #000'
              }}
            >
              {options.cancelLabel ?? 'Batal'}
            </button>
          )}
          <button
            id="nb-alert-confirm-btn"
            onClick={handleConfirm}
            style={{
              padding: '10px 20px',
              border: `2px solid ${config.confirmBorder}`,
              borderRadius: '6px',
              backgroundColor: config.confirmBg,
              color: config.confirmColor,
              fontFamily: "var(--font-space-grotesk), sans-serif",
              fontWeight: 800,
              fontSize: '14px',
              cursor: 'pointer',
              boxShadow: '2px 2px 0px #000',
              transition: 'all 0.1s ease',
            }}
            onMouseEnter={e => {
              (e.target as HTMLElement).style.transform = 'translate(2px, 2px)'
              ;(e.target as HTMLElement).style.boxShadow = 'none'
            }}
            onMouseLeave={e => {
              (e.target as HTMLElement).style.transform = 'none'
              ;(e.target as HTMLElement).style.boxShadow = '2px 2px 0px #000'
            }}
          >
            {options.confirmLabel ?? (options.type === 'success' || options.type === 'error' ? 'Tutup' : 'Ya')}
          </button>
        </div>
      </div>
    </div>
  )
}
