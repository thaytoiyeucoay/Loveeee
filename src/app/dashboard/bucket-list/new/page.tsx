'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import {
  ArrowLeft,
  Save,
  Target,
  DollarSign,
  Calendar,
  Lightbulb,
  Plane,
  Utensils,
  Camera,
  Heart,
  Star,
  MapPin,
  Users,
  Gift
} from 'lucide-react'
import Link from 'next/link'

export default function NewBucketListPage() {
  const { data: session } = useSession()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('travel')
  const [priority, setPriority] = useState('medium')
  const [difficulty, setDifficulty] = useState('medium')
  const [estimatedCost, setEstimatedCost] = useState('')
  const [targetDate, setTargetDate] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const categories = [
    { id: 'travel', label: 'Du lịch', icon: Plane, color: 'bg-blue-100 text-blue-800', description: 'Khám phá những nơi mới' },
    { id: 'food', label: 'Ẩm thực', icon: Utensils, color: 'bg-orange-100 text-orange-800', description: 'Thử những món ăn đặc biệt' },
    { id: 'adventure', label: 'Phiêu lưu', icon: Target, color: 'bg-green-100 text-green-800', description: 'Những trải nghiệm mạo hiểm' },
    { id: 'romantic', label: 'Lãng mạn', icon: Heart, color: 'bg-pink-100 text-pink-800', description: 'Khoảnh khắc tình yêu' },
    { id: 'experience', label: 'Trải nghiệm', icon: Star, color: 'bg-purple-100 text-purple-800', description: 'Học hỏi điều mới mẻ' },
    { id: 'photo', label: 'Chụp ảnh', icon: Camera, color: 'bg-yellow-100 text-yellow-800', description: 'Lưu lại kỷ niệm đẹp' },
    { id: 'social', label: 'Xã hội', icon: Users, color: 'bg-indigo-100 text-indigo-800', description: 'Hoạt động với bạn bè' },
    { id: 'special', label: 'Đặc biệt', icon: Gift, color: 'bg-red-100 text-red-800', description: 'Những dịp quan trọng' }
  ]

  const priorityOptions = [
    { id: 'high', label: 'Cao', color: 'bg-red-500', description: 'Muốn thực hiện sớm nhất' },
    { id: 'medium', label: 'Trung bình', color: 'bg-yellow-500', description: 'Quan trọng nhưng không vội' },
    { id: 'low', label: 'Thấp', color: 'bg-green-500', description: 'Có thể thực hiện sau' }
  ]

  const difficultyOptions = [
    { id: 'easy', label: 'Dễ', color: 'text-green-600', description: 'Có thể thực hiện dễ dàng' },
    { id: 'medium', label: 'Trung bình', color: 'text-yellow-600', description: 'Cần một chút chuẩn bị' },
    { id: 'hard', label: 'Khó', color: 'text-red-600', description: 'Cần nhiều thời gian và công sức' }
  ]

  const suggestions = [
    { category: 'travel', items: ['Du lịch Nhật Bản', 'Bali honeymoon', 'Đà Lạt romantic trip', 'Phú Quốc beach resort'] },
    { category: 'food', items: ['Nấu pasta từ đầu', 'Thử sushi omakase', 'Học làm bánh sinh nhật', 'Food tour Sài Gòn'] },
    { category: 'adventure', items: ['Nhảy bungee cùng nhau', 'Leo núi Fansipan', 'Lặn biển Nha Trang', 'Skydiving Dubai'] },
    { category: 'romantic', items: ['Cầu hôn trên núi', 'Dinner trên thuyền', 'Xem bình minh ở biển', 'Spa couple massage'] },
    { category: 'experience', items: ['Học nhảy salsa', 'Khóa học gốm sứ', 'Workshop nấu ăn', 'Học chụp ảnh chuyên nghiệp'] },
    { category: 'photo', items: ['Pre-wedding ở Paris', 'Chụp ảnh couple mỗi mùa', 'Photo book 1 năm yêu', 'Selfie 100 địa điểm'] },
    { category: 'social', items: ['Gặp gỡ bạn bè ở nước ngoài', 'Tổ chức tiệc sinh nhật', 'Double date với bestie', 'Tham gia volunteer'] },
    { category: 'special', items: ['Tổ chức đám cưới mơ ước', 'Mua nhà chung', 'Nuôi thú cưng', 'Viết sách về tình yêu'] }
  ]

  const currentSuggestions = suggestions.find(s => s.category === category)?.items || []

  const handleSave = async () => {
    if (!session?.user?.id) {
      setError('Bạn cần đăng nhập để tạo mục tiêu')
      return
    }

    if (!title.trim() || !description.trim()) {
      setError('Vui lòng điền đầy đủ tiêu đề và mô tả')
      return
    }

    setIsLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/bucket-list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: session.user.id,
          title: title.trim(),
          description: description.trim(),
          category,
          priority
        })
      })

      const result = await response.json()

      if (response.ok) {
        // Success - redirect to bucket list page
        router.push('/dashboard/bucket-list')
      } else {
        throw new Error(result.error || 'Failed to create bucket list item')
      }
    } catch (error: any) {
      console.error('Error creating bucket list item:', error)
      setError(error.message || 'Có lỗi xảy ra khi tạo mục tiêu')
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
            href="/dashboard/bucket-list"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Thêm mục tiêu mới</h1>
            <p className="text-gray-600">Tạo mục tiêu mới cho bucket list của hai bạn</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={isLoading || !title.trim() || !description.trim()}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          {isLoading ? 'Đang lưu...' : 'Tạo mục tiêu'}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Tên mục tiêu *</label>
                <input
                  type="text"
                  placeholder="VD: Du lịch Nhật Bản cùng nhau"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả chi tiết *</label>
                <textarea
                  rows={4}
                  placeholder="Mô tả chi tiết về mục tiêu này, tại sao muốn thực hiện, cách thức thực hiện..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>
          </motion.div>

          {/* Category Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Danh mục</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    category === cat.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <cat.icon className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                  <div className="text-sm font-medium text-gray-700 mb-1">{cat.label}</div>
                  <div className="text-xs text-gray-500">{cat.description}</div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Priority & Difficulty */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Độ ưu tiên & Độ khó</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Độ ưu tiên</label>
                <div className="space-y-2">
                  {priorityOptions.map((option) => (
                    <label key={option.id} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="priority"
                        value={option.id}
                        checked={priority === option.id}
                        onChange={(e) => setPriority(e.target.value)}
                        className="w-4 h-4 text-primary-600"
                      />
                      <div className={`w-4 h-4 rounded-full ${option.color}`}></div>
                      <div>
                        <div className="font-medium text-gray-800">{option.label}</div>
                        <div className="text-sm text-gray-600">{option.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Độ khó</label>
                <div className="space-y-2">
                  {difficultyOptions.map((option) => (
                    <label key={option.id} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="difficulty"
                        value={option.id}
                        checked={difficulty === option.id}
                        onChange={(e) => setDifficulty(e.target.value)}
                        className="w-4 h-4 text-primary-600"
                      />
                      <div className={`font-medium ${option.color}`}>●</div>
                      <div>
                        <div className="font-medium text-gray-800">{option.label}</div>
                        <div className="text-sm text-gray-600">{option.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Additional Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Chi tiết bổ sung</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Chi phí dự kiến</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    placeholder="0"
                    value={estimatedCost}
                    onChange={(e) => setEstimatedCost(e.target.value)}
                    className="input-field pl-10 pr-12"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                    VNĐ
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mục tiêu hoàn thành</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="input-field pl-10"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Suggestions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              Gợi ý cho {categories.find(c => c.id === category)?.label}
            </h3>
            
            <div className="space-y-2">
              {currentSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setTitle(suggestion)}
                  className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
                >
                  <div className="font-medium text-gray-800 group-hover:text-primary-600">
                    {suggestion}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="card bg-gradient-to-r from-primary-500 to-secondary-500 text-white"
          >
            <h3 className="text-lg font-semibold mb-4">Bucket List hiện tại</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>Tổng mục tiêu</span>
                <span className="font-bold">12</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Đã hoàn thành</span>
                <span className="font-bold">4</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Đang thực hiện</span>
                <span className="font-bold">3</span>
              </div>
              <div className="w-full bg-white bg-opacity-20 rounded-full h-2 mt-3">
                <div className="bg-white h-2 rounded-full" style={{ width: '33%' }}></div>
              </div>
              <div className="text-sm opacity-90">33% hoàn thành tổng thể</div>
            </div>
          </motion.div>

          {/* Tips */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="card bg-blue-50 border-blue-200"
          >
            <h3 className="text-lg font-semibold text-blue-800 mb-3">💡 Mẹo tạo mục tiêu</h3>
            <ul className="text-sm text-blue-700 space-y-2">
              <li>• Mục tiêu cụ thể, có thể đo lường được</li>
              <li>• Chia nhỏ mục tiêu lớn thành các bước nhỏ</li>
              <li>• Đặt deadline thực tế và khả thi</li>
              <li>• Thảo luận với người yêu về mục tiêu chung</li>
              <li>• Chuẩn bị ngân sách cho mục tiêu tốn kém</li>
            </ul>
          </motion.div>

          {/* Popular Categories */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="card"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Danh mục phổ biến</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Du lịch</span>
                <span className="font-medium text-blue-600">35%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Lãng mạn</span>
                <span className="font-medium text-pink-600">28%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Trải nghiệm</span>
                <span className="font-medium text-purple-600">22%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Ẩm thực</span>
                <span className="font-medium text-orange-600">15%</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
