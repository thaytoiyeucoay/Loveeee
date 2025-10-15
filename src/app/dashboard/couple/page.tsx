'use client'

import React from 'react'
import CoupleSetup from '@/components/CoupleSetup'
import { useRouter } from 'next/navigation'

export default function CouplePage() {
  const router = useRouter()

  const handleCoupleCreated = () => {
    // Refresh messages page or redirect
    setTimeout(() => {
      router.push('/dashboard/messages')
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 p-6">
      <div className="max-w-2xl mx-auto">
        <CoupleSetup onCoupleCreated={handleCoupleCreated} />
      </div>
    </div>
  )
}
