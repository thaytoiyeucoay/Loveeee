'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter, useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import {
  ArrowLeft,
  Save,
  Heart,
  Trash2
} from 'lucide-react'
import Link from 'next/link'

export default function EditDiaryPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const params = useParams()
  const entryId = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Form data
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [mood, setMood] = useState('')
  const [entryDate, setEntryDate] = useState('')
  const [images, setImages] = useState<string[]>([])

  const moods = [
    { id: 'happy', emoji: '😊', label: 'Vui vẻ', color: 'text-green-600' },
    { id: 'love', emoji: '😍', label: 'Yêu đương', color: 'text-pink-600' },
    { id: 'excited', emoji: '🤩', label: 'Phấn khích', color: 'text-yellow-600' },
    { id: 'grateful', emoji: '🥰', label: 'Biết ơn', color: 'text-purple-600' },
    { id: 'peaceful', emoji: '😌', label: 'Bình yên', color: 'text-blue-600' },
    { id: 'nostalgic', emoji: '🥺', label: 'Hoài niệm', color: 'text-orange-600' },
  ]

  // Fetch diary entry data
  useEffect(() => {
    const fetchEntry = async () => {
      if (!session?.user?.id || !entryId) return

      try {
        const response = await fetch(`/api/diary/${entryId}?userId=${session.user.id}`)
        if (response.ok) {
          const data = await response.json()
          const entry = data.entry
          
          if (entry) {
            setTitle(entry.title || '')
            setContent(entry.content || '')
            setMood(entry.mood || '')
            setEntryDate(entry.entryDate ? new Date(entry.entryDate).toISOString().split('T')[0] : '')
            setImages(entry.images ? entry.images.split('|||').filter(Boolean) : [])
          } else {
            setError('Không tìm thấy diary entry')
          }
        }
      } catch (error) {
        console.error('Error fetching diary entry:', error)
        setError('Lỗi khi tải thông tin diary')
      } finally {
        setLoading(false)
      }
    }

    fetchEntry()
  }, [session, entryId])

  const handleSave = async () => {
    if (!title || !content) {
      setError('Vui lòng điền tiêu đề và nội dung')
      return
    }

    setSaving(true)
    setError('')
    
    try {
      const response = await fetch('/api/diary', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          entryId,
          userId: session?.user?.id,
          title,
          content,
          mood,
          entryDate,
          images
        })
      })

      const result = await response.json()

      if (response.ok) {
        setSuccess('✅ ' + result.message)
        setTimeout(() => {
          router.push('/dashboard/diary')
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
    if (!confirm('Bạn có chắc chắn muốn xóa diary entry này?')) return

    setDeleting(true)
    setError('')
    
    try {
      const response = await fetch(`/api/diary?entryId=${entryId}&userId=${session?.user?.id}`, {
        method: 'DELETE'
      })

      const result = await response.json()

      if (response.ok) {
        setSuccess('✅ ' + result.message)
        setTimeout(() => {
          router.push('/dashboard/diary')
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
        <span className="ml-2 text-gray-600">Đang tải diary...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href="/dashboard/diary"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Chỉnh sửa nhật ký</h1>
            <p className="text-gray-600">Cập nhật nội dung diary của bạn</p>
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
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Nội dung nhật ký</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tiêu đề *</label>
                <input
                  type="text"
                  placeholder="VD: Ngày hôm nay thật đặc biệt..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nội dung *</label>
                <textarea
                  rows={10}
                  placeholder="Hãy chia sẻ những kỷ niệm đẹp, cảm xúc của bạn..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>
          </motion.div>

          {/* Date Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Ngày nhật ký</h3>
            <input
              type="date"
              value={entryDate}
              onChange={(e) => setEntryDate(e.target.value)}
              className="input-field"
            />
            <p className="text-sm text-gray-500 mt-2">Chọn ngày bạn muốn ghi nhật ký</p>
          </motion.div>

          {/* Images Preview */}
          {images.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Ảnh đã tải lên</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((image: string, idx: number) => (
                  <div key={idx} className="relative group">
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <img 
                        src={image.trim()} 
                        alt={`Image ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      onClick={() => setImages(prev => prev.filter((_, i) => i !== idx))}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Mood Selection */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Tâm trạng
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {moods.map((moodOption) => (
                <button
                  key={moodOption.id}
                  onClick={() => setMood(moodOption.id)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    mood === moodOption.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{moodOption.emoji}</div>
                  <div className="text-xs font-medium text-gray-700">{moodOption.label}</div>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
