'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import {
  MapPin,
  Plus,
  Heart,
  Camera,
  Calendar,
  Search,
  Filter,
  MoreVertical,
  Navigation,
  Share2,
  Star,
  Plane,
  Coffee,
  Home
} from 'lucide-react'

// OpenStreetMap with dynamic import to avoid SSR issues
const OpenStreetMap = dynamic(() => import('../../../components/map/OpenStreetMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-2"></div>
        <p className="text-gray-600">Đang tải OpenStreetMap...</p>
      </div>
    </div>
  )
})

const AddMemoryForm = dynamic(() => import('../../../components/map/AddMemoryForm'), {
  ssr: false
})

interface Memory {
  id: string
  title: string
  description: string
  location: {
    name: string
    coordinates: [number, number] // [lat, lng] for Leaflet
  }
  date: string
  type: 'first_date' | 'anniversary' | 'travel' | 'special' | 'everyday' | 'restaurant' | 'home'
  photos: string[]
  mood: string
  rating?: number
}

export default function MemoryMapPage() {
  const [memories, setMemories] = useState<Memory[]>([
    {
      id: '1',
      title: 'Lần đầu gặp nhau',
      description: 'Nơi chúng ta gặp nhau lần đầu tiên tại quán cà phê nhỏ xinh',
      location: {
        name: 'Cafe The Coffee House - Nguyễn Huệ',
        coordinates: [10.7769, 106.7009] // TP.HCM
      },
      date: '2023-02-14',
      type: 'first_date',
      photos: ['/memories/first-date.jpg'],
      mood: '😍',
      rating: 5
    },
    {
      id: '2',
      title: 'Chuyến du lịch Đà Lạt',
      description: 'Kỳ nghỉ lãng mạn đầu tiên của chúng ta ở thành phố ngàn hoa',
      location: {
        name: 'Hồ Xuân Hương, Đà Lạt',
        coordinates: [11.9404, 108.4583] // Đà Lạt
      },
      date: '2023-06-20',
      type: 'travel',
      photos: ['/memories/dalat-trip.jpg'],
      mood: '🥰',
      rating: 5
    },
    {
      id: '3',
      title: 'Kỷ niệm 6 tháng yêu nhau',
      description: 'Bữa tối đặc biệt tại nhà hàng cao cấp để kỷ niệm',
      location: {
        name: 'Nhà hàng Shri Restaurant & Lounge',
        coordinates: [10.7829, 106.6934]
      },
      date: '2023-08-14',
      type: 'anniversary',
      photos: ['/memories/anniversary.jpg'],
      mood: '💕',
      rating: 5
    },
    {
      id: '4',
      title: 'Nhà của anh',
      description: 'Lần đầu em đến thăm nhà anh, gặp gia đình',
      location: {
        name: 'Quận 7, TP.HCM',
        coordinates: [10.7378, 106.7017]
      },
      date: '2023-09-10',
      type: 'home',
      photos: ['/memories/home-visit.jpg'],
      mood: '😊',
      rating: 4
    },
    {
      id: '5',
      title: 'Quán ăn yêu thích',
      description: 'Nơi chúng ta thường đến mỗi cuối tuần',
      location: {
        name: 'Phở Hòa Pasteur',
        coordinates: [10.7756, 106.6946]
      },
      date: '2023-10-05',
      type: 'restaurant',
      photos: ['/memories/favorite-restaurant.jpg'],
      mood: '😋',
      rating: 4
    }
  ])

  const [selectedType, setSelectedType] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)

  const memoryTypes = [
    { id: 'all', label: 'Tất cả', icon: MapPin, count: memories.length },
    { id: 'first_date', label: 'Hẹn hò đầu', icon: Heart, count: memories.filter(m => m.type === 'first_date').length },
    { id: 'anniversary', label: 'Kỷ niệm', icon: Star, count: memories.filter(m => m.type === 'anniversary').length },
    { id: 'travel', label: 'Du lịch', icon: Plane, count: memories.filter(m => m.type === 'travel').length },
    { id: 'restaurant', label: 'Nhà hàng', icon: Coffee, count: memories.filter(m => m.type === 'restaurant').length },
    { id: 'home', label: 'Nhà cửa', icon: Home, count: memories.filter(m => m.type === 'home').length }
  ]

  const filteredMemories = memories.filter(memory => {
    const matchesType = selectedType === 'all' || memory.type === selectedType
    const matchesSearch = memory.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         memory.location.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesType && matchesSearch
  })

  const handleAddMemory = (newMemory: Memory) => {
    setMemories(prev => [...prev, newMemory])
  }

  const getTypeIcon = (type: string) => {
    const typeMap = {
      first_date: Heart,
      anniversary: Star,
      travel: Plane,
      restaurant: Coffee,
      home: Home,
      special: Star,
      everyday: MapPin
    }
    return typeMap[type as keyof typeof typeMap] || MapPin
  }

  const getTypeColor = (type: string) => {
    const colorMap = {
      first_date: 'text-red-500',
      anniversary: 'text-yellow-500',
      travel: 'text-blue-500',
      restaurant: 'text-orange-500',
      home: 'text-green-500',
      special: 'text-purple-500',
      everyday: 'text-gray-500'
    }
    return colorMap[type as keyof typeof colorMap] || 'text-gray-500'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Bản đồ kỷ niệm</h1>
          <p className="text-gray-600">Những địa điểm đặc biệt trong hành trình tình yêu</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary flex items-center gap-2">
            <Share2 className="w-4 h-4" />
            Chia sẻ
          </button>
          <button 
            onClick={() => setShowAddForm(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Thêm địa điểm
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card text-center"
        >
          <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-3">
            <MapPin className="w-6 h-6 text-white" />
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-1">{memories.length}</div>
          <div className="text-sm text-gray-600">Địa điểm</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card text-center"
        >
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Plane className="w-6 h-6 text-white" />
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-1">{memories.filter(m => m.type === 'travel').length}</div>
          <div className="text-sm text-gray-600">Chuyến đi</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card text-center"
        >
          <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Star className="w-6 h-6 text-white" />
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-1">{memories.filter(m => m.type === 'anniversary').length}</div>
          <div className="text-sm text-gray-600">Kỷ niệm</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card text-center"
        >
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-1">
            {(memories.reduce((sum, m) => sum + (m.rating || 0), 0) / memories.filter(m => m.rating).length || 0).toFixed(1)}
          </div>
          <div className="text-sm text-gray-600">Đánh giá TB</div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card p-0 overflow-hidden"
          >
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">Bản đồ tương tác</h3>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Navigation className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreVertical className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>

            <div className="h-96">
              <OpenStreetMap 
                memories={filteredMemories}
                onMemoryClick={(memory: Memory) => setSelectedMemory(memory)}
                selectedMemory={selectedMemory}
              />
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Search & Filter */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card"
          >
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm địa điểm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Loại địa điểm</label>
                <div className="space-y-1">
                  {memoryTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      className={`w-full flex items-center justify-between p-2 rounded-lg transition-colors ${
                        selectedType === type.id
                          ? 'bg-primary-100 text-primary-700'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <type.icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{type.label}</span>
                      </div>
                      <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">{type.count}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Memory List */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="card"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Danh sách kỷ niệm ({filteredMemories.length})
            </h3>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredMemories.map((memory) => {
                const IconComponent = getTypeIcon(memory.type)
                return (
                  <button
                    key={memory.id}
                    onClick={() => setSelectedMemory(memory)}
                    className={`w-full text-left p-3 rounded-lg border transition-all hover:shadow-md ${
                      selectedMemory?.id === memory.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg bg-gray-100 ${getTypeColor(memory.type)}`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-800 truncate">{memory.title}</h4>
                        <p className="text-sm text-gray-600 truncate">{memory.location.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500">
                            {new Date(memory.date).toLocaleDateString('vi-VN')}
                          </span>
                          <span className="text-sm">{memory.mood}</span>
                          {memory.rating && (
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < memory.rating! ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </motion.div>

          {/* Selected Memory Details */}
          {selectedMemory && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card bg-gradient-to-r from-primary-500 to-secondary-500 text-white"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                  {React.createElement(getTypeIcon(selectedMemory.type), {
                    className: "w-5 h-5"
                  })}
                </div>
                <div>
                  <h4 className="font-semibold">{selectedMemory.title}</h4>
                  <p className="text-sm opacity-90">{selectedMemory.location.name}</p>
                </div>
              </div>
              <p className="text-sm opacity-90 mb-3">{selectedMemory.description}</p>
              <div className="flex items-center justify-between text-sm">
                <span>{new Date(selectedMemory.date).toLocaleDateString('vi-VN')}</span>
                <div className="flex items-center gap-2">
                  <span className="text-lg">{selectedMemory.mood}</span>
                  {selectedMemory.rating && (
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < selectedMemory.rating! ? 'text-yellow-300 fill-current' : 'text-white text-opacity-30'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Add Memory Form */}
      <AddMemoryForm
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSave={handleAddMemory}
      />
    </div>
  )
}
