'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import {
  Smile,
  Frown,
  Meh,
  Heart,
  TrendingUp,
  Calendar,
  MessageCircle,
  AlertCircle,
  ThumbsUp,
  Coffee,
  Sun,
  Cloud,
  CloudRain,
  Zap,
  Star,
  Plus,
  Filter,
  X,
  Trash2
} from 'lucide-react'

export default function MoodPage() {
  const { data: session } = useSession()
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [viewPeriod, setViewPeriod] = useState<'week' | 'month' | 'year'>('week')
  const [showAddMood, setShowAddMood] = useState(false)
  const [entries, setEntries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  // New mood form
  const [newMoodForm, setNewMoodForm] = useState({
    mood: '',
    intensity: 5,
    note: '',
    date: new Date().toISOString().split('T')[0]
  })

  const moods = [
    { id: 'amazing', emoji: '🤩', label: 'Tuyệt vời', color: 'bg-green-500', value: 10 },
    { id: 'happy', emoji: '😊', label: 'Vui vẻ', color: 'bg-green-400', value: 9 },
    { id: 'good', emoji: '🙂', label: 'Tốt', color: 'bg-blue-400', value: 8 },
    { id: 'okay', emoji: '😐', label: 'Bình thường', color: 'bg-yellow-400', value: 7 },
    { id: 'meh', emoji: '😕', label: 'Tạm được', color: 'bg-orange-400', value: 6 },
    { id: 'sad', emoji: '😢', label: 'Buồn', color: 'bg-red-400', value: 4 },
    { id: 'angry', emoji: '😠', label: 'Tức giận', color: 'bg-red-500', value: 3 },
    { id: 'stressed', emoji: '😰', label: 'Căng thẳng', color: 'bg-purple-500', value: 2 }
  ]

  // Fetch mood entries
  const fetchEntries = async () => {
    if (!session?.user?.id) return

    setLoading(true)
    try {
      const daysMap = { week: 7, month: 30, year: 365 }
      const response = await fetch(`/api/mood?userId=${session.user.id}&days=${daysMap[viewPeriod]}`)
      
      if (response.ok) {
        const data = await response.json()
        console.log('Mood entries fetched:', data.entries)
        setEntries(data.entries || [])
      } else {
        const error = await response.json()
        setError(error.error)
      }
    } catch (error) {
      console.error('Error fetching mood entries:', error)
      setError('Failed to fetch mood entries')
    } finally {
      setLoading(false)
    }
  }

  // Create new mood entry
  const handleCreateMood = async () => {
    if (!session?.user?.id || !newMoodForm.mood) {
      setError('Vui lòng chọn tâm trạng')
      return
    }

    try {
      const response = await fetch('/api/mood', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: session.user.id,
          mood: newMoodForm.mood,
          intensity: newMoodForm.intensity,
          note: newMoodForm.note,
          date: newMoodForm.date
        })
      })

      if (response.ok) {
        const result = await response.json()
        // Add new entry to local state
        setEntries(prev => [result.entry, ...prev])
        // Reset form
        setNewMoodForm({
          mood: '',
          intensity: 5,
          note: '',
          date: new Date().toISOString().split('T')[0]
        })
        setShowAddMood(false)
        alert('✅ Mood đã được ghi lại!')
      } else {
        const error = await response.json()
        setError(error.error)
      }
    } catch (error) {
      console.error('Error creating mood entry:', error)
      setError('Failed to create mood entry')
    }
  }

  // Delete mood entry
  const handleDeleteMood = async (entryId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa mood entry này?')) return

    try {
      const response = await fetch(`/api/mood?entryId=${entryId}&userId=${session?.user?.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        // Remove from local state
        setEntries(prev => prev.filter(entry => entry.id !== entryId))
        alert('✅ Mood entry đã được xóa!')
      } else {
        const error = await response.json()
        alert('❌ ' + error.error)
      }
    } catch (error) {
      console.error('Error deleting mood entry:', error)
      alert('❌ Failed to delete mood entry')
    }
  }

  // Fetch entries on session/period change
  useEffect(() => {
    fetchEntries()
  }, [session?.user?.id, viewPeriod])

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <span className="ml-2 text-gray-600">Đang tải tâm trạng...</span>
      </div>
    )
  }

  // Calculate mood statistics from real data
  const getMoodStats = () => {
    if (entries.length === 0) {
      return {
        userAverage: 0,
        totalEntries: 0,
        overallAverage: 0
      }
    }
    
    const avgIntensity = entries.reduce((sum, entry) => sum + entry.intensity, 0) / entries.length
    
    return {
      userAverage: Math.round(avgIntensity * 10) / 10,
      totalEntries: entries.length,
      overallAverage: Math.round(avgIntensity * 10) / 10
    }
  }

  const stats = getMoodStats()

  const getMoodColor = (moodId: string) => {
    const mood = moods.find(m => m.id === moodId)
    return mood?.color || 'bg-gray-400'
  }

  const getMoodEmoji = (moodId: string) => {
    const mood = moods.find(m => m.id === moodId)
    return mood?.emoji || '😐'
  }

  const supportMessages = [
    {
      id: 1,
      trigger: 'sad',
      message: 'Anh thấy em buồn rồi. Anh có thể làm gì để em vui hơn không? ❤️',
      suggested_actions: ['Gọi điện', 'Gửi hoa', 'Đến gặp']
    },
    {
      id: 2,
      trigger: 'stressed',
      message: 'Em có vẻ căng thẳng. Chúng ta cùng thư giãn một chút nhé?',
      suggested_actions: ['Massage', 'Xem phim', 'Đi dạo']
    },
    {
      id: 3,
      trigger: 'angry',
      message: 'Anh biết em đang tức giận. Anh xin lỗi và muốn nói chuyện với em.',
      suggested_actions: ['Nói chuyện', 'Xin lỗi', 'Thời gian']
    }
  ]

  const moodInsights = [
    'Cả hai bạn đều có tâm trạng tích cực nhất vào cuối tuần',
    'Thời tiết nắng thường làm tâm trạng tốt hơn',
    'Các hoạt động cùng nhau giúp cải thiện mood đáng kể',
    'Cần chú ý hỗ trợ nhau nhiều hơn trong những ngày stress'
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Tâm trạng & Cảm xúc</h1>
          <p className="text-gray-600">Theo dõi và chia sẻ cảm xúc với nhau mỗi ngày</p>
        </div>
        <button 
          onClick={() => setShowAddMood(true)}
          className="btn-primary inline-flex items-center gap-2 w-fit"
        >
          <Plus className="w-5 h-5" />
          Thêm tâm trạng
        </button>
      </div>

      {/* Quick Mood Check-in */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card bg-gradient-to-r from-purple-500 to-pink-500 text-white"
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Hôm nay bạn cảm thấy thế nào?</h2>
          <p className="opacity-90 mb-6">Chọn tâm trạng hiện tại của bạn</p>
          
          <div className="grid grid-cols-4 lg:grid-cols-8 gap-3 max-w-4xl mx-auto">
            {moods.map((mood) => (
              <button
                key={mood.id}
                onClick={() => setSelectedMood(mood.id)}
                className={`p-4 rounded-xl bg-white bg-opacity-20 hover:bg-opacity-30 transition-all transform hover:scale-105 ${
                  selectedMood === mood.id ? 'bg-opacity-40 scale-105' : ''
                }`}
              >
                <div className="text-3xl mb-2">{mood.emoji}</div>
                <div className="text-sm font-medium">{mood.label}</div>
              </button>
            ))}
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
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-1">{stats.overallAverage}/10</div>
          <div className="text-sm text-gray-600">Tâm trạng chung</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card text-center"
        >
          <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-1">{stats.userAverage}/10</div>
          <div className="text-sm text-gray-600">Tâm trạng bạn</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card text-center"
        >
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Smile className="w-6 h-6 text-white" />
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-1">{stats.overallAverage}/10</div>
          <div className="text-sm text-gray-600">Trung bình</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card text-center"
        >
          <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-1">{stats.totalEntries}</div>
          <div className="text-sm text-gray-600">Lần check-in</div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Mood Entries */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">Tâm trạng gần đây</h2>
            <div className="flex bg-gray-100 rounded-lg p-1">
              {[
                { id: 'week', label: 'Tuần' },
                { id: 'month', label: 'Tháng' },
                { id: 'year', label: 'Năm' }
              ].map((period) => (
                <button
                  key={period.id}
                  onClick={() => setViewPeriod(period.id as any)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                    viewPeriod === period.id 
                      ? 'bg-white shadow-sm text-gray-900' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {period.label}
                </button>
              ))}
            </div>
          </div>

          {entries.map((entry: any, index: number) => {
            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card hover:shadow-lg transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-xl ${getMoodColor(entry.mood)}`}>
                      {getMoodEmoji(entry.mood)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{entry.intensity}/10</div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-800">{entry.user?.name || 'User'}</span>
                          <span className="text-sm text-gray-500">
                            {new Date(entry.date || entry.createdAt).toLocaleString('vi-VN')}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteMood(entry.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                        title="Xóa mood entry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {entry.note && (
                      <p className="text-gray-700 mb-3">{entry.note}</p>
                    )}
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className={`px-3 py-1 rounded-full text-white ${getMoodColor(entry.mood)}`}>
                        {getMoodEmoji(entry.mood)} {moods.find(m => m.id === entry.mood)?.label || entry.mood}
                      </div>
                      <span className="text-gray-500">
                        Mức độ: {entry.intensity}/10
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}

          {/* Empty State */}
          {entries.length === 0 && (
            <div className="text-center py-12">
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Chưa có tâm trạng nào</h3>
              <p className="text-gray-500 mb-6">Hãy bắt đầu ghi lại cảm xúc của bạn mỗi ngày!</p>
              <button 
                onClick={() => setShowAddMood(true)}
                className="btn-primary"
              >
                Thêm tâm trạng đầu tiên
              </button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Support Alert */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card bg-yellow-50 border-yellow-200"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-yellow-800 mb-1">Thông báo quan tâm</h3>
                <p className="text-yellow-700 text-sm mb-3">
                  Người yêu có vẻ căng thẳng hôm qua. Hãy gửi lời động viên nhé!
                </p>
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-yellow-200 hover:bg-yellow-300 text-yellow-800 text-xs rounded-full transition-colors">
                    Gọi điện
                  </button>
                  <button className="px-3 py-1 bg-yellow-200 hover:bg-yellow-300 text-yellow-800 text-xs rounded-full transition-colors">
                    Nhắn tin
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Mood Insights */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-primary-600" />
              Nhận xét & Góp ý
            </h3>
            <div className="space-y-3">
              {moodInsights.map((insight, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <ThumbsUp className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-blue-800 text-sm">{insight}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="card"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Hành động nhanh</h3>
            <div className="space-y-2">
              <button className="w-full p-3 text-left bg-pink-50 hover:bg-pink-100 rounded-lg transition-colors group">
                <div className="flex items-center gap-3">
                  <Heart className="w-5 h-5 text-pink-600" />
                  <div>
                    <div className="font-medium text-pink-800 text-sm">Gửi lời yêu thương</div>
                    <div className="text-pink-600 text-xs">Gửi tin nhắn động viên</div>
                  </div>
                </div>
              </button>
              
              <button className="w-full p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group">
                <div className="flex items-center gap-3">
                  <Coffee className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-medium text-blue-800 text-sm">Lên kế hoạch thư giãn</div>
                    <div className="text-blue-600 text-xs">Tạo hoạt động cùng nhau</div>
                  </div>
                </div>
              </button>
              
              <button className="w-full p-3 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors group">
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <div className="font-medium text-green-800 text-sm">Trò chuyện sâu</div>
                    <div className="text-green-600 text-xs">Chia sẻ cảm xúc thật lòng</div>
                  </div>
                </div>
              </button>
            </div>
          </motion.div>

          {/* Mood History Chart Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="card"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Xu hướng tâm trạng</h3>
            <div className="h-32 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <TrendingUp className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">Biểu đồ xu hướng</p>
                <p className="text-xs">Sắp ra mắt</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Add Mood Modal */}
      {showAddMood && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Thêm tâm trạng mới</h3>
              <button 
                onClick={() => setShowAddMood(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 mb-4">
                {error}
              </div>
            )}

            <div className="space-y-4">
              {/* Mood Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Tâm trạng hiện tại *</label>
                <div className="grid grid-cols-4 gap-3">
                  {moods.map((mood) => (
                    <button
                      key={mood.id}
                      onClick={() => setNewMoodForm(prev => ({ ...prev, mood: mood.id }))}
                      className={`p-3 rounded-lg border-2 transition-all text-center ${
                        newMoodForm.mood === mood.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-2xl mb-1">{mood.emoji}</div>
                      <div className="text-xs text-gray-600">{mood.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Intensity Slider */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mức độ cường độ: {newMoodForm.intensity}/10
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={newMoodForm.intensity}
                  onChange={(e) => setNewMoodForm(prev => ({ ...prev, intensity: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Rất thấp</span>
                  <span>Rất cao</span>
                </div>
              </div>

              {/* Note */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ghi chú</label>
                <textarea
                  rows={3}
                  value={newMoodForm.note}
                  onChange={(e) => setNewMoodForm(prev => ({ ...prev, note: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Mô tả cảm xúc của bạn..."
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ngày</label>
                <input
                  type="date"
                  value={newMoodForm.date}
                  onChange={(e) => setNewMoodForm(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
              <button
                onClick={() => setShowAddMood(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleCreateMood}
                disabled={!newMoodForm.mood}
                className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50"
              >
                Lưu tâm trạng
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
