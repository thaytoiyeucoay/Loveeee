'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { 
  Heart, 
  Mail, 
  Users, 
  UserPlus, 
  Check, 
  AlertCircle,
  ArrowRight,
  Calendar
} from 'lucide-react'

interface CoupleSetupProps {
  onCoupleCreated?: () => void
}

export default function CoupleSetup({ onCoupleCreated }: CoupleSetupProps) {
  const { data: session } = useSession()
  const [step, setStep] = useState<'check' | 'setup' | 'success'>('check')
  const [couple, setCouple] = useState<any>(null)
  const [partnerEmail, setPartnerEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Check if user already has couple
  useEffect(() => {
    const checkCouple = async () => {
      if (!session?.user?.id) return

      try {
        const response = await fetch(`/api/couples?userId=${session.user.id}`)
        if (response.ok) {
          const data = await response.json()
          if (data.couple) {
            setCouple(data.couple)
            setStep('success')
          } else {
            setStep('setup')
          }
        }
      } catch (error) {
        console.error('Error checking couple:', error)
        setStep('setup')
      }
    }

    checkCouple()
  }, [session])

  const handleCreateCouple = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/couples', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session?.user?.id,
          partnerEmail,
          action: 'create'
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Có lỗi xảy ra')
      }

      setCouple(data.couple)
      setStep('success')
      onCoupleCreated?.()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (step === 'check') {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang kiểm tra thông tin couple...</p>
        </div>
      </div>
    )
  }

  if (step === 'success' && couple) {
    const partner = couple.user1.id === session?.user?.id ? couple.user2 : couple.user1
    const relationshipDays = Math.floor(
      (new Date().getTime() - new Date(couple.relationshipStart).getTime()) / (1000 * 60 * 60 * 24)
    )

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-8 text-center"
      >
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          💕 Couple đã được thiết lập!
        </h3>
        
        <p className="text-gray-600 mb-6">
          Bạn đã kết nối thành công với <strong>{partner.name}</strong>
        </p>

        <div className="bg-white rounded-xl p-4 mb-6">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="text-center">
              <img 
                src={session?.user?.image || '/avatars/default.jpg'} 
                alt={session?.user?.name || 'You'} 
                className="w-12 h-12 rounded-full mx-auto mb-2"
              />
              <p className="text-sm font-medium">{session?.user?.name}</p>
            </div>
            <Heart className="w-6 h-6 text-red-500" />
            <div className="text-center">
              <img 
                src={partner.avatar || '/avatars/default.jpg'} 
                alt={partner.name} 
                className="w-12 h-12 rounded-full mx-auto mb-2"
              />
              <p className="text-sm font-medium">{partner.name}</p>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>{relationshipDays} ngày yêu nhau</span>
          </div>
        </div>

        <p className="text-sm text-gray-500">
          Giờ bạn có thể tạo và chia sẻ những khoảnh khắc tình yêu cùng nhau! 💖
        </p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-xl p-8"
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Users className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Thiết lập Couple
        </h2>
        <p className="text-gray-600">
          Kết nối với người yêu để chia sẻ những khoảnh khắc đặc biệt
        </p>
      </div>

      <form onSubmit={handleCreateCouple} className="space-y-6">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email của người yêu *
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="email"
              value={partnerEmail}
              onChange={(e) => setPartnerEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="partner@example.com"
              required
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Người này phải đã có tài khoản Loveeee
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium rounded-lg hover:from-pink-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Đang kết nối...
            </>
          ) : (
            <>
              <UserPlus className="w-5 h-5" />
              Tạo Couple
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="text-sm font-medium text-blue-900 mb-2">💡 Lưu ý:</h4>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• Mỗi người chỉ có thể có 1 couple duy nhất</li>
          <li>• Người yêu phải đã đăng ký tài khoản Loveeee</li>
          <li>• Sau khi tạo couple, cả hai sẽ chia sẻ dữ liệu tình yêu</li>
          <li>• Dữ liệu cá nhân vẫn riêng tư theo từng tài khoản</li>
        </ul>
      </div>
    </motion.div>
  )
}
