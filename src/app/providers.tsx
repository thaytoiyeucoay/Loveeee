'use client'

import { SessionProvider } from 'next-auth/react'
import { ReactNode, useEffect } from 'react'

interface ProvidersProps {
  children: ReactNode
}

export default function Providers({ children }: ProvidersProps) {
  // Register PWA Service Worker in production
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!('serviceWorker' in navigator)) return
    if (process.env.NODE_ENV !== 'production') return

    const swUrl = '/sw.js'
    navigator.serviceWorker
      .register(swUrl)
      .then(() => {
        // console.log('Service Worker registered:', registration)
      })
      .catch((err) => {
        console.warn('Service Worker registration failed:', err)
      })
  }, [])

  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  )
}
