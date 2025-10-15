'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter, useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import {
  ArrowLeft,
  Save,
  Heart,
  Trash2,
  Calendar,
  Clock
} from 'lucide-react'
import Link from 'next/link'

export default function EditMessagePage() {
  const { data: session } = useSession()
  const router = useRouter()
  const params = useParams()
  const messageId = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Form data
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [emoji, setEmoji] = useState('💕')
  const [type, setType] = useState('daily')

  // Fetch message data
  useEffect(() => {
    const fetchMessage = async () => {
      if (!session?.user?.id || !messageId) return

      try {
        const response = await fetch(`/api/messages?userId=${session.user.id}`)
        if (response.ok) {
          const data = await response.json()
          const message = data.messages?.find((m: any) => m.id === messageId)
          
          if (message) {
            // Parse message content
            const lines = message.message.split('\n\n')
            const titleLine = lines[0] || message.message
            const messageContent = lines.slice(1).join('\n\n') || message.message
            
            // Extract emoji and title
            const messageEmoji = titleLine.charAt(0).match(/[^\w\s]/) ? titleLine.charAt(0) : '💕'
            const messageTitle = titleLine.replace(/^[^\w\s]\s*/, '').trim()
            
            setTitle(messageTitle || 'Love Message')
            setContent(messageContent || message.message)
            setEmoji(messageEmoji)
            setType(message.type || 'daily')
          } else {
            setError('Không tìm thấy message')
          }
        }
      } catch (error) {
        console.error('Error fetching message:', error)
        setError('Lỗi khi tải thông tin message')
      } finally {
        setLoading(false)
      }
    }

    fetchMessage()
  }, [session, messageId])

  const handleSave = async () => {
    if (!title || !content) {
      setError('Vui lòng điền tiêu đề và nội dung')
      return
    }

    setSaving(true)
    setError('')
    
    try {
      const response = await fetch('/api/messages', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messageId,
          userId: session?.user?.id,
          message: content,
          title,
          emoji,
          type
        })
      })

      const result = await response.json()

      if (response.ok) {
        setSuccess('✅ ' + result.message)
        setTimeout(() => {
          router.push('/dashboard/messages')
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
    if (!confirm('Bạn có chắc chắn muốn xóa message này?')) return

    setDeleting(true)
    setError('')
    
    try {
      const response = await fetch(`/api/messages?messageId=${messageId}&userId=${session?.user?.id}`, {
        method: 'DELETE'
      })

      const result = await response.json()

      if (response.ok) {
        setSuccess('✅ ' + result.message)
        setTimeout(() => {
          router.push('/dashboard/messages')
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
        <span className="ml-2 text-gray-600">Đang tải message...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href="/dashboard/messages"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Chỉnh sửa lời nhắn</h1>
            <p className="text-gray-600">Cập nhật nội dung message của bạn</p>
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
            disabled={saving || !title.trim() || !content.trim()}
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
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Nội dung lời nhắn</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tiêu đề *</label>
                <input
                  type="text"
                  placeholder="VD: Chúc buổi sáng tốt lành..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nội dung *</label>
                <textarea
                  rows={6}
                  placeholder="Hãy viết những lời yêu thương, động viên..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Emoji Selection */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Emoji
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {['💕', '❤️', '💖', '💝', '🌹', '💐', '🎁', '⭐', '🌟', '💫', '🦋', '🌈'].map((emojiOption) => (
                <button
                  key={emojiOption}
                  onClick={() => setEmoji(emojiOption)}
                  className={`p-3 rounded-lg border-2 transition-all text-2xl ${
                    emoji === emojiOption
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {emojiOption}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Type Selection */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="card"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Loại tin nhắn</h3>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="input-field"
            >
              <option value="daily">Hàng ngày</option>
              <option value="anniversary">Kỷ niệm</option>
              <option value="special">Đặc biệt</option>
            </select>
          </motion.div>

          {/* Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Xem trước</h3>
            <div className="p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg border-l-4 border-pink-500">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full flex items-center justify-center bg-pink-500 text-white text-sm">
                  💕
                </div>
                <h4 className="font-semibold text-gray-800">{emoji} {title || 'Tiêu đề...'}</h4>
              </div>
              <p className="text-gray-700 text-sm whitespace-pre-wrap">
                {content || 'Nội dung lời nhắn...'}
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                <Clock className="w-3 h-3" />
                <span className="capitalize">{type}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
