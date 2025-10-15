'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import {
  Star,
  Plus,
  Check,
  Clock,
  MapPin,
  Heart,
  Camera,
  Calendar,
  Filter,
  Search,
  Sparkles,
  Target,
  Trophy,
  Gift,
  Edit3,
  Trash2,
  CheckCircle,
  Circle,
  X
} from 'lucide-react'
import Link from 'next/link'

export default function BucketListPage() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [hasCouple, setHasCouple] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    category: 'travel',
    priority: 'medium',
    notes: ''
  })

  const categories = [
    { id: 'all', label: 'Tất cả', icon: Star, color: 'bg-gray-100' },
    { id: 'travel', label: 'Du lịch', icon: MapPin, color: 'bg-blue-100' },
    { id: 'adventure', label: 'Phiêu lưu', icon: Target, color: 'bg-green-100' },
    { id: 'food', label: 'Ẩm thực', icon: Gift, color: 'bg-orange-100' },
    { id: 'experience', label: 'Trải nghiệm', icon: Sparkles, color: 'bg-purple-100' },
    { id: 'romantic', label: 'Lãng mạn', icon: Heart, color: 'bg-pink-100' }
  ]

  // Fetch bucket list items function
  const fetchData = async () => {
    if (!session?.user?.id) return
    
    setLoading(true)
    try {
      // Check if user has couple
      const coupleResponse = await fetch(`/api/couples?userId=${session.user.id}`)
      if (coupleResponse.ok) {
        const coupleData = await coupleResponse.json()
        setHasCouple(!!coupleData.couple)
        if (coupleData.couple) {
          // Fetch bucket list items if has couple
          const itemsResponse = await fetch(`/api/bucket-list?userId=${session.user.id}`)
          if (itemsResponse.ok) {
            const itemsData = await itemsResponse.json()
            console.log('Bucket list API response:', itemsData)
            setItems(itemsData.items || [])
            console.log('Items set to state:', itemsData.items || [])
          } else {
            console.error('Failed to fetch bucket list items:', itemsResponse.status)
          }
        }
      }
    } catch (error) {
      console.error('Error fetching bucket list:', error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch data on session change
  useEffect(() => {
    fetchData()
  }, [session?.user?.id])

  // Refresh data when page becomes visible (useful when returning from new page)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && session?.user?.id) {
        fetchData()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [session?.user?.id])

  // Edit item function
  const handleEditItem = (item: any) => {
    setEditingItem(item)
    setEditForm({
      title: item.title || '',
      description: item.description || '',
      category: item.category || 'travel',
      priority: item.priority || 'medium',
      notes: item.notes || ''
    })
  }

  // Update item function
  const handleUpdateItem = async () => {
    if (!editingItem) return

    try {
      const response = await fetch('/api/bucket-list', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          itemId: editingItem.id,
          userId: session?.user?.id,
          title: editForm.title,
          description: editForm.description,
          category: editForm.category,
          priority: editForm.priority,
          notes: editForm.notes
        })
      })

      if (response.ok) {
        // Refresh items
        await fetchData()
        setEditingItem(null)
        alert('✅ Item updated successfully!')
      } else {
        const error = await response.json()
        alert('❌ ' + error.error)
      }
    } catch (error) {
      console.error('Error updating item:', error)
      alert('❌ Failed to update item')
    }
  }

  // Toggle complete status
  const handleToggleComplete = async (itemId: string, isCompleted: boolean) => {
    try {
      const response = await fetch('/api/bucket-list', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          itemId,
          userId: session?.user?.id,
          isCompleted: !isCompleted
        })
      })

      if (response.ok) {
        // Update local state
        setItems(prev => prev.map(item => 
          item.id === itemId ? { ...item, isCompleted: !isCompleted, completedAt: !isCompleted ? new Date() : null } : item
        ))
      } else {
        const error = await response.json()
        alert('❌ ' + error.error)
      }
    } catch (error) {
      console.error('Error toggling complete:', error)
      alert('❌ Failed to update item')
    }
  }

  // Delete item function
  const handleDeleteItem = async (itemId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa item này?')) return

    try {
      const response = await fetch(`/api/bucket-list?itemId=${itemId}&userId=${session?.user?.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        // Remove from local state
        setItems(prev => prev.filter(item => item.id !== itemId))
        alert('✅ Item deleted successfully!')
      } else {
        const error = await response.json()
        alert('❌ ' + error.error)
      }
    } catch (error) {
      console.error('Error deleting item:', error)
      alert('❌ Failed to delete item')
    }
  }

  // Filter items
  const filteredItems = items.filter(item => {
    const matchesTab = activeTab === 'all' || 
      (activeTab === 'todo' && !item.isCompleted) ||
      (activeTab === 'completed' && item.isCompleted)
    
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory
    const matchesSearch = item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesTab && matchesCategory && matchesSearch
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <span className="ml-2 text-gray-600">Đang tải bucket list...</span>
      </div>
    )
  }

  if (!hasCouple) {
    return (
      <div className="text-center py-12">
        <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">Chưa có couple</h3>
        <p className="text-gray-500 mb-6">Bạn cần có couple để sử dụng tính năng Bucket List</p>
        <Link href="/dashboard/couple/setup" className="btn-primary">
          Thiết lập Couple
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Bucket List</h1>
          <p className="text-gray-600">Danh sách những điều muốn làm cùng nhau ({items.length} items)</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            disabled={loading}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            {loading ? 'Đang tải...' : 'Refresh'}
          </button>
          <Link href="/dashboard/bucket-list/new" className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Thêm mục tiêu
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'all', label: 'Tất cả', count: items.length },
          { id: 'todo', label: 'Chưa hoàn thành', count: items.filter(item => !item.isCompleted).length },
          { id: 'completed', label: 'Đã hoàn thành', count: items.filter(item => item.isCompleted).length }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        {/* Category Filter */}
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.label}
            </option>
          ))}
        </select>

        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item, index) => {
          const category = categories.find(cat => cat.id === item.category)
          const isCompleted = item.isCompleted

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-6 rounded-xl border-2 ${
                isCompleted 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-white border-gray-200 hover:border-primary-300'
              } transition-all`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleToggleComplete(item.id, item.isCompleted)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      isCompleted
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'border-gray-300 hover:border-primary-500'
                    }`}
                  >
                    {isCompleted && <Check className="w-4 h-4" />}
                  </button>
                  <div className={`p-2 rounded-lg ${category?.color || 'bg-gray-100'}`}>
                    {category && <category.icon className="w-4 h-4" />}
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => handleEditItem(item)}
                    className="p-1 text-gray-400 hover:text-primary-500 transition-colors"
                    title="Chỉnh sửa"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteItem(item.id)}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    title="Xóa"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="mb-4">
                <h3 className={`text-lg font-semibold mb-2 ${
                  isCompleted ? 'text-green-800 line-through' : 'text-gray-800'
                }`}>
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-3">
                  {item.description}
                </p>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <div className={`px-2 py-1 rounded ${
                    item.priority === 'high' ? 'bg-red-100 text-red-700' :
                    item.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {item.priority === 'high' ? 'Cao' : item.priority === 'medium' ? 'Trung bình' : 'Thấp'}
                  </div>
                  <span>{category?.label}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                </div>
              </div>

              {/* Completed info */}
              {isCompleted && item.completedAt && (
                <div className="mt-3 pt-3 border-t border-green-200">
                  <div className="flex items-center gap-2 text-green-700 text-sm">
                    <Trophy className="w-4 h-4" />
                    Hoàn thành ngày {new Date(item.completedAt).toLocaleDateString('vi-VN')}
                  </div>
                </div>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && !loading && (
        <div className="text-center py-12">
          <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            {items.length === 0 ? 'Chưa có mục tiêu nào' : 'Không tìm thấy kết quả'}
          </h3>
          <p className="text-gray-500 mb-6">
            {items.length === 0 
              ? 'Hãy thêm những điều bạn muốn làm cùng nhau' 
              : 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm'
            }
          </p>
          {items.length === 0 && (
            <Link href="/dashboard/bucket-list/new" className="btn-primary">
              Thêm mục tiêu đầu tiên
            </Link>
          )}
        </div>
      )}

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Chỉnh sửa mục tiêu</h3>
              <button 
                onClick={() => setEditingItem(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tiêu đề *</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Tên mục tiêu..."
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
                <textarea
                  rows={3}
                  value={editForm.description}
                  onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Mô tả chi tiết..."
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Danh mục</label>
                <select
                  value={editForm.category}
                  onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {categories.slice(1).map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Độ ưu tiên</label>
                <select
                  value={editForm.priority}
                  onChange={(e) => setEditForm(prev => ({ ...prev, priority: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="low">Thấp</option>
                  <option value="medium">Trung bình</option>
                  <option value="high">Cao</option>
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ghi chú</label>
                <textarea
                  rows={2}
                  value={editForm.notes}
                  onChange={(e) => setEditForm(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Ghi chú thêm..."
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
              <button
                onClick={() => setEditingItem(null)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleUpdateItem}
                className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
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
