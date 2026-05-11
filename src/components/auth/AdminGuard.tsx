'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useToast } from '@/lib/toast'

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const toast = useToast()
  const [isRedirecting, setIsRedirecting] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated' && !isRedirecting) {
      setIsRedirecting(true)
      toast.error('Akses Ditolak', 'Silakan login terlebih dahulu.')
      router.push('/login')
    } else if (status === 'authenticated' && session?.user?.role !== 'ADMIN' && !isRedirecting) {
      setIsRedirecting(true)
      toast.error('Akses Terlarang', 'Hanya Admin yang diizinkan masuk ke area ini.')
      router.push('/403')
    }
  }, [status, session, router, toast, isRedirecting])

  if (status === 'loading' || isRedirecting || (status === 'authenticated' && session?.user?.role !== 'ADMIN')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FF4D4D]">
        <div className="flex flex-col items-center gap-6 p-8 border-4 border-black bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] max-w-sm w-full mx-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-black bg-[#FFE500] animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center font-black text-2xl">🛡️</div>
          </div>
          <div className="text-center text-black">
            <h2 className="font-heading font-black text-2xl mb-2 uppercase">Verifikasi Admin</h2>
            <p className="font-medium">Memeriksa kredensial akses tingkat tinggi...</p>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
