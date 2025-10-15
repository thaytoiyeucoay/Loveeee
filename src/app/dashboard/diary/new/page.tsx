'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import {
  ArrowLeft,
  Save,
  Camera,
  Video,
  MapPin,
  Tag,
  Heart,
  Smile,
  Meh,
  Frown,
  Upload,
  X
} from 'lucide-react'
import Link from 'next/link'

export default function NewDiaryPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [mood, setMood] = useState('')
  const [entryDate, setEntryDate] = useState(() => {
    // Default to today in YYYY-MM-DD format
    const today = new Date()
    return today.toISOString().split('T')[0]
  })
  const [location, setLocation] = useState('')
  const [tags, setTags] = useState('')
  const [isPrivate, setIsPrivate] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<{file: File, preview: string}[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const moods = [
    { id: 'happy', emoji: '😊', label: 'Vui vẻ', color: 'text-green-600' },
    { id: 'love', emoji: '😍', label: 'Yêu đương', color: 'text-pink-600' },
    { id: 'excited', emoji: '🤩', label: 'Phấn khích', color: 'text-yellow-600' },
    { id: 'grateful', emoji: '🥰', label: 'Biết ơn', color: 'text-purple-600' },
    { id: 'peaceful', emoji: '😌', label: 'Bình yên', color: 'text-blue-600' },
    { id: 'nostalgic', emoji: '🥺', label: 'Hoài niệm', color: 'text-orange-600' },
    { id: 'sad', emoji: '😢', label: 'Buồn', color: 'text-gray-600' },
    { id: 'missing', emoji: '😔', label: 'Nhớ nhung', color: 'text-indigo-600' }
  ]

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!
      const img = new Image()
      
      img.onload = () => {
        // Set reasonable dimensions for good quality
        const maxWidth = 600
        const maxHeight = 400
        
        let { width, height } = img
        
        // Calculate new dimensions
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width
            width = maxWidth
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height
            height = maxHeight
          }
        }
        
        canvas.width = width
        canvas.height = height
        
        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height)
        let compressedBase64 = canvas.toDataURL('image/jpeg', 0.7) // 70% quality for better image
        
        // If still too large, compress gradually
        let quality = 0.7
        while (compressedBase64.length > 100000 && quality > 0.3) { // 100KB limit, better quality
          quality -= 0.1
          compressedBase64 = canvas.toDataURL('image/jpeg', quality)
        }
        
        resolve(compressedBase64)
      }
      
      img.src = URL.createObjectURL(file)
    })
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    
    // Process files one by one with compression
    for (const file of files) {
      if (file.type.startsWith('image/')) {
        const compressedBase64 = await compressImage(file)
        setUploadedFiles(prev => [...prev, { file, preview: compressedBase64 }])
      } else {
        // For non-images, use regular base64
        const reader = new FileReader()
        reader.onload = (e) => {
          const base64 = e.target?.result as string
          setUploadedFiles(prev => [...prev, { file, preview: base64 }])
        }
        reader.readAsDataURL(file)
      }
    }
  }

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleSave = async () => {
    if (!title || !content) {
      setError('Vui lòng điền tiêu đề và nội dung')
      return
    }

    // Check total images size
    const totalImagesSize = uploadedFiles.reduce((total, file) => total + file.preview.length, 0)
    if (totalImagesSize > 500000) { // 500KB total limit for better quality
      setError('Tổng kích thước ảnh quá lớn. Vui lòng chọn ít ảnh hơn hoặc ảnh nhỏ hơn.')
      return
    }

    setIsLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/diary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: session?.user?.id,
          title,
          content,
          mood,
          entryDate,
          images: uploadedFiles.map(f => f.preview), // Real compressed images
          videos: []
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
      setIsLoading(false)
    }
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
            <h1 className="text-2xl font-bold text-gray-800">Viết nhật ký mới</h1>
            <p className="text-gray-600">Ghi lại những khoảnh khắc đẹp nhất</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={isLoading || !title.trim() || !content.trim()}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          {isLoading ? 'Đang lưu...' : 'Lưu nhật ký'}
        </button>
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
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
          >
            <input
              type="text"
              placeholder="Tiêu đề nhật ký..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-2xl font-bold text-gray-800 placeholder-gray-400 border-none outline-none resize-none bg-transparent"
            />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card min-h-[400px]"
          >
            <textarea
              placeholder="Hôm nay chúng ta đã làm gì đặc biệt nhỉ? Hãy kể về những khoảnh khắc đẹp nhất..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-80 text-gray-700 placeholder-gray-400 border-none outline-none resize-none bg-transparent"
            />
          </motion.div>

          {/* Media Upload */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Ảnh & Video</h3>
            
            {/* Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors">
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Kéo thả hoặc click để tải ảnh</p>
                <p className="text-sm text-gray-500">Hỗ trợ JPG, PNG. Ảnh sẽ được tự động nén để tối ưu hiển thị.</p>
                {uploadedFiles.length > 0 && (
                  <p className="text-xs text-blue-600 mt-2">
                    {uploadedFiles.length} ảnh đã chọn
                  </p>
                )}
              </label>
            </div>

            {/* Uploaded Files */}
            {uploadedFiles.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                {uploadedFiles.map((fileObj, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <img 
                        src={fileObj.preview} 
                        alt={`Upload ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <p className="text-xs text-gray-600 mt-1 truncate">{fileObj.file.name}</p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Mood Selector */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Tâm trạng hôm nay</h3>
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
                  <div className={`text-xs font-medium ${moodOption.color}`}>
                    {moodOption.label}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Location */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="card"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Địa điểm</h3>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Thêm địa điểm..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </motion.div>

          {/* Date Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
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

          {/* Tags */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Tags</h3>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="date, romantic, anniversary..."
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="input-field pl-10"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">Phân cách bằng dấu phẩy</p>
          </motion.div>

          {/* Privacy */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="card"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quyền riêng tư</h3>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
              />
              <div>
                <div className="font-medium text-gray-800">Chỉ tôi xem được</div>
                <div className="text-sm text-gray-600">Nhật ký này sẽ không hiển thị với người yêu</div>
              </div>
            </label>
          </motion.div>

          {/* Quick Tips */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="card bg-blue-50 border-blue-200"
          >
            <h3 className="text-lg font-semibold text-blue-800 mb-3">💡 Gợi ý viết nhật ký</h3>
            <ul className="text-sm text-blue-700 space-y-2">
              <li>• Kể về cảm xúc của bạn hôm nay</li>
              <li>• Chia sẻ khoảnh khắc đặc biệt</li>
              <li>• Ghi lại những lời ngọt ngào</li>
              <li>• Mô tả hoạt động đã làm cùng nhau</li>
              <li>• Bày tỏ lòng biết ơn</li>
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
