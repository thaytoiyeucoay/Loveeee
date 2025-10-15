'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import AuthGuard from '../../components/AuthGuard'
import { useSession, signOut } from 'next-auth/react'
import {
  Heart,
  Home,
  MessageCircle,
  Camera,
  Star,
  Calendar,
  Users,
  Wallet,
  MapPin,
  Smile,
  Menu,
  X,
  Settings,
  Bell,
  LogOut,
} from 'lucide-react'

const navigationItems = [
  { href: '/dashboard', icon: Home, label: 'Trang chủ' },
  { href: '/dashboard/couple', icon: Users, label: 'Couple' },
  { href: '/dashboard/messages', icon: Heart, label: 'Lời nhắn' },
  { href: '/dashboard/chat', icon: MessageCircle, label: 'Chat' },
  { href: '/dashboard/diary', icon: Camera, label: 'Nhật ký' },
  { href: '/dashboard/bucket-list', icon: Star, label: 'Bucket List' },
  { href: '/dashboard/calendar', icon: Calendar, label: 'Lịch hẹn' },
  { href: '/dashboard/games', icon: Users, label: 'Trò chơi' },
  { href: '/dashboard/finance', icon: Wallet, label: 'Tài chính' },
  { href: '/dashboard/map', icon: MapPin, label: 'Bản đồ' },
  { href: '/dashboard/mood', icon: Smile, label: 'Tâm trạng' },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = useSession()
  const [couple, setCouple] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Fetch couple data for real info display
  useEffect(() => {
    const fetchCouple = async () => {
      if (!session?.user?.id) return

      try {
        const response = await fetch(`/api/couples?userId=${session.user.id}`)
        if (response.ok) {
          const data = await response.json()
          setCouple(data.couple)
        }
      } catch (error) {
        console.error('Error fetching couple:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCouple()
  }, [session])

  const handleLogout = () => {
    signOut({ callbackUrl: '/auth/signin' })
  }

  // Get user and partner data from session and API
  const user = {
    name: session?.user?.name || 'User',
    avatar: session?.user?.image || '/avatars/default.jpg'
  }

  const partner = couple ? (
    couple.user1.id === session?.user?.id ? couple.user2 : couple.user1
  ) : null

  const relationshipDays = couple?.relationshipStart ? 
    Math.floor((new Date().getTime() - new Date(couple.relationshipStart).getTime()) / (1000 * 60 * 60 * 24))
    : 0

  return (
    <AuthGuard>
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <Heart className="w-8 h-8 text-primary-500" />
          <span className="text-xl font-bold gradient-text">Loveeee</span>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Bell className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="w-80 h-full bg-white shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <MobileNavContent 
                user={user} 
                partner={partner} 
                relationshipDays={relationshipDays} 
                pathname={pathname} 
                handleLogout={handleLogout} 
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-80 h-screen sticky top-0 bg-white shadow-lg border-r border-gray-200">
          <DesktopNavContent 
            user={user} 
            partner={partner} 
            relationshipDays={relationshipDays} 
            pathname={pathname} 
            handleLogout={handleLogout} 
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          <main className="p-4 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
    </AuthGuard>
  )
}

function DesktopNavContent({ 
  user, 
  partner, 
  relationshipDays, 
  pathname, 
  handleLogout 
}: { 
  user: any, 
  partner: any, 
  relationshipDays: number, 
  pathname: string, 
  handleLogout: () => void 
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-6">
          <Heart className="w-10 h-10 text-primary-500" />
          <span className="text-2xl font-bold gradient-text">Loveeee</span>
        </div>
        
        {/* Couple Info */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center overflow-hidden">
              {user.avatar && user.avatar !== '/avatars/default.jpg' ? (
                <img 
                  src={user.avatar} 
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-lg font-semibold text-primary-600">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <Heart className="w-6 h-6 text-red-500 heartbeat" />
            <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center overflow-hidden">
              {partner ? (
                partner.avatar && partner.avatar !== '/avatars/default.jpg' ? (
                  <img 
                    src={partner.avatar} 
                    alt={partner.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-lg font-semibold text-secondary-600">
                    {partner.name.charAt(0).toUpperCase()}
                  </span>
                )
              ) : (
                <span className="text-lg font-semibold text-gray-400">
                  ?
                </span>
              )}
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">
            {partner ? `${user.name} & ${partner.name}` : user.name}
          </p>
          <p className="text-xs text-primary-600 font-medium">
            {partner && relationshipDays > 0 ? `Yêu nhau được ${relationshipDays} ngày ❤️` : 'Loveeee User ❤️'}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-6">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive 
                      ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-6 border-t border-gray-200">
        <div className="space-y-2">
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-xl transition-all"
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">Cài đặt</span>
          </Link>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-xl transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Đăng xuất</span>
          </button>
        </div>
      </div>
    </div>
  )
}

function MobileNavContent({ 
  user, 
  partner, 
  relationshipDays, 
  pathname, 
  handleLogout 
}: { 
  user: any, 
  partner: any, 
  relationshipDays: number, 
  pathname: string, 
  handleLogout: () => void 
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-6">
          <Heart className="w-8 h-8 text-primary-500" />
          <span className="text-xl font-bold gradient-text">Loveeee</span>
        </div>
        
        {/* Couple Info */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center overflow-hidden">
              {user.avatar && user.avatar !== '/avatars/default.jpg' ? (
                <img 
                  src={user.avatar} 
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-sm font-semibold text-primary-600">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <Heart className="w-5 h-5 text-red-500 heartbeat" />
            <div className="w-10 h-10 bg-secondary-100 rounded-full flex items-center justify-center overflow-hidden">
              {partner ? (
                partner.avatar && partner.avatar !== '/avatars/default.jpg' ? (
                  <img 
                    src={partner.avatar} 
                    alt={partner.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-sm font-semibold text-secondary-600">
                    {partner.name.charAt(0).toUpperCase()}
                  </span>
                )
              ) : (
                <span className="text-sm font-semibold text-gray-400">
                  ?
                </span>
              )}
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">
            {partner ? `${user.name} & ${partner.name}` : user.name}
          </p>
          <p className="text-xs text-primary-600 font-medium">
            {partner && relationshipDays > 0 ? `Yêu nhau được ${relationshipDays} ngày ❤️` : 'Loveeee User ❤️'}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-6">
        <ul className="space-y-1">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive 
                      ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-6 border-t border-gray-200">
        <div className="space-y-1">
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-xl transition-all"
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">Cài đặt</span>
          </Link>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-xl transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Đăng xuất</span>
          </button>
        </div>
      </div>
    </div>
  )
}
