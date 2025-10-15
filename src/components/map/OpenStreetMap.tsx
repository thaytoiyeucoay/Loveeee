'use client'

import { useEffect, useRef, useState } from 'react'

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

interface OpenStreetMapProps {
  memories: Memory[]
  onMemoryClick: (memory: Memory) => void
  selectedMemory: Memory | null
}

export default function OpenStreetMap({ memories, onMemoryClick, selectedMemory }: OpenStreetMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Initialize map
  useEffect(() => {
    let mounted = true

    const initMap = async () => {
      try {
        // Dynamic import to avoid SSR issues
        const L = await import('leaflet')
        
        // Load CSS dynamically
        if (!document.getElementById('leaflet-css')) {
          const link = document.createElement('link')
          link.id = 'leaflet-css'
          link.rel = 'stylesheet'
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
          document.head.appendChild(link)
        }

        if (!mounted || !mapRef.current) return

        // Fix marker icons
        delete (L.Icon.Default.prototype as any)._getIconUrl
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        })

        // Create map
        const map = L.map(mapRef.current, {
          center: [10.7769, 106.7009], // Ho Chi Minh City
          zoom: 11,
          zoomControl: true,
          scrollWheelZoom: true
        })

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map)

        mapInstanceRef.current = map
        setIsLoading(false)

      } catch (err) {
        console.error('Failed to load map:', err)
        setError('Không thể tải bản đồ. Vui lòng thử lại.')
        setIsLoading(false)
      }
    }

    initMap()

    return () => {
      mounted = false
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  // Create custom icons for different memory types
  const createCustomIcon = async (type: string, mood: string) => {
    const L = await import('leaflet')
    
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
          cursor: pointer;
        ">
          <span>${mood}</span>
        </div>
      `,
      className: 'custom-marker',
      iconSize: [30, 30],
      iconAnchor: [15, 15],
      popupAnchor: [0, -15]
    })
  }

  // Add markers
  useEffect(() => {
    if (!mapInstanceRef.current || memories.length === 0) return

    const addMarkers = async () => {
      try {
        const L = await import('leaflet')
        
        // Clear existing markers
        markersRef.current.forEach(marker => marker.remove())
        markersRef.current = []

        // Add new markers
        for (const memory of memories) {
          const icon = await createCustomIcon(memory.type, memory.mood)
          
          const marker = L.marker(memory.location.coordinates, { icon })
            .addTo(mapInstanceRef.current)
            .bindPopup(`
              <div style="padding: 8px; min-width: 200px;">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                  <span style="font-size: 18px;">${memory.mood}</span>
                  <div>
                    <h3 style="margin: 0; font-size: 14px; font-weight: 600; color: #1f2937;">${memory.title}</h3>
                    <p style="margin: 0; font-size: 12px; color: #6b7280;">${getTypeLabel(memory.type)}</p>
                  </div>
                </div>
                <p style="margin: 0 0 8px 0; font-size: 13px; color: #374151;">${memory.description}</p>
                <div style="display: flex; justify-content: space-between; font-size: 11px; color: #9ca3af; margin-bottom: 8px;">
                  <span>${memory.location.name}</span>
                  <span>${formatDate(memory.date)}</span>
                </div>
                ${memory.rating ? `
                  <div style="display: flex; gap: 2px; margin-bottom: 8px;">
                    ${[...Array(5)].map((_, i) => `
                      <span style="color: ${i < memory.rating! ? '#fbbf24' : '#d1d5db'}; font-size: 12px;">★</span>
                    `).join('')}
                  </div>
                ` : ''}
                <button 
                  onclick="window.selectMemory('${memory.id}')"
                  style="
                    width: 100%; 
                    padding: 4px 8px; 
                    background: #3b82f6; 
                    color: white; 
                    border: none; 
                    border-radius: 4px; 
                    font-size: 12px; 
                    cursor: pointer;
                  "
                >
                  Xem chi tiết
                </button>
              </div>
            `)
            .on('click', () => onMemoryClick(memory))

          markersRef.current.push(marker)
        }

        // Fit bounds to show all markers
        if (memories.length > 0) {
          const group = new L.FeatureGroup(markersRef.current)
          mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1))
        }

      } catch (err) {
        console.error('Failed to add markers:', err)
      }
    }

    addMarkers()
  }, [memories, onMemoryClick])

  // Focus on selected memory
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedMemory) return

    const L = window.L || require('leaflet')
    mapInstanceRef.current.setView(selectedMemory.location.coordinates, 15, {
      animate: true,
      duration: 1
    })
  }, [selectedMemory])

  // Helper functions
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

  // Handle current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation || !mapInstanceRef.current) return

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([position.coords.latitude, position.coords.longitude], 15)
        }
      },
      (error) => {
        console.error('Error getting location:', error)
        alert('Không thể lấy vị trí hiện tại. Vui lòng cho phép truy cập vị trí.')
      }
    )
  }

  // Show all memories
  const showAllMemories = async () => {
    if (!mapInstanceRef.current || memories.length === 0) return

    try {
      const L = await import('leaflet')
      const group = new L.FeatureGroup(markersRef.current)
      mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1))
    } catch (err) {
      console.error('Failed to show all memories:', err)
    }
  }

  // Global function for popup button
  useEffect(() => {
    (window as any).selectMemory = (memoryId: string) => {
      const memory = memories.find(m => m.id === memoryId)
      if (memory) onMemoryClick(memory)
    }

    return () => {
      delete (window as any).selectMemory
    }
  }, [memories, onMemoryClick])

  if (error) {
    return (
      <div className="w-full h-full bg-red-50 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <p className="text-red-700 font-medium mb-2">Lỗi tải bản đồ</p>
          <p className="text-red-600 text-sm">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full relative">
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center z-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-2"></div>
            <p className="text-gray-600">Đang tải OpenStreetMap...</p>
          </div>
        </div>
      )}

      {/* Map container */}
      <div 
        ref={mapRef} 
        className="w-full h-full rounded-lg"
        style={{ minHeight: '400px' }}
      />

      {/* Map controls */}
      {!isLoading && (
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-2 space-y-2 z-[1000]">
          <button
            onClick={showAllMemories}
            className="block w-8 h-8 bg-white border border-gray-300 rounded text-gray-600 hover:bg-gray-50 transition-colors text-xs"
            title="Hiển thị tất cả"
          >
            ⌂
          </button>
          
          <button
            onClick={getCurrentLocation}
            className="block w-8 h-8 bg-white border border-gray-300 rounded text-gray-600 hover:bg-gray-50 transition-colors text-xs"
            title="Vị trí hiện tại"
          >
            📍
          </button>
        </div>
      )}

      {/* Memory count indicator */}
      {!isLoading && memories.length > 0 && (
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg px-3 py-2 z-[1000]">
          <div className="text-sm font-medium text-gray-800">
            {memories.length} kỷ niệm
          </div>
          <div className="text-xs text-gray-600">
            OpenStreetMap - Miễn phí 100%
          </div>
        </div>
      )}
    </div>
  )
}
