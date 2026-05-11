'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useToast } from '@/lib/toast'

export default function GuestGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const toast = useToast()
  const [isRedirecting, setIsRedirecting] = useState(false)

  useEffect(() => {
    if (status === 'authenticated' && !isRedirecting) {
      setIsRedirecting(true)
      toast.info('Kamu Sudah Login', 'Mengarahkan kembali ke halaman kolaborasi.')
      router.push('/dashboard')
    }
  }, [status, router, toast, isRedirecting])

  // Show loading state or redirect state
  if (status === 'loading' || status === 'authenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-6 p-8 border-4 border-black bg-[#FFE500] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-sm w-full mx-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-black bg-white animate-[bounce_1s_ease-in-out_infinite]" />
            <div className="absolute inset-0 flex items-center justify-center font-black text-2xl">👋</div>
          </div>
          <div className="text-center text-black">
            <h2 className="font-heading font-black text-2xl mb-2 uppercase">Sudah Login</h2>
            <p className="font-medium">Kamu sudah masuk! Gak perlu login lagi kok.</p>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
