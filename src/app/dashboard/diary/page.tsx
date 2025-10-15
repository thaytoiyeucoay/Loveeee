'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import {
  Camera,
  Video,
  Heart,
  Calendar,
  MapPin,
  Tag,
  Search,
  Filter,
  Plus,
  Eye,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Image as ImageIcon,
  Trash2
} from 'lucide-react'
import Link from 'next/link'

export default function DiaryPage() {
  const { data: session } = useSession()
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'timeline'
  const [filterTag, setFilterTag] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [entries, setEntries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [hasCouple, setHasCouple] = useState(false)

  // Fetch diary entries function
  const fetchEntries = async () => {
    if (!session?.user?.id) return

    setLoading(true)
    try {
      // Check if user has couple first
      const coupleResponse = await fetch(`/api/couples?userId=${session.user.id}`)
      if (coupleResponse.ok) {
        const coupleData = await coupleResponse.json()
        setHasCouple(!!coupleData.couple)

        if (coupleData.couple) {
          // Fetch diary entries if has couple
          const entriesResponse = await fetch(`/api/diary?userId=${session.user.id}`)
          if (entriesResponse.ok) {
            const entriesData = await entriesResponse.json()
            console.log('Diary entries fetched:', entriesData.entries)
            setEntries(entriesData.entries || [])
          }
        }
      }
    } catch (error) {
      console.error('Error fetching diary entries:', error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch entries on session change
  useEffect(() => {
    fetchEntries()
  }, [session?.user?.id])

  // Refresh data when page becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && session?.user?.id) {
        fetchEntries()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [session?.user?.id])

  // Delete diary entry function
  const handleDeleteEntry = async (entryId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa nhật ký này?')) return

    try {
      const response = await fetch(`/api/diary?entryId=${entryId}&userId=${session?.user?.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        // Remove from local state
        setEntries(prev => prev.filter(entry => entry.id !== entryId))
        alert('✅ Nhật ký đã được xóa!')
      } else {
        const error = await response.json()
        alert('❌ ' + error.error)
      }
    } catch (error) {
      console.error('Error deleting entry:', error)
      alert('❌ Failed to delete entry')
    }
  }

  // Calculate real tags with counts
  const tags = [
    { id: 'all', label: 'Tất cả', count: entries.length },
    { id: 'happy', label: 'Vui vẻ', count: entries.filter(e => e.mood === 'happy').length },
    { id: 'love', label: 'Yêu thương', count: entries.filter(e => e.mood === 'love').length },
    { id: 'excited', label: 'Phấn khích', count: entries.filter(e => e.mood === 'excited').length },
    { id: 'peaceful', label: 'Bình yên', count: entries.filter(e => e.mood === 'peaceful').length }
  ]

  // Filter entries based on search and mood filter
  const filteredEntries = entries.filter(entry => {
    const matchesSearch = searchQuery === '' || 
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesFilter = filterTag === 'all' || entry.mood === filterTag
    
    return matchesSearch && matchesFilter
  })

  const getMoodEmoji = (mood: string) => {
    const moodMap: { [key: string]: string } = {
      happy: '😊',
      love: '🥰',
      excited: '🤩',
      nostalgic: '🥺',
      romantic: '😍',
      peaceful: '😌'
    }
    return moodMap[mood] || '😊'
  }

  const getMoodColor = (mood: string) => {
    const colorMap: { [key: string]: string } = {
      happy: 'bg-yellow-100 text-yellow-800',
      love: 'bg-pink-100 text-pink-800',
      excited: 'bg-blue-100 text-blue-800',
      nostalgic: 'bg-purple-100 text-purple-800',
      romantic: 'bg-red-100 text-red-800',
      peaceful: 'bg-green-100 text-green-800'
    }
    return colorMap[mood] || 'bg-gray-100 text-gray-800'
  }

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <span className="ml-2 text-gray-600">Đang tải nhật ký...</span>
      </div>
    )
  }

  // Show no couple state
  if (!hasCouple) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">Chưa có couple</h3>
          <p className="text-gray-600 mb-4">Bạn cần thiết lập couple để sử dụng tính năng nhật ký.</p>
          <Link href="/dashboard/couple" className="btn-primary">
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
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Nhật ký tình yêu</h1>
          <p className="text-gray-600">Ghi lại những khoảnh khắc đẹp nhất cùng nhau ({entries.length} bài viết)</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchEntries}
            disabled={loading}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            {loading ? 'Đang tải...' : 'Refresh'}
          </button>
          <Link href="/dashboard/diary/new" className="btn-primary inline-flex items-center gap-2 w-fit">
            <Plus className="w-5 h-5" />
            Thêm nhật ký mới
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card text-center"
        >
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Camera className="w-6 h-6 text-white" />
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-1">{entries.length}</div>
          <div className="text-sm text-gray-600">Nhật ký</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card text-center"
        >
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3">
            <ImageIcon className="w-6 h-6 text-white" />
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-1">{entries.filter(e => e.images).length}</div>
          <div className="text-sm text-gray-600">Ảnh</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card text-center"
        >
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Video className="w-6 h-6 text-white" />
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-1">{entries.filter(e => e.videos).length}</div>
          <div className="text-sm text-gray-600">Video</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card text-center"
        >
          <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-1">{entries.filter(e => e.mood === 'love').length}</div>
          <div className="text-sm text-gray-600">Yêu thương</div>
        </motion.div>
      </div>

      {/* Search and Filter Bar */}
      <div className="card">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm nhật ký..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {/* Tag Filter */}
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => setFilterTag(tag.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  filterTag === tag.id
                    ? 'bg-primary-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Tag className="w-4 h-4" />
                {tag.label} ({tag.count})
              </button>
            ))}
          </div>

          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-all ${
                viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
              }`}
            >
              <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                <div className="bg-current rounded-xs"></div>
                <div className="bg-current rounded-xs"></div>
                <div className="bg-current rounded-xs"></div>
                <div className="bg-current rounded-xs"></div>
              </div>
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`p-2 rounded-md transition-all ${
                viewMode === 'timeline' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
              }`}
            >
              <div className="w-4 h-4 flex flex-col gap-0.5">
                <div className="h-0.5 bg-current rounded-full"></div>
                <div className="h-0.5 bg-current rounded-full w-3"></div>
                <div className="h-0.5 bg-current rounded-full"></div>
                <div className="h-0.5 bg-current rounded-full w-2"></div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Diary Entries */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 gap-6' : 'space-y-6'}>
        {filteredEntries.map((entry: any, index: number) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card group cursor-pointer hover:shadow-lg transition-all duration-200"
          >
            {/* Entry Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {entry.author?.name?.charAt(0) || session?.user?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <div className="font-medium text-gray-800">{entry.author?.name || session?.user?.name || 'User'}</div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    {new Date(entry.entryDate || entry.createdAt).toLocaleDateString('vi-VN')}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {entry.mood && (
                  <div className={`px-2 py-1 rounded-full text-xs ${getMoodColor(entry.mood)}`}>
                    {getMoodEmoji(entry.mood)} {entry.mood}
                  </div>
                )}
                <Link 
                  href={`/dashboard/diary/edit/${entry.id}`}
                  className="p-2 hover:bg-gray-100 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                  title="Chỉnh sửa"
                >
                  <MoreHorizontal className="w-4 h-4 text-gray-400" />
                </Link>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteEntry(entry.id)
                  }}
                  className="p-2 hover:bg-red-100 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                  title="Xóa nhật ký"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>

            {/* Entry Content */}
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{entry.title}</h3>
              <p className="text-gray-600 line-clamp-3">{entry.content}</p>
            </div>

            {/* Images Grid */}
            {entry.images && entry.images.split('|||').filter(Boolean).length > 0 && (
              <div className="mb-4 grid gap-2 grid-cols-3">
                {entry.images.split('|||').filter(Boolean).slice(0, 3).map((image: string, idx: number) => (
                  <div
                    key={idx}
                    className="aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden"
                  >
                    <img 
                      src={image.trim()} 
                      alt={`${entry.title} - Image ${idx + 1}`}
                      className="w-full h-full object-contain hover:scale-105 transition-transform duration-200 cursor-pointer"
                    />
                  </div>
                ))}
                {entry.images.split('|||').filter(Boolean).length > 3 && (
                  <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500 text-sm">+{entry.images.split('|||').filter(Boolean).length - 3}</span>
                  </div>
                )}
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2 text-gray-500">
                <Heart className="w-4 h-4" />
                <span className="text-sm">Diary Entry</span>
              </div>
              <span className="text-xs text-gray-500">
                {new Date(entry.entryDate || entry.createdAt).toLocaleDateString('vi-VN')}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredEntries.length === 0 && (
        <div className="text-center py-12">
          <Camera className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Chưa có nhật ký nào</h3>
          <p className="text-gray-500 mb-6">Hãy bắt đầu ghi lại những khoảnh khắc đẹp cùng nhau!</p>
          <Link href="/dashboard/diary/new" className="btn-primary">
            Tạo nhật ký đầu tiên
          </Link>
        </div>
      )}
    </div>
  )
}
