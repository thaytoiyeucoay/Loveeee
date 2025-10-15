'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import {
  ArrowLeft,
  Heart,
  Calendar,
  Clock,
  Send,
  Image,
  Video,
  Smile,
  Star,
  Music,
  Gift,
  Coffee,
  Sparkles,
  Save
} from 'lucide-react'

export default function NewMessagePage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    deliveryDate: '',
    deliveryTime: '09:00',
    category: 'love',
    isScheduled: false,
    attachments: [] as File[],
    emoji: '💕'
  })

  const messageCategories = [
    { id: 'love', label: 'Tình yêu', icon: Heart, color: 'from-pink-500 to-rose-500', emoji: '💕' },
    { id: 'anniversary', label: 'Kỷ niệm', icon: Star, color: 'from-yellow-500 to-orange-500', emoji: '🎉' },
    { id: 'encouragement', label: 'Động viên', icon: Sparkles, color: 'from-blue-500 to-cyan-500', emoji: '✨' },
    { id: 'apology', label: 'Xin lỗi', icon: Heart, color: 'from-purple-500 to-pink-500', emoji: '🙏' },
    { id: 'surprise', label: 'Bất ngờ', icon: Gift, color: 'from-green-500 to-teal-500', emoji: '🎁' },
    { id: 'daily', label: 'Hàng ngày', icon: Coffee, color: 'from-amber-500 to-orange-500', emoji: '☀️' }
  ]

  const quickEmojis = ['💕', '❤️', '😘', '🥰', '😍', '🤗', '💖', '💝', '🌹', '✨', '🎉', '🙏', '😊', '🤩', '💐', '🎈']

  const quickMessages = [
    'Em yêu anh nhiều lắm! ❤️',
    'Chúc em một ngày tuyệt vời! ✨',
    'Anh nhớ em rồi! 🥰',
    'Em có khỏe không? 😘',
    'Hôm nay em đẹp quá! 😍',
    'Anh thương em! 💕',
    'Chúc ngủ ngon! 🌙',
    'Chào buổi sáng! ☀️'
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session?.user?.id,
          title: formData.title,
          message: formData.message,
          type: formData.category,
          emoji: formData.emoji,
          isScheduled: formData.isScheduled,
          deliveryDate: formData.deliveryDate,
          deliveryTime: formData.deliveryTime
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create message')
      }

      const result = await response.json()
      console.log('Message created:', result)
      
      // Show success message
      alert('✅ Lời nhắn đã được lưu vào database thành công!')
      
      // Redirect back to messages
      router.push('/dashboard/messages')
    } catch (error) {
      console.error('Error creating message:', error)
      alert('❌ Có lỗi xảy ra khi tạo lời nhắn. Vui lòng thử lại.')
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files]
    }))
  }

  const removeAttachment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }))
  }

  const selectedCategory = messageCategories.find(cat => cat.id === formData.category)

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Tạo lời nhắn mới
            </h1>
            <p className="text-gray-600 mt-1">Gửi tình yêu đến người thương của bạn</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Category Selection */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Chọn loại lời nhắn</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {messageCategories.map((category) => {
                    const Icon = category.icon
                    return (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => setFormData(prev => ({ 
                          ...prev, 
                          category: category.id,
                          emoji: category.emoji 
                        }))}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          formData.category === category.id
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${category.color} flex items-center justify-center mx-auto mb-2`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-sm font-medium text-gray-800">{category.label}</div>
                        <div className="text-lg">{category.emoji}</div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Message Content */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Nội dung lời nhắn</h3>
                
                {/* Title */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tiêu đề
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Nhập tiêu đề cho lời nhắn..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Quick Emojis */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Emoji
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {quickEmojis.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, emoji }))}
                        className={`w-10 h-10 rounded-lg border-2 transition-all ${
                          formData.emoji === emoji
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <span className="text-lg">{emoji}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lời nhắn
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Viết lời nhắn tình yêu của bạn..."
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    required
                  />
                </div>

                {/* Quick Messages */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mẫu tin nhắn nhanh
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {quickMessages.map((msg, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, message: msg }))}
                        className="text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-sm"
                      >
                        {msg}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Attachments */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Đính kèm</h3>
                
                <div className="flex gap-4 mb-4">
                  <label className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors">
                    <Image className="w-4 h-4" />
                    <span className="text-sm font-medium">Hình ảnh</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  
                  <label className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-lg cursor-pointer hover:bg-purple-100 transition-colors">
                    <Video className="w-4 h-4" />
                    <span className="text-sm font-medium">Video</span>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Attachment Preview */}
                {formData.attachments.length > 0 && (
                  <div className="space-y-2">
                    {formData.attachments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          {file.type.startsWith('image/') ? (
                            <Image className="w-5 h-5 text-blue-500" />
                          ) : (
                            <Video className="w-5 h-5 text-purple-500" />
                          )}
                          <span className="text-sm text-gray-700">{file.name}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeAttachment(index)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Xóa
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Delivery Settings */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Cài đặt gửi tin</h3>
                
                <div className="space-y-4">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={formData.isScheduled}
                      onChange={(e) => setFormData(prev => ({ ...prev, isScheduled: e.target.checked }))}
                      className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Lên lịch gửi</span>
                  </label>

                  {formData.isScheduled && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-7">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Ngày gửi
                        </label>
                        <input
                          type="date"
                          value={formData.deliveryDate}
                          onChange={(e) => setFormData(prev => ({ ...prev, deliveryDate: e.target.value }))}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          required={formData.isScheduled}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Giờ gửi
                        </label>
                        <input
                          type="time"
                          value={formData.deliveryTime}
                          onChange={(e) => setFormData(prev => ({ ...prev, deliveryTime: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium rounded-lg hover:from-pink-600 hover:to-purple-600 transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {formData.isScheduled ? 'Lên lịch gửi' : 'Gửi ngay'}
                </button>
              </div>
            </form>
          </motion.div>

          {/* Preview Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Preview Card */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Xem trước</h3>
              
              <div className={`relative p-6 rounded-xl bg-gradient-to-r ${selectedCategory?.color || 'from-pink-500 to-purple-500'} text-white mb-4`}>
                <div className="text-3xl mb-3">{formData.emoji}</div>
                <h4 className="font-semibold mb-2">
                  {formData.title || 'Tiêu đề lời nhắn'}
                </h4>
                <p className="text-sm opacity-90 line-clamp-3">
                  {formData.message || 'Nội dung lời nhắn sẽ hiển thị ở đây...'}
                </p>
                
                {formData.isScheduled && formData.deliveryDate && (
                  <div className="mt-4 text-xs opacity-75 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Gửi vào: {new Date(formData.deliveryDate).toLocaleDateString('vi-VN')} lúc {formData.deliveryTime}
                  </div>
                )}
              </div>

              {formData.attachments.length > 0 && (
                <div className="text-sm text-gray-600 flex items-center gap-1">
                  <Image className="w-4 h-4" />
                  {formData.attachments.length} tệp đính kèm
                </div>
              )}
            </div>

            {/* Tips */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">💡 Gợi ý</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <Heart className="w-4 h-4 text-pink-500 mt-0.5 flex-shrink-0" />
                  <span>Hãy viết từ trái tim, người thương sẽ cảm nhận được tình yêu của bạn</span>
                </li>
                <li className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>Lên lịch gửi vào những ngày đặc biệt để tạo bất ngờ</span>
                </li>
                <li className="flex items-start gap-2">
                  <Image className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Đính kèm hình ảnh để lời nhắn thêm ý nghĩa</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
