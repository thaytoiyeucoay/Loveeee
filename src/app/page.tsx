'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Heart, 
  Calendar, 
  MapPin, 
  MessageCircle, 
  Camera, 
  Wallet,
  Users,
  Star,
  ChevronRight,
  Download,
  Smartphone
} from 'lucide-react'

export default function HomePage() {
  const [isInstallable, setIsInstallable] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setIsInstallable(true)
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null)
      setIsInstallable(false)
    }
  }

  const features = [
    {
      icon: MessageCircle,
      title: 'Lời nhắn tình yêu',
      description: 'Gửi lời nhắn ngọt ngào hàng ngày và đếm ngược kỷ niệm',
      color: 'from-pink-500 to-rose-500'
    },
    {
      icon: Camera,
      title: 'Nhật ký tình yêu',
      description: 'Ghi lại những khoảnh khắc đẹp nhất với ảnh và video',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Star,
      title: 'Bucket List',
      description: 'Danh sách những điều muốn làm cùng nhau',
      color: 'from-orange-500 to-yellow-500'
    },
    {
      icon: Calendar,
      title: 'Lịch hẹn hò thông minh',
      description: 'Lên kế hoạch date night và đồng bộ lịch',
      color: 'from-blue-500 to-purple-500'
    },
    {
      icon: Users,
      title: 'Trò chơi tìm hiểu',
      description: 'Câu hỏi vui nhộn để hiểu nhau hơn',
      color: 'from-green-500 to-blue-500'
    },
    {
      icon: Wallet,
      title: 'Quản lý tài chính',
      description: 'Theo dõi chi tiêu và tiết kiệm cho tương lai',
      color: 'from-emerald-500 to-green-500'
    },
    {
      icon: MapPin,
      title: 'Bản đồ kỷ niệm',
      description: 'Đánh dấu những nơi đã đến cùng nhau',
      color: 'from-red-500 to-pink-500'
    },
    {
      icon: Heart,
      title: 'Theo dõi tâm trạng',
      description: 'Hiểu cảm xúc và quan tâm nhau mỗi ngày',
      color: 'from-pink-500 to-red-500'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50 min-h-screen flex items-center">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <div className="inline-flex items-center gap-2 mb-6">
                <Heart className="w-12 h-12 text-primary-500 heartbeat" />
                <h1 className="text-6xl font-bold gradient-text">Loveeee</h1>
              </div>
              <p className="text-2xl text-gray-600 mb-8">
                Ứng dụng tình yêu dành riêng cho các cặp đôi
              </p>
              <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-12">
                Ghi lại những khoảnh khắc đẹp nhất, lên kế hoạch cho tương lai, 
                và tạo dựng mối quan hệ bền vững với người bạn yêu thương nhất.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            >
              <Link href="/auth/signup" className="btn-primary inline-flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Bắt đầu hành trình tình yêu
                <ChevronRight className="w-5 h-5" />
              </Link>
              
              {isInstallable && (
                <button
                  onClick={handleInstall}
                  className="btn-secondary inline-flex items-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Cài đặt ứng dụng
                </button>
              )}
            </motion.div>

            {/* App Preview */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative max-w-md mx-auto"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-[3rem] opacity-20 blur-xl"></div>
                <div className="relative bg-white rounded-[3rem] p-2 shadow-2xl">
                  <div className="bg-gray-900 rounded-[2.5rem] aspect-[9/19] flex items-center justify-center">
                    <div className="text-center text-white p-8">
                      <Smartphone className="w-16 h-16 mx-auto mb-4 text-primary-300" />
                      <p className="text-sm opacity-75">Giao diện ứng dụng<br />sẽ hiển thị tại đây</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Tính năng đặc biệt
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Khám phá những tính năng tuyệt vời được thiết kế đặc biệt 
              để tăng cường tình yêu và sự kết nối giữa hai bạn.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card card-hover group"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} p-3 mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-500 to-secondary-500">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-white"
          >
            <h2 className="text-4xl font-bold mb-6">
              Sẵn sàng bắt đầu hành trình tình yêu?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Tham gia cùng hàng nghìn cặp đôi đã tìm thấy hạnh phúc 
              và sự kết nối sâu sắc hơn với Loveeee.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register" className="bg-white text-primary-600 font-medium py-4 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                Tạo tài khoản miễn phí
              </Link>
              <Link href="/auth/login" className="border-2 border-white text-white font-medium py-4 px-8 rounded-full hover:bg-white hover:text-primary-600 transition-all duration-200">
                Đăng nhập
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Heart className="w-8 h-8 text-primary-500" />
              <h3 className="text-2xl font-bold">Loveeee</h3>
            </div>
            <p className="text-gray-400 mb-6">
              Ứng dụng tình yêu dành riêng cho các cặp đôi
            </p>
            <div className="flex justify-center gap-6 text-sm text-gray-400">
              <Link href="/privacy" className="hover:text-white transition-colors">
                Chính sách bảo mật
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Điều khoản sử dụng
              </Link>
              <Link href="/contact" className="hover:text-white transition-colors">
                Liên hệ
              </Link>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-800 text-gray-500 text-sm">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>© 2024 Loveeee. Tất cả quyền được bảo lưu.</div>
                <div className="flex items-center gap-4 text-xs">
                  <span>💻 Made with Next.js</span>
                  <span>📱 PWA Ready</span>
                  <span>🎨 Tailwind CSS</span>
                  <span>❤️ Made for Love</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
