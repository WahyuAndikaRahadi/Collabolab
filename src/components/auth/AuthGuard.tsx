'use client'

import { useSession } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useToast } from '@/lib/toast'

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const toast = useToast()
  const [isRedirecting, setIsRedirecting] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated' && !isRedirecting) {
      setIsRedirecting(true)
      toast.error('Akses Ditolak', 'Silakan login terlebih dahulu untuk mengakses halaman ini.')
      
      const callbackUrl = encodeURIComponent(pathname)
      router.push(`/login?callbackUrl=${callbackUrl}`)
    }
  }, [status, router, pathname, toast, isRedirecting])

  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-6 p-8 border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-sm w-full mx-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-black bg-[#FFE500] animate-[spin_2s_linear_infinite]" />
            <div className="absolute inset-0 flex items-center justify-center font-black text-2xl">?</div>
          </div>
          <div className="text-center">
            <h2 className="font-heading font-black text-2xl mb-2 uppercase">Memeriksa Akses</h2>
            <p className="text-gray-600 font-medium">Memastikan kamu punya kunci untuk masuk ke sini...</p>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
