'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import {
  Heart,
  Send,
  Calendar,
  Clock,
  MessageCircle,
  Star,
  Gift,
  Sparkles,
  Plus,
  Edit3,
  Trash2,
  Users,
  X
} from 'lucide-react'
import Link from 'next/link'

export default function MessagesPage() {
  const { data: session } = useSession()
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [hasCouple, setHasCouple] = useState(false)
  const [editingMessage, setEditingMessage] = useState<any>(null)
  const [editForm, setEditForm] = useState({ title: '', content: '', emoji: '💕', type: 'daily' })

  // Fetch messages for current user
  useEffect(() => {
    const fetchData = async () => {
      if (!session?.user?.id) return
      
      try {
        // Check if user has couple
        const coupleResponse = await fetch(`/api/couples?userId=${session.user.id}`)
        if (coupleResponse.ok) {
          const coupleData = await coupleResponse.json()
          setHasCouple(!!coupleData.couple)
          
          if (coupleData.couple) {
            // Fetch messages if has couple
            const messagesResponse = await fetch(`/api/messages?userId=${session.user.id}`)
            if (messagesResponse.ok) {
              const messagesData = await messagesResponse.json()
              setMessages(messagesData.messages || [])
            }
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [session])

  // Countdown to anniversary
  useEffect(() => {
    const anniversaryDate = new Date('2024-12-25') // Mock anniversary date
    
    const timer = setInterval(() => {
      const now = new Date()
      const difference = anniversaryDate.getTime() - now.getTime()
      
      if (difference > 0) {
        setCountdown({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [session])

  // Edit message function
  const handleEditMessage = (message: any) => {
    // Parse the message content to extract title and content
    const lines = message.message.split('\n\n')
    const titleLine = lines[0] || message.message
    const content = lines.slice(1).join('\n\n') || message.message
    
    // Simple emoji extraction - get first emoji character
    const emoji = titleLine.charAt(0).match(/[^\w\s]/) ? titleLine.charAt(0) : '💕'
    const title = titleLine.replace(/^[^\w\s]\s*/, '').trim()
    
    setEditingMessage(message)
    setEditForm({
      title: title || 'Love Message',
      content: content || message.message,
      emoji: emoji,
      type: message.type
    })
  }

  // Update message function
  const handleUpdateMessage = async () => {
    if (!editingMessage) return

    try {
      const response = await fetch('/api/messages', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messageId: editingMessage.id,
          userId: session?.user?.id,
          message: editForm.content,
          title: editForm.title,
          emoji: editForm.emoji,
          type: editForm.type
        })
      })

      if (response.ok) {
        // Refresh messages
        const messagesResponse = await fetch(`/api/messages?userId=${session?.user?.id}`)
        if (messagesResponse.ok) {
          const messagesData = await messagesResponse.json()
          setMessages(messagesData.messages || [])
        }
        setEditingMessage(null)
        alert('✅ Message updated successfully!')
      } else {
        const error = await response.json()
        alert('❌ ' + error.error)
      }
    } catch (error) {
      console.error('Error updating message:', error)
      alert('❌ Failed to update message')
    }
  }

  // Delete message function
  const handleDeleteMessage = async (messageId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa message này?')) return

    try {
      const response = await fetch(`/api/messages?messageId=${messageId}&userId=${session?.user?.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        // Remove from local state
        setMessages(prev => prev.filter(m => m.id !== messageId))
        alert('✅ Message deleted successfully!')
      } else {
        const error = await response.json()
        alert('❌ ' + error.error)
      }
    } catch (error) {
      console.error('Error deleting message:', error)
      alert('❌ Failed to delete message')
    }
  }

  const categories = [
    { id: 'all', label: 'Tất cả', icon: MessageCircle },
    { id: 'daily', label: 'Hàng ngày', icon: Heart },
    { id: 'anniversary', label: 'Kỷ niệm', icon: Star },
    { id: 'special', label: 'Đặc biệt', icon: Gift }
  ]

  const displayMessages = loading ? [] : messages

  const filteredMessages = selectedCategory === 'all' 
    ? displayMessages 
    : displayMessages.filter(msg => msg.type === selectedCategory)

  const quickMessages = [
    'Anh yêu em! ❤️',
    'Chúc em ngủ ngon! 🌙',
    'Nhớ em quá! 😘',
    'Em đã ăn cơm chưa? 🍚',
    'Chúc em một ngày tốt lành! ☀️',
    'Anh đang nghĩ về em! 💭'
  ]

  // Show couple setup if no couple
  if (!loading && !hasCouple) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Lời nhắn tình yêu</h1>
          <p className="text-gray-600 mb-6">Bạn cần thiết lập couple để sử dụng tính năng này</p>
          <Link href="/dashboard/couple" className="btn-primary inline-flex items-center gap-2">
            <Users className="w-5 h-5" />
            Thiết lập Couple
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Lời nhắn tình yêu</h1>
          <p className="text-gray-600">Gửi và nhận những lời nhắn ngọt ngào mỗi ngày</p>
        </div>
        <Link href="/dashboard/messages/new" className="btn-primary inline-flex items-center gap-2 w-fit">
          <Plus className="w-5 h-5" />
          Tạo lời nhắn mới
        </Link>
      </div>

      {/* Anniversary Countdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card bg-gradient-to-r from-red-500 to-pink-500 text-white"
      >
        <div className="text-center">
          <div className="mb-4">
            <Heart className="w-12 h-12 mx-auto mb-2 heartbeat" />
            <h2 className="text-2xl font-bold mb-1">Kỷ niệm 1 năm yêu nhau</h2>
            <p className="opacity-90">Đếm ngược đến ngày đặc biệt</p>
          </div>
          
          <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
            <div className="bg-white bg-opacity-20 rounded-xl p-3">
              <div className="text-2xl font-bold">{countdown.days}</div>
              <div className="text-sm opacity-75">Ngày</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-xl p-3">
              <div className="text-2xl font-bold">{countdown.hours}</div>
              <div className="text-sm opacity-75">Giờ</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-xl p-3">
              <div className="text-2xl font-bold">{countdown.minutes}</div>
              <div className="text-sm opacity-75">Phút</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-xl p-3">
              <div className="text-2xl font-bold">{countdown.seconds}</div>
              <div className="text-sm opacity-75">Giây</div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category.id
                    ? 'bg-primary-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <category.icon className="w-4 h-4" />
                {category.label}
              </button>
            ))}
          </div>

          {/* Messages */}
          <div className="space-y-4">
            {messages.filter(msg => selectedCategory === 'all' || msg.type === selectedCategory).map((message, index) => {
              // Parse message content to display properly
              const lines = message.message.split('\n\n')
              const titleLine = lines[0] || message.message
              const content = lines.slice(1).join('\n\n') || message.message

              return (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 rounded-xl border-2 bg-gradient-to-r from-pink-50 to-purple-50 border-l-4 border-pink-500"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-pink-500 text-white">
                        💕
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{titleLine}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock className="w-4 h-4" />
                          {new Date(message.sentDate).toLocaleString('vi-VN')}
                          <span className="text-pink-600 font-medium capitalize">{message.type}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleEditMessage(message)}
                        className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                        title="Chỉnh sửa message"
                      >
                        <Edit3 className="w-4 h-4 text-gray-600" />
                      </button>
                      <button 
                        onClick={() => handleDeleteMessage(message.id)}
                        className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                        title="Xóa message"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                  
                  {content && (
                    <p className="text-gray-700 mb-3 whitespace-pre-wrap">{content}</p>
                  )}
                  
                  {!message.isRead && (
                    <div className="text-sm text-blue-600 font-medium">💌 Tin nhắn mới</div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Quick Messages */}
          <div className="card">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary-600" />
              Tin nhắn nhanh
            </h3>
            <div className="space-y-2">
              {quickMessages.map((msg, index) => (
                <button
                  key={index}
                  className="w-full p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-sm"
                >
                  {msg}
                </button>
              ))}
            </div>
          </div>

          {/* Message Stats */}
          <div className="card">
            <h3 className="font-semibold text-gray-800 mb-4">Thống kê</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Tin nhắn hôm nay</span>
                <span className="font-semibold text-primary-600">12</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Tin nhắn tuần này</span>
                <span className="font-semibold text-primary-600">89</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Streak ngày</span>
                <span className="font-semibold text-primary-600">25 🔥</span>
              </div>
            </div>
          </div>

          {/* Upcoming Reminders */}
          <div className="card">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary-600" />
              Nhắc nhở sắp tới
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-yellow-50 rounded-lg">
                <div className="font-medium text-yellow-800">Chúc ngủ ngon</div>
                <div className="text-sm text-yellow-600">21:30 hàng ngày</div>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="font-medium text-blue-800">Chúc buổi sáng</div>
                <div className="text-sm text-blue-600">07:00 hàng ngày</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Message Modal */}
      {editingMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Chỉnh sửa lời nhắn</h3>
              <button 
                onClick={() => setEditingMessage(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Emoji Picker */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Emoji</label>
                <div className="flex gap-2 flex-wrap">
                  {['💕', '❤️', '💖', '💝', '🌹', '💐', '🎁', '⭐'].map(emoji => (
                    <button
                      key={emoji}
                      onClick={() => setEditForm(prev => ({ ...prev, emoji }))}
                      className={`p-2 text-2xl rounded-lg border-2 ${
                        editForm.emoji === emoji ? 'border-pink-500 bg-pink-50' : 'border-gray-200'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tiêu đề</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Tiêu đề lời nhắn..."
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nội dung</label>
                <textarea
                  rows={4}
                  value={editForm.content}
                  onChange={(e) => setEditForm(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Viết lời nhắn yêu thương..."
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Loại tin nhắn</label>
                <select
                  value={editForm.type}
                  onChange={(e) => setEditForm(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="daily">Hàng ngày</option>
                  <option value="anniversary">Kỷ niệm</option>
                  <option value="special">Đặc biệt</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
              <button
                onClick={() => setEditingMessage(null)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleUpdateMessage}
                className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
              >
                Cập nhật
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
