'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  MapPin,
  Calendar,
  Heart,
  Star,
  Camera,
  Save,
  Search,
  Plane,
  Coffee,
  Home
} from 'lucide-react'

interface AddMemoryFormProps {
  isOpen: boolean
  onClose: () => void
  onSave: (memory: any) => void
}

export default function AddMemoryForm({ isOpen, onClose, onSave }: AddMemoryFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    locationName: '',
    coordinates: [10.7769, 106.7009] as [number, number],
    date: new Date().toISOString().split('T')[0],
    type: 'special',
    mood: '😊',
    rating: 5,
    photos: [] as string[]
  })

  const [searchLocation, setSearchLocation] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  const memoryTypes = [
    { id: 'first_date', label: 'Hẹn hò đầu', icon: Heart, color: 'bg-red-100 text-red-800' },
    { id: 'anniversary', label: 'Kỷ niệm', icon: Star, color: 'bg-yellow-100 text-yellow-800' },
    { id: 'travel', label: 'Du lịch', icon: Plane, color: 'bg-blue-100 text-blue-800' },
    { id: 'restaurant', label: 'Nhà hàng', icon: Coffee, color: 'bg-orange-100 text-orange-800' },
    { id: 'home', label: 'Nhà cửa', icon: Home, color: 'bg-green-100 text-green-800' },
    { id: 'special', label: 'Đặc biệt', icon: Star, color: 'bg-purple-100 text-purple-800' }
  ]

  const moods = ['😍', '🥰', '😊', '😂', '🤗', '😘', '💕', '❤️', '🌟', '✨', '🎉', '🥳', '😋', '😌', '🤩', '💖']

  const handleLocationSearch = async () => {
    if (!searchLocation.trim()) return

    setIsSearching(true)
    
    try {
      // Using Nominatim API (free OpenStreetMap geocoding service)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchLocation)}&limit=5&countrycodes=vn`
      )
      const data = await response.json()
      
      if (data && data.length > 0) {
        const result = data[0]
        setFormData(prev => ({
          ...prev,
          locationName: result.display_name,
          coordinates: [parseFloat(result.lat), parseFloat(result.lon)]
        }))
      } else {
        alert('Không tìm thấy địa điểm. Vui lòng thử lại với tên khác.')
      }
    } catch (error) {
      console.error('Error searching location:', error)
      alert('Có lỗi xảy ra khi tìm kiếm địa điểm.')
    } finally {
      setIsSearching(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim() || !formData.locationName.trim()) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc.')
      return
    }

    const newMemory = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      location: {
        name: formData.locationName,
        coordinates: formData.coordinates
      },
      date: formData.date,
      type: formData.type,
      mood: formData.mood,
      rating: formData.rating,
      photos: formData.photos
    }

    onSave(newMemory)
    onClose()
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      locationName: '',
      coordinates: [10.7769, 106.7009],
      date: new Date().toISOString().split('T')[0],
      type: 'special',
      mood: '😊',
      rating: 5,
      photos: []
    })
    setSearchLocation('')
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            coordinates: [position.coords.latitude, position.coords.longitude]
          }))
          // Reverse geocoding to get address
          reverseGeocode(position.coords.latitude, position.coords.longitude)
        },
        (error) => {
          console.error('Error getting location:', error)
          alert('Không thể lấy vị trí hiện tại. Vui lòng cho phép truy cập vị trí.')
        }
      )
    } else {
      alert('Trình duyệt không hỗ trợ định vị.')
    }
  }

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      )
      const data = await response.json()
      
      if (data && data.display_name) {
        setFormData(prev => ({
          ...prev,
          locationName: data.display_name
        }))
      }
    } catch (error) {
      console.error('Error reverse geocoding:', error)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">Thêm kỷ niệm mới</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tiêu đề *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="VD: Buổi hẹn đầu tiên"
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ngày
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                      className="input-field"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mô tả
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Kể về kỷ niệm này..."
                    rows={3}
                    className="input-field"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Địa điểm *
                  </label>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={searchLocation}
                          onChange={(e) => setSearchLocation(e.target.value)}
                          placeholder="Tìm kiếm địa điểm..."
                          className="input-field pl-10"
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleLocationSearch())}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleLocationSearch}
                        disabled={isSearching}
                        className="btn-secondary disabled:opacity-50"
                      >
                        {isSearching ? 'Đang tìm...' : 'Tìm'}
                      </button>
                      <button
                        type="button"
                        onClick={getCurrentLocation}
                        className="btn-secondary"
                        title="Vị trí hiện tại"
                      >
                        📍
                      </button>
                    </div>
                    
                    {formData.locationName && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-green-800">{formData.locationName}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Loại kỷ niệm
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {memoryTypes.map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, type: type.id }))}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          formData.type === type.id
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <type.icon className="w-5 h-5 mx-auto mb-2 text-gray-600" />
                        <div className="text-sm font-medium text-gray-700">{type.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mood & Rating */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Tâm trạng
                    </label>
                    <div className="grid grid-cols-8 gap-2">
                      {moods.map((mood) => (
                        <button
                          key={mood}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, mood }))}
                          className={`p-2 rounded-lg text-lg hover:bg-gray-100 transition-colors ${
                            formData.mood === mood ? 'bg-primary-100 ring-2 ring-primary-500' : ''
                          }`}
                        >
                          {mood}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Đánh giá
                    </label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, rating }))}
                          className="p-1"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              rating <= formData.rating
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </form>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmit}
                className="btn-primary flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Lưu kỷ niệm
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
