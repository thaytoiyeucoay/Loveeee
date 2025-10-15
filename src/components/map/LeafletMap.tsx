'use client'

import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Custom icons for different memory types
const createCustomIcon = (type: string, mood: string) => {
  const colorMap = {
    first_date: '#ef4444', // red
    anniversary: '#eab308', // yellow
    travel: '#3b82f6', // blue
    restaurant: '#f97316', // orange
    home: '#22c55e', // green
    special: '#a855f7', // purple
    everyday: '#6b7280' // gray
  }

  const color = colorMap[type as keyof typeof colorMap] || '#6b7280'

  return L.divIcon({
    html: `
      <div style="
        background-color: ${color};
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 3px solid white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        position: relative;
      ">
        <span style="filter: grayscale(0);">${mood}</span>
      </div>
    `,
    className: 'custom-marker',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15]
  })
}

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

interface LeafletMapProps {
  memories: Memory[]
  onMemoryClick: (memory: Memory) => void
  selectedMemory: Memory | null
}

export default function LeafletMap({ memories, onMemoryClick, selectedMemory }: LeafletMapProps) {
  const [map, setMap] = useState<L.Map | null>(null)

  // Default center (Ho Chi Minh City)
  const defaultCenter: [number, number] = [10.7769, 106.7009]
  const defaultZoom = 11

  // Calculate bounds to fit all memories
  const getBounds = () => {
    if (memories.length === 0) return null
    
    const latitudes = memories.map(m => m.location.coordinates[0])
    const longitudes = memories.map(m => m.location.coordinates[1])
    
    const minLat = Math.min(...latitudes)
    const maxLat = Math.max(...latitudes)
    const minLng = Math.min(...longitudes)
    const maxLng = Math.max(...longitudes)
    
    return [[minLat, minLng], [maxLat, maxLng]] as [[number, number], [number, number]]
  }

  // Auto-fit map to show all memories
  useEffect(() => {
    if (map && memories.length > 0) {
      const bounds = getBounds()
      if (bounds) {
        map.fitBounds(bounds, { padding: [20, 20] })
      }
    }
  }, [map, memories])

  // Focus on selected memory
  useEffect(() => {
    if (map && selectedMemory) {
      map.setView(selectedMemory.location.coordinates, 15, {
        animate: true,
        duration: 1
      })
    }
  }, [map, selectedMemory])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const getTypeLabel = (type: string) => {
    const typeLabels = {
      first_date: 'Hẹn hò đầu',
      anniversary: 'Kỷ niệm',
      travel: 'Du lịch',
      restaurant: 'Nhà hàng',
      home: 'Nhà cửa',
      special: 'Đặc biệt',
      everyday: 'Thường ngày'
    }
    return typeLabels[type as keyof typeof typeLabels] || 'Khác'
  }

  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        className="w-full h-full rounded-lg"
        ref={setMap}
        scrollWheelZoom={true}
        zoomControl={true}
      >
        {/* OpenStreetMap tile layer - Free! */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          maxZoom={19}
        />

        {/* Memory markers */}
        {memories.map((memory) => (
          <Marker
            key={memory.id}
            position={memory.location.coordinates}
            icon={createCustomIcon(memory.type, memory.mood)}
            eventHandlers={{
              click: () => onMemoryClick(memory)
            }}
          >
            <Popup
              maxWidth={300}
              className="custom-popup"
            >
              <div className="p-2">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{memory.mood}</span>
                  <div>
                    <h3 className="font-semibold text-gray-800 text-sm">{memory.title}</h3>
                    <p className="text-xs text-gray-600">{getTypeLabel(memory.type)}</p>
                  </div>
                </div>
                
                <p className="text-sm text-gray-700 mb-2">{memory.description}</p>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{memory.location.name}</span>
                  <span>{formatDate(memory.date)}</span>
                </div>
                
                {memory.rating && (
                  <div className="flex items-center gap-1 mt-2">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-xs ${
                          i < memory.rating! ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                )}
                
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onMemoryClick(memory)
                  }}
                  className="w-full mt-2 py-1 px-2 bg-primary-500 text-white text-xs rounded hover:bg-primary-600 transition-colors"
                >
                  Xem chi tiết
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Map controls overlay */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-2 space-y-2 z-[1000]">
        <button
          onClick={() => {
            if (map && memories.length > 0) {
              const bounds = getBounds()
              if (bounds) {
                map.fitBounds(bounds, { padding: [20, 20] })
              }
            }
          }}
          className="block w-8 h-8 bg-white border border-gray-300 rounded text-gray-600 hover:bg-gray-50 transition-colors text-xs"
          title="Hiển thị tất cả"
        >
          ⌂
        </button>
        
        <button
          onClick={() => {
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(
                (position) => {
                  if (map) {
                    map.setView([position.coords.latitude, position.coords.longitude], 15)
                  }
                },
                (error) => {
                  console.error('Error getting location:', error)
                }
              )
            }
          }}
          className="block w-8 h-8 bg-white border border-gray-300 rounded text-gray-600 hover:bg-gray-50 transition-colors text-xs"
          title="Vị trí hiện tại"
        >
          📍
        </button>
      </div>

      {/* Memory count indicator */}
      {memories.length > 0 && (
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg px-3 py-2 z-[1000]">
          <div className="text-sm font-medium text-gray-800">
            {memories.length} kỷ niệm
          </div>
          <div className="text-xs text-gray-600">
            Được hiển thị trên bản đồ
          </div>
        </div>
      )}

      {/* Custom CSS for popup styling */}
      <style jsx global>{`
        .custom-popup .leaflet-popup-content-wrapper {
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        
        .custom-popup .leaflet-popup-content {
          margin: 0;
          padding: 0;
        }
        
        .custom-popup .leaflet-popup-tip {
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .custom-marker {
          background: transparent !important;
          border: none !important;
        }
        
        .leaflet-control-zoom {
          border: none !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
        }
        
        .leaflet-control-zoom a {
          background-color: white !important;
          border-bottom: 1px solid #ddd !important;
          color: #374151 !important;
          font-size: 16px !important;
          line-height: 26px !important;
          width: 26px !important;
          height: 26px !important;
        }
        
        .leaflet-control-zoom a:hover {
          background-color: #f9fafb !important;
        }
      `}</style>
    </div>
  )
}
