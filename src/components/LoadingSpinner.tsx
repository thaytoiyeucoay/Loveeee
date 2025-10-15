import React from 'react'
import { Heart } from 'lucide-react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  message?: string
}

export default function LoadingSpinner({ size = 'md', message }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12', 
    lg: 'w-16 h-16'
  }

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className={`${sizeClasses[size]} relative`}>
        {/* Spinning border */}
        <div className="absolute inset-0 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
        {/* Heart icon in center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Heart className={`${size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-6 h-6' : 'w-8 h-8'} text-primary-500 heartbeat`} />
        </div>
      </div>
      {message && (
        <p className="mt-4 text-gray-600 text-center animate-pulse">{message}</p>
      )}
    </div>
  )
}
