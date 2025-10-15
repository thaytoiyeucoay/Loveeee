'use client'

import React from 'react'
import dynamic from 'next/dynamic'

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

interface MapComponentProps {
  memories: Memory[]
  onMemoryClick: (memory: Memory) => void
  selectedMemory: Memory | null
}

// Dynamically import leaflet to avoid SSR issues
const DynamicMap = dynamic(
  () => import('./LeafletMap'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-2"></div>
          <p className="text-gray-600">Đang tải bản đồ...</p>
        </div>
      </div>
    )
  }
) as React.ComponentType<MapComponentProps>

export default function MapComponent(props: MapComponentProps) {
  return <DynamicMap {...props} />
}
