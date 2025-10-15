'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { useRealTimeSync } from '@/hooks/useRealTimeSync'
import {
  Heart,
  Calendar,
  Camera,
  Star,
  MessageCircle,
  TrendingUp,
  MapPin,
  Smile,
  Gift,
  Clock,
  Plus,
  ChevronRight,
  Users
} from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const { data: session } = useSession()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [stats, setStats] = useState({
    relationshipDays: 0,
    diaryEntries: 0,
    bucketListCompleted: 0,
    totalBucketList: 0,
    upcomingEvents: 0,
    moodAverage: 0,
    messagesCount: 0
  })
  const [couple, setCouple] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Fetch real data from APIs
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!session?.user?.id) return

      try {
        // Fetch couple info
        const coupleResponse = await fetch(`/api/couples?userId=${session.user.id}`)
        if (coupleResponse.ok) {
          const coupleData = await coupleResponse.json()
          setCouple(coupleData.couple)
          
          if (coupleData.couple) {
            // Calculate relationship days
            const relationshipStart = new Date(coupleData.couple.relationshipStart)
            const today = new Date()
            const relationshipDays = Math.floor((today.getTime() - relationshipStart.getTime()) / (1000 * 60 * 60 * 24))
            
            // Fetch messages count
            const messagesResponse = await fetch(`/api/messages?userId=${session.user.id}`)
            let messagesCount = 0
            if (messagesResponse.ok) {
              const messagesData = await messagesResponse.json()
              messagesCount = messagesData.messages?.length || 0
            }

            // Fetch diary entries count
            const diaryResponse = await fetch(`/api/diary?userId=${session.user.id}`)
            let diaryEntries = 0
            if (diaryResponse.ok) {
              const diaryData = await diaryResponse.json()
              diaryEntries = diaryData.entries?.length || 0

              // Fetch bucket list stats
              const bucketResponse = await fetch(`/api/bucket-list?userId=${session.user.id}`)
              let bucketListCompleted = 0
              let totalBucketList = 0
              if (bucketResponse.ok) {
                const bucketData = await bucketResponse.json()
                totalBucketList = bucketData.items?.length || 0
                bucketListCompleted = bucketData.items?.filter((item: any) => item.isCompleted).length || 0
              }

              // Fetch upcoming events
              const eventsResponse = await fetch(`/api/events?userId=${session.user.id}`)
              let upcomingEvents = 0
              if (eventsResponse.ok) {
                const eventsData = await eventsResponse.json()
                const today = new Date()
                upcomingEvents = eventsData.events?.filter((event: any) => 
                  new Date(event.startDate) >= today
                ).length || 0
              }

              setStats(prev => ({
                ...prev,
                relationshipDays,
                messagesCount,
                diaryEntries,
                bucketListCompleted,
                totalBucketList,
                upcomingEvents,
                moodAverage: 0 // TODO: Implement mood tracking
              }))
            }
          }
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [session])

  // Real-time sync for couple data changes
  useRealTimeSync('/api/couples', {
    onDataChange: (data) => {
      if (data.couple && data.couple !== couple) {
        setCouple(data.couple)
        
        // Recalculate relationship days if couple data changed
        if (data.couple.relationshipStart) {
          const relationshipStart = new Date(data.couple.relationshipStart)
          const today = new Date()
          const relationshipDays = Math.floor((today.getTime() - relationshipStart.getTime()) / (1000 * 60 * 60 * 24))
          
          setStats(prev => ({ ...prev, relationshipDays }))
        }
      }
    },
    syncInterval: 10000 // Sync every 10 seconds
  })

  // Show no couple message if user hasn't setup couple
  if (!loading && !couple) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Chào mừng đến với Loveeee! 💕
          </h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Để bắt đầu sử dụng ứng dụng, bạn cần thiết lập couple với người yêu của mình.
          </p>
          <Link href="/dashboard/couple" className="btn-primary inline-flex items-center gap-2">
            <Users className="w-5 h-5" />
            Thiết lập Couple
          </Link>
        </div>
      </div>
    )
  }

  const partner = couple ? (couple.user1.id === session?.user?.id ? couple.user2 : couple.user1) : null

  // Real data only - no mock activities or events for now
  const recentActivities: any[] = [] // TODO: Implement activity tracking

  const quickActions = [
    { 
      href: '/dashboard/chat', 
      icon: MessageCircle, 
      label: 'Chat ngay',
      color: 'from-green-500 to-blue-500'
    },
    { 
      href: '/dashboard/diary/new', 
      icon: Camera, 
      label: 'Thêm nhật ký',
      color: 'from-purple-500 to-pink-500'
    },
    { 
      href: '/dashboard/bucket-list/new', 
      icon: Star, 
      label: 'Bucket List',
      color: 'from-yellow-500 to-orange-500'
    },
    { 
      href: '/dashboard/calendar/new', 
      icon: Calendar, 
      label: 'Tạo lịch hẹn',
      color: 'from-blue-500 to-indigo-500'
    },
    { 
      href: '/dashboard/messages/new', 
      icon: MessageCircle, 
      label: 'Gửi lời nhắn',
      color: 'from-pink-500 to-red-500'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card bg-gradient-to-r from-primary-500 to-secondary-500 text-white"
      >
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Chào buổi {getTimeOfDay()}! ❤️</h1>
            <p className="text-lg opacity-90 mb-4">
              Hôm nay là ngày thứ <span className="font-bold">{stats.relationshipDays}</span> bạn và người yêu bên nhau
            </p>
            <div className="text-2xl font-mono bg-white bg-opacity-20 backdrop-blur rounded-lg px-4 py-2 inline-block">
              {currentTime.toLocaleTimeString('vi-VN')}
            </div>
          </div>
          <div className="mt-6 lg:mt-0">
            <div className="flex items-center gap-2">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center animate-float">
                <Heart className="w-8 h-8 text-white heartbeat" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card text-center"
        >
          <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-1">{stats.relationshipDays}</div>
          <div className="text-sm text-gray-600">Ngày yêu nhau</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card text-center"
        >
          <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-3">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-1">{stats.messagesCount}</div>
          <div className="text-sm text-gray-600">Lời nhắn</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card text-center"
        >
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Camera className="w-6 h-6 text-white" />
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-1">{stats.diaryEntries}</div>
          <div className="text-sm text-gray-600">Nhật ký</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card text-center"
        >
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Star className="w-6 h-6 text-white" />
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-1">{stats.bucketListCompleted}/{stats.totalBucketList}</div>
          <div className="text-sm text-gray-600">Bucket List</div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="card"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary-600" />
            Hành động nhanh
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                href={action.href}
                className="p-4 rounded-xl bg-gradient-to-r hover:shadow-lg transform hover:scale-105 transition-all duration-200 text-center group"
                style={{
                  background: `linear-gradient(135deg, ${action.color.includes('purple') ? '#8b5cf6' : action.color.includes('yellow') ? '#eab308' : action.color.includes('blue') ? '#3b82f6' : '#ec4899'}, ${action.color.includes('pink') ? '#ec4899' : action.color.includes('orange') ? '#f97316' : action.color.includes('purple') ? '#8b5cf6' : '#ef4444'})`
                }}
              >
                <action.icon className="w-8 h-8 text-white mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <div className="text-white font-medium text-sm">{action.label}</div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Upcoming Events */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="card"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary-600" />
            Sự kiện sắp tới
          </h2>
          <div className="space-y-4">
            {stats.upcomingEvents === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>Chưa có sự kiện nào sắp tới</p>
                <Link href="/dashboard/calendar/new" className="text-primary-600 hover:text-primary-700 text-sm">
                  Tạo sự kiện mới
                </Link>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-700">
                <Calendar className="w-12 h-12 mx-auto mb-2 text-primary-500" />
                <p className="font-semibold">{stats.upcomingEvents} sự kiện sắp tới</p>
                <Link href="/dashboard/calendar" className="text-primary-600 hover:text-primary-700 text-sm">
                  Xem tất cả
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Recent Activities */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="card"
      >
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary-600" />
          Hoạt động gần đây
        </h2>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activity.color}`}>
                <activity.icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-800">{activity.title}</div>
                <div className="text-sm text-gray-600">{activity.author} • {activity.time}</div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

function getTimeOfDay() {
  const hour = new Date().getHours()
  if (hour < 12) return 'sáng'
  if (hour < 18) return 'chiều'
  return 'tối'
}
