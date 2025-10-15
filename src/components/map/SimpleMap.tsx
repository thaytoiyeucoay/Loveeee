'use client'

import React from 'react'
import { MapPin, Navigation, Home } from 'lucide-react'

interface Memory {
  id: string
  title: string
  description: string
  location: {
    name: string
    coordinates: [number, number] // [lat, lng]
  }
  date: string
  type: 'first_date' | 'anniversary' | 'travel' | 'special' | 'everyday' | 'restaurant' | 'home'
  photos: string[]
  mood: string
  rating?: number
}

interface SimpleMapProps {
  memories: Memory[]
  onMemoryClick: (memory: Memory) => void
  selectedMemory: Memory | null
}

export default function SimpleMap({ memories, onMemoryClick, selectedMemory }: SimpleMapProps) {
  const getTypeColor = (type: string) => {
    const colorMap = {
      first_date: 'bg-red-500',
      anniversary: 'bg-yellow-500',
      travel: 'bg-blue-500',
      restaurant: 'bg-orange-500',
      home: 'bg-green-500',
      special: 'bg-purple-500',
      everyday: 'bg-gray-500'
    }
    return colorMap[type as keyof typeof colorMap] || 'bg-gray-500'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  return (
    <div className="w-full h-full relative bg-gradient-to-br from-blue-50 to-green-50 rounded-lg overflow-hidden">
      {/* Map Header */}
      <div className="absolute top-4 left-4 right-4 z-10">
        <div className="bg-white rounded-lg shadow-lg p-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary-500" />
            <span className="font-medium text-gray-800">OpenStreetMap - Miễn phí 100%</span>
            <div className="ml-auto text-sm text-gray-600">
              {memories.length} kỷ niệm
            </div>
          </div>
        </div>
      </div>

      {/* Fallback Map Visualization */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-24 h-24 bg-white rounded-full shadow-lg flex items-center justify-center mx-auto">
            <MapPin className="w-12 h-12 text-primary-500" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Memory Map Placeholder
            </h3>
            <p className="text-gray-600 mb-4">
              Đang chuẩn bị tích hợp OpenStreetMap...
            </p>
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
              ✅ Hoàn toàn miễn phí - Không cần API key
            </div>
          </div>
        </div>
      </div>

      {/* Memory Markers Simulation */}
      <div className="absolute inset-0 pointer-events-none">
        {memories.map((memory, index) => (
          <div
            key={memory.id}
            className="absolute pointer-events-auto cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${20 + (index * 15) % 60}%`,
              top: `${30 + (index * 20) % 40}%`,
            }}
            onClick={() => onMemoryClick(memory)}
            title={memory.title}
          >
            <div className={`w-8 h-8 ${getTypeColor(memory.type)} rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white text-sm hover:scale-110 transition-transform`}>
              {memory.mood}
            </div>
          </div>
        ))}
      </div>

      {/* Selected Memory Info */}
      {selectedMemory && (
        <div className="absolute bottom-4 left-4 right-4 z-10">
          <div className="bg-white rounded-lg shadow-lg p-4">
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 ${getTypeColor(selectedMemory.type)} rounded-full border-2 border-white flex items-center justify-center text-white`}>
                {selectedMemory.mood}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800">{selectedMemory.title}</h4>
                <p className="text-sm text-gray-600 mb-1">{selectedMemory.location.name}</p>
                <p className="text-xs text-gray-500">{formatDate(selectedMemory.date)}</p>
                {selectedMemory.description && (
                  <p className="text-sm text-gray-700 mt-2">{selectedMemory.description}</p>
                )}
                {selectedMemory.rating && (
                  <div className="flex items-center gap-1 mt-2">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-sm ${
                          i < selectedMemory.rating! ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Map Controls */}
      <div className="absolute top-20 right-4 z-10 space-y-2">
        <button className="block w-10 h-10 bg-white border border-gray-300 rounded-lg shadow text-gray-600 hover:bg-gray-50 transition-colors">
          <Navigation className="w-5 h-5 mx-auto" />
        </button>
        <button className="block w-10 h-10 bg-white border border-gray-300 rounded-lg shadow text-gray-600 hover:bg-gray-50 transition-colors">
          <Home className="w-5 h-5 mx-auto" />
        </button>
      </div>

      {/* Coming Soon Banner */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div className="bg-primary-500 text-white px-6 py-3 rounded-lg shadow-lg transform -rotate-12">
          <div className="font-bold text-sm">🗺️ Interactive Map</div>
          <div className="text-xs opacity-90">Coming Soon with OpenStreetMap</div>
        </div>
      </div>
    </div>
  )
}
