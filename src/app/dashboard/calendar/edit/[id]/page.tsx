'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter, useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import {
  ArrowLeft,
  Save,
  Calendar,
  Clock,
  MapPin,
  Bell,
  Repeat,
  Heart,
  Gift,
  Coffee,
  Utensils,
  Camera,
  Music,
  Plane,
  Users,
  Trash2
} from 'lucide-react'
import Link from 'next/link'

export default function EditEventPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const params = useParams()
  const eventId = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Form data
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [eventTime, setEventTime] = useState('')
  const [location, setLocation] = useState('')
  const [category, setCategory] = useState('date')
  const [reminderBefore, setReminderBefore] = useState('30')
  const [isRecurring, setIsRecurring] = useState(false)

  const eventTypes = [
    { id: 'date', label: 'Hẹn hò', icon: Heart, color: 'bg-pink-100 text-pink-800' },
    { id: 'anniversary', label: 'Kỷ niệm', icon: Gift, color: 'bg-red-100 text-red-800' },
    { id: 'food', label: 'Ăn uống', icon: Utensils, color: 'bg-orange-100 text-orange-800' },
    { id: 'coffee', label: 'Café', icon: Coffee, color: 'bg-yellow-100 text-yellow-800' },
    { id: 'activity', label: 'Hoạt động', icon: Users, color: 'bg-blue-100 text-blue-800' },
    { id: 'photo', label: 'Chụp ảnh', icon: Camera, color: 'bg-green-100 text-green-800' },
    { id: 'music', label: 'Âm nhạc', icon: Music, color: 'bg-purple-100 text-purple-800' },
    { id: 'travel', label: 'Du lịch', icon: Plane, color: 'bg-indigo-100 text-indigo-800' },
  ]

  const reminderOptions = [
    { value: '5', label: '5 phút trước' },
    { value: '15', label: '15 phút trước' },
    { value: '30', label: '30 phút trước' },
    { value: '60', label: '1 giờ trước' },
    { value: '120', label: '2 giờ trước' },
    { value: '1440', label: '1 ngày trước' },
    { value: '10080', label: '1 tuần trước' },
  ]

  // Fetch event data
  useEffect(() => {
    const fetchEvent = async () => {
      if (!session?.user?.id || !eventId) return

      try {
        const response = await fetch(`/api/events?userId=${session.user.id}`)
        if (response.ok) {
          const data = await response.json()
          const event = data.events?.find((e: any) => e.id === eventId)
          
          if (event) {
            setTitle(event.title || '')
            setDescription(event.description || '')
            
            // Parse date and time with proper timezone handling
            const eventDateTime = new Date(event.startDate)
            setEventDate(eventDateTime.toLocaleDateString('en-CA')) // YYYY-MM-DD format in local timezone
            setEventTime(eventDateTime.toTimeString().slice(0, 5))
            
            setLocation(event.location || '')
            setCategory(event.type || 'date')
            setIsRecurring(event.isRecurring || false)
            
            // Calculate reminder time
            if (event.reminder) {
              const reminderTime = new Date(event.reminder)
              const eventTime = new Date(event.startDate)
              const diffMinutes = (eventTime.getTime() - reminderTime.getTime()) / (1000 * 60)
              setReminderBefore(diffMinutes.toString())
            }
          } else {
            setError('Không tìm thấy sự kiện')
          }
        }
      } catch (error) {
        console.error('Error fetching event:', error)
        setError('Lỗi khi tải thông tin sự kiện')
      } finally {
        setLoading(false)
      }
    }

    fetchEvent()
  }, [session, eventId])

  const handleSave = async () => {
    if (!title || !eventDate) {
      setError('Vui lòng điền tiêu đề và ngày sự kiện')
      return
    }

    setSaving(true)
    setError('')
    
    try {
      const response = await fetch('/api/events', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          eventId,
          userId: session?.user?.id,
          title,
          description,
          eventDate,
          eventTime,
          location,
          category,
          isRecurring,
          reminderBefore: parseInt(reminderBefore)
        })
      })

      const result = await response.json()

      if (response.ok) {
        setSuccess('✅ ' + result.message)
        setTimeout(() => {
          router.push('/dashboard/calendar')
        }, 1500)
      } else {
        throw new Error(result.error)
      }
    } catch (error: any) {
      setError('❌ ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Bạn có chắc chắn muốn xóa sự kiện này?')) return

    setDeleting(true)
    setError('')
    
    try {
      const response = await fetch(`/api/events?eventId=${eventId}&userId=${session?.user?.id}`, {
        method: 'DELETE'
      })

      const result = await response.json()

      if (response.ok) {
        setSuccess('✅ ' + result.message)
        setTimeout(() => {
          router.push('/dashboard/calendar')
        }, 1500)
      } else {
        throw new Error(result.error)
      }
    } catch (error: any) {
      setError('❌ ' + error.message)
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <span className="ml-2 text-gray-600">Đang tải sự kiện...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href="/dashboard/calendar"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Chỉnh sửa sự kiện</h1>
            <p className="text-gray-600">Cập nhật thông tin lịch hẹn</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            {deleting ? 'Đang xóa...' : 'Xóa'}
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !title.trim() || !eventDate}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </div>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}
      
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Thông tin cơ bản</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tên sự kiện *</label>
                <input
                  type="text"
                  placeholder="VD: Dinner romantic tại nhà hàng ABC"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
                <textarea
                  rows={3}
                  placeholder="Mô tả chi tiết về sự kiện..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>
          </motion.div>

          {/* Date & Time */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Thời gian
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ngày sự kiện *</label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Giờ</label>
                <input
                  type="time"
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>
          </motion.div>

          {/* Location */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Địa điểm
            </h3>
            <input
              type="text"
              placeholder="VD: Nhà hàng The Deck, Café Trung Nguyên..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="input-field"
            />
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Event Type */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Loại sự kiện</h3>
            <div className="grid grid-cols-2 gap-2">
              {eventTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setCategory(type.id)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    category === type.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <type.icon className="w-5 h-5 mx-auto mb-2 text-gray-600" />
                  <div className="text-xs font-medium text-gray-700">{type.label}</div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Reminder */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="card"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Nhắc nhở
            </h3>
            <select
              value={reminderBefore}
              onChange={(e) => setReminderBefore(e.target.value)}
              className="input-field"
            >
              {reminderOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </motion.div>

          {/* Recurring */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Repeat className="w-5 h-5" />
              Lặp lại
            </h3>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
              />
              <span className="text-gray-700">Sự kiện lặp lại</span>
            </label>

            {isRecurring && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Tần suất lặp lại</label>
                <select className="input-field">
                  <option value="weekly">Hàng tuần</option>
                  <option value="monthly">Hàng tháng</option>
                  <option value="yearly">Hàng năm</option>
                </select>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
