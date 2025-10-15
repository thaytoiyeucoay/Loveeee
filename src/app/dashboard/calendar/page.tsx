'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import {
  Calendar,
  Plus,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Heart,
  Star,
  Gift,
  Coffee,
  Camera,
  Music,
  Utensils,
  Film,
  Plane,
  Users,
  Bell,
  Edit,
  Trash2
} from 'lucide-react'
import Link from 'next/link'

export default function CalendarPage() {
  const { data: session } = useSession()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'agenda'>('month')
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [hasCouple, setHasCouple] = useState(false)

  // Fetch real events from API
  useEffect(() => {
    const fetchEvents = async () => {
      if (!session?.user?.id) return

      try {
        // Check if user has couple first
        const coupleResponse = await fetch(`/api/couples?userId=${session.user.id}`)
        if (coupleResponse.ok) {
          const coupleData = await coupleResponse.json()
          setHasCouple(!!coupleData.couple)

          if (coupleData.couple) {
            // Fetch events if has couple
            const eventsResponse = await fetch(`/api/events?userId=${session.user.id}`)
            if (eventsResponse.ok) {
              const eventsData = await eventsResponse.json()
              setEvents(eventsData.events || [])
            }
          }
        }
      } catch (error) {
        console.error('Error fetching events:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [session])

  const mockEvents = [
    {
      id: 1,
      title: 'Hẹn hò xem phim',
      date: '2024-11-15',
      time: '19:00',
      endTime: '22:00',
      location: 'CGV Vincom',
      type: 'date',
      description: 'Xem phim "Avatar 3" - đã đặt vé rồi!',
      reminder: 30,
      participants: ['Bạn', 'Người yêu'],
      cost: 200000,
      isRecurring: false
    },
    {
      id: 2,
      title: 'Kỷ niệm 1 năm yêu nhau',
      date: '2024-12-25',
      time: '18:00',
      endTime: '23:59',
      location: 'Nhà hàng The Deck',
      type: 'anniversary',
      description: 'Kỷ niệm 1 năm bên nhau, đã book bàn view sông rồi ❤️',
      reminder: 1440, // 1 day
      participants: ['Bạn', 'Người yêu'],
      cost: 1500000,
      isRecurring: true
    },
    {
      id: 3,
      title: 'Picnic cuối tuần',
      date: '2024-11-17',
      time: '09:00',
      endTime: '15:00',
      location: 'Công viên Tao Đàn',
      type: 'outdoor',
      description: 'Chuẩn bị đồ ăn, chăn và trò chơi. Thời tiết hôm đó đẹp!',
      reminder: 60,
      participants: ['Bạn', 'Người yêu'],
      cost: 300000,
      isRecurring: false
    },
    {
      id: 4,
      title: 'Sinh nhật người yêu',
      date: '2024-11-20',
      time: '20:00',
      endTime: '23:00',
      location: 'Nhà',
      type: 'birthday',
      description: 'Tổ chức sinh nhật surprise! Đã chuẩn bị quà rồi 🎂',
      reminder: 120,
      participants: ['Bạn', 'Người yêu', 'Bạn bè'],
      cost: 800000,
      isRecurring: true
    },
    {
      id: 5,
      title: 'Học nấu ăn cùng nhau',
      date: '2024-11-22',
      time: '14:00',
      endTime: '17:00',
      location: 'Cooking Class Saigon',
      type: 'activity',
      description: 'Lớp học nấu món Ý, sẽ rất vui!',
      reminder: 60,
      participants: ['Bạn', 'Người yêu'],
      cost: 600000,
      isRecurring: false
    }
  ]

  const getEventIcon = (type: string) => {
    const icons = {
      date: Heart,
      anniversary: Star,
      birthday: Gift,
      outdoor: Camera,
      activity: Users,
      food: Utensils,
      movie: Film,
      travel: Plane,
      music: Music,
      coffee: Coffee
    }
    return icons[type as keyof typeof icons] || Calendar
  }

  const getEventColor = (type: string) => {
    const colors = {
      date: 'bg-pink-100 text-pink-800 border-pink-200',
      anniversary: 'bg-red-100 text-red-800 border-red-200',
      birthday: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      outdoor: 'bg-green-100 text-green-800 border-green-200',
      activity: 'bg-blue-100 text-blue-800 border-blue-200',
      food: 'bg-orange-100 text-orange-800 border-orange-200',
      movie: 'bg-purple-100 text-purple-800 border-purple-200',
      travel: 'bg-indigo-100 text-indigo-800 border-indigo-200'
    }
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const getUpcomingEvents = () => {
    const today = new Date()
    const upcoming = events
      .filter(event => new Date(event.startDate || event.date) >= today)
      .sort((a, b) => new Date(a.startDate || a.date).getTime() - new Date(b.startDate || b.date).getTime())
      .slice(0, 5)
    return upcoming
  }

  const getDaysInMonth = (date: Date): (Date | null)[] => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days: (Date | null)[] = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }
    
    return days
  }

  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return events.filter(event => {
      const eventDate = event.startDate || event.date
      if (!eventDate) return false
      
      // Parse event date properly to avoid timezone issues
      const eventDateObj = new Date(eventDate)
      const eventDateStr = eventDateObj.toLocaleDateString('en-CA') // YYYY-MM-DD format
      
      return eventDateStr === dateStr
    })
  }

  const monthNames = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ]

  const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setCurrentDate(newDate)
  }

  const dateIdeas = [
    { icon: Film, title: 'Xem phim', description: 'Phim mới hay đang chiếu', cost: '200k' },
    { icon: Utensils, title: 'Nhà hàng mới', description: 'Thử món ăn ở chỗ chưa đến', cost: '500k' },
    { icon: Coffee, title: 'Café chill', description: 'Tìm quán café view đẹp', cost: '150k' },
    { icon: Camera, title: 'Chụp ảnh', description: 'Đi chụp ảnh couple ở công viên', cost: '100k' },
    { icon: Music, title: 'Concert', description: 'Nghe nhạc live cùng nhau', cost: '800k' },
    { icon: Users, title: 'Hoạt động nhóm', description: 'Bowling, billiards với bạn bè', cost: '300k' }
  ]

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <span className="ml-2 text-gray-600">Đang tải lịch hẹn...</span>
      </div>
    )
  }

  // Show no couple state
  if (!hasCouple) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">Chưa có couple</h3>
          <p className="text-gray-600 mb-4">Bạn cần thiết lập couple để sử dụng tính năng lịch hẹn.</p>
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
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Lịch hẹn hò</h1>
          <p className="text-gray-600">Lên kế hoạch và quản lý các buổi hẹn cùng nhau ({events.length} sự kiện)</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            {[
              { id: 'month', label: 'Tháng' },
              { id: 'week', label: 'Tuần' },
              { id: 'agenda', label: 'Lịch trình' }
            ].map((mode) => (
              <button
                key={mode.id}
                onClick={() => setViewMode(mode.id as any)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  viewMode === mode.id 
                    ? 'bg-white shadow-sm text-gray-900' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>
          <Link href="/dashboard/calendar/new" className="btn-primary inline-flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Tạo sự kiện
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Calendar */}
        <div className="lg:col-span-3">
          {viewMode === 'month' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card"
            >
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigateMonth('prev')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setCurrentDate(new Date())}
                    className="px-4 py-2 text-sm bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                  >
                    Hôm nay
                  </button>
                  <button
                    onClick={() => navigateMonth('next')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {dayNames.map((day) => (
                  <div key={day} className="p-3 text-center text-sm font-medium text-gray-500">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {getDaysInMonth(currentDate).map((day, index) => {
                  if (!day) {
                    return <div key={index} className="aspect-square p-2"></div>
                  }

                  const dayEvents = getEventsForDate(day)
                  const isToday = day.toDateString() === new Date().toDateString()
                  const isSelected = selectedDate?.toDateString() === day.toDateString()

                  return (
                    <div
                      key={index}
                      onClick={() => setSelectedDate(day)}
                      className={`aspect-square p-2 border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                        isToday ? 'bg-primary-50 border-primary-200' : ''
                      } ${isSelected ? 'bg-primary-100 border-primary-300' : ''}`}
                    >
                      <div className={`text-sm font-medium mb-1 ${
                        isToday ? 'text-primary-600' : 'text-gray-700'
                      }`}>
                        {day.getDate()}
                      </div>
                      <div className="space-y-1">
                        {dayEvents.slice(0, 2).map((event) => {
                          const EventIcon = getEventIcon(event.type)
                          return (
                            <Link
                              key={event.id}
                              href={`/dashboard/calendar/edit/${event.id}`}
                              className={`text-xs p-1 rounded border ${getEventColor(event.type)} truncate hover:shadow-md transition-all group`}
                            >
                              <div className="flex items-center gap-1">
                                <EventIcon className="w-3 h-3 flex-shrink-0" />
                                <span className="truncate">{event.title}</span>
                                <Edit className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                              </div>
                            </Link>
                          )
                        })}
                        {dayEvents.length > 2 && (
                          <div className="text-xs text-gray-500 text-center">
                            +{dayEvents.length - 2} khác
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          )}

          {viewMode === 'agenda' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {getUpcomingEvents().map((event, index) => {
                const EventIcon = getEventIcon(event.type)
                return (
                  <div key={event.id} className="card hover:shadow-lg transition-all">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getEventColor(event.type).replace('text-', 'bg-').replace('border-', '').replace('bg-', 'bg-')}`}>
                        <EventIcon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800">{event.title}</h3>
                            <p className="text-gray-600 text-sm">{event.description}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-gray-800">
                              {new Date(event.date).toLocaleDateString('vi-VN')}
                            </div>
                            <div className="text-sm text-gray-500">
                              {event.time} - {event.endTime}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {event.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {event.participants.join(', ')}
                          </div>
                          <div className="flex items-center gap-1">
                            💰 {event.cost.toLocaleString('vi-VN')} VNĐ
                          </div>
                          {event.reminder && (
                            <div className="flex items-center gap-1">
                              <Bell className="w-4 h-4" />
                              Nhắc {event.reminder} phút trước
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </motion.div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Events */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary-600" />
              Sự kiện sắp tới
            </h3>
            <div className="space-y-3">
              {getUpcomingEvents().slice(0, 3).map((event) => {
                const EventIcon = getEventIcon(event.type)
                const eventDate = new Date(event.startDate || event.date)
                const today = new Date()
                const daysUntil = Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
                
                return (
                  <Link 
                    key={event.id} 
                    href={`/dashboard/calendar/edit/${event.id}`}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getEventColor(event.type)}`}>
                      <EventIcon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-800 text-sm">{event.title}</div>
                      <div className="text-xs text-gray-500">
                        {daysUntil === 0 ? 'Hôm nay' : 
                         daysUntil === 1 ? 'Ngày mai' : 
                         `${daysUntil} ngày nữa`}
                      </div>
                    </div>
                    <Edit className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                )
              })}
            </div>
          </motion.div>

          {/* Date Ideas */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary-600" />
              Ý tưởng hẹn hò
            </h3>
            <div className="space-y-3">
              {dateIdeas.map((idea, index) => (
                <button
                  key={index}
                  className="w-full p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                      <idea.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-800 text-sm">{idea.title}</div>
                      <div className="text-xs text-gray-500">{idea.description}</div>
                    </div>
                    <div className="text-xs text-primary-600 font-medium">{idea.cost}</div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Calendar Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="card"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Thống kê tháng này</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Tổng sự kiện</span>
                <span className="font-semibold text-primary-600">{events.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Hẹn hò</span>
                <span className="font-semibold text-primary-600">
                  {events.filter(e => e.type === 'date').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Chi phí dự kiến</span>
                <span className="font-semibold text-primary-600">
                  {events.reduce((sum, e) => sum + e.cost, 0).toLocaleString('vi-VN')} VNĐ
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
