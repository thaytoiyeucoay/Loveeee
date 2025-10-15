import { useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'

interface SyncOptions {
  onDataChange?: (data: any) => void
  syncInterval?: number // milliseconds
}

export const useRealTimeSync = (endpoint: string, options: SyncOptions = {}) => {
  const { data: session } = useSession()
  const { onDataChange, syncInterval = 5000 } = options // Default 5 seconds
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const lastDataRef = useRef<string>('')

  useEffect(() => {
    if (!session?.user?.id) return

    const syncData = async () => {
      try {
        const response = await fetch(`${endpoint}?userId=${session.user.id}`)
        if (response.ok) {
          const data = await response.json()
          const dataString = JSON.stringify(data)
          
          // Only trigger callback if data changed
          if (dataString !== lastDataRef.current) {
            lastDataRef.current = dataString
            onDataChange?.(data)
          }
        }
      } catch (error) {
        console.error('Sync error:', error)
      }
    }

    // Initial sync
    syncData()

    // Setup interval for continuous sync
    intervalRef.current = setInterval(syncData, syncInterval)

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [session, endpoint, onDataChange, syncInterval])

  const stopSync = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const resumeSync = () => {
    if (!intervalRef.current && session?.user?.id) {
      const syncData = async () => {
        try {
          const response = await fetch(`${endpoint}?userId=${session.user.id}`)
          if (response.ok) {
            const data = await response.json()
            const dataString = JSON.stringify(data)
            
            if (dataString !== lastDataRef.current) {
              lastDataRef.current = dataString
              onDataChange?.(data)
            }
          }
        } catch (error) {
          console.error('Sync error:', error)
        }
      }

      intervalRef.current = setInterval(syncData, syncInterval)
    }
  }

  return { stopSync, resumeSync }
}
