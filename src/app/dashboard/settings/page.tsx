'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSession, signOut } from 'next-auth/react'
import {
  User,
  Heart,
  Bell,
  Shield,
  Globe,
  Smartphone,
  Palette,
  Download,
  Trash2,
  LogOut,
  Save,
  Camera,
  Calendar,
  Moon,
  Sun,
  Users,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'profile' | 'couple' | 'notifications' | 'privacy' | 'app'>('profile')
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  // Real user data from session and API
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    birthday: ''
  })

  // Real couple data from API
  const [couple, setCouple] = useState<any>(null)
  const [coupleData, setCoupleData] = useState({
    relationshipStart: '',
    anniversaryDate: '',
    coupleGoals: '',
    status: 'dating'
  })

  const [notifications, setNotifications] = useState({
    dailyReminder: true,
    anniversaryAlert: true,
    moodCheckIn: true,
    partnerActivity: true,
    weeklyReport: false
  })

  // Fetch real data
  useEffect(() => {
    const fetchData = async () => {
      if (!session?.user?.id) return

      try {
        // Get user data from session
        setProfile({
          name: session.user.name || '',
          email: session.user.email || '',
          phone: '', // TODO: Get from user profile API
          birthday: '' // TODO: Get from user profile API
        })

        // Fetch couple data
        const coupleResponse = await fetch(`/api/couples?userId=${session.user.id}`)
        if (coupleResponse.ok) {
          const coupleResult = await coupleResponse.json()
          if (coupleResult.couple) {
            setCouple(coupleResult.couple)
            setCoupleData({
              relationshipStart: coupleResult.couple.relationshipStart ? 
                new Date(coupleResult.couple.relationshipStart).toISOString().split('T')[0] : '',
              anniversaryDate: coupleResult.couple.anniversaryDate ? 
                new Date(coupleResult.couple.anniversaryDate).toISOString().split('T')[0] : '',
              coupleGoals: coupleResult.couple.coupleGoals || '',
              status: 'dating' // TODO: Add status field to Couple model
            })
          }
        }
      } catch (error) {
        console.error('Error fetching settings data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [session])

  const handleLogout = () => {
    signOut({ callbackUrl: '/auth/signin' })
  }

  // Save couple information
  const handleSaveCouple = async () => {
    if (!couple) {
      setMessage('❌ Bạn chưa có couple để cập nhật')
      return
    }

    setSaving(true)
    setMessage('')

    try {
      const response = await fetch('/api/couples', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: session?.user?.id,
          relationshipStart: coupleData.relationshipStart,
          anniversaryDate: coupleData.anniversaryDate,
          coupleGoals: coupleData.coupleGoals
        })
      })

      const result = await response.json()

      if (response.ok) {
        setMessage('✅ ' + result.message)
        setCouple(result.couple)
        
        // Auto clear message after 3 seconds
        setTimeout(() => setMessage(''), 3000)
      } else {
        throw new Error(result.error)
      }
    } catch (error: any) {
      setMessage('❌ ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  const tabs = [
    { id: 'profile', label: 'Hồ sơ', icon: User },
    { id: 'couple', label: 'Cặp đôi', icon: Heart },
    { id: 'notifications', label: 'Thông báo', icon: Bell },
    { id: 'privacy', label: 'Riêng tư', icon: Shield },
    { id: 'app', label: 'Ứng dụng', icon: Smartphone },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Cài đặt</h1>
        <p className="text-gray-600">Quản lý thông tin và tùy chỉnh ứng dụng</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="card">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-all ${
                    activeTab === tab.id
                      ? 'bg-primary-500 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {activeTab === 'profile' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Thông tin cá nhân</h2>
                
                <div className="flex items-center gap-6 mb-6">
                  <div className="relative">
                    <div className="w-24 h-24 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      A
                    </div>
                    <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50">
                      <Camera className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{profile.name}</h3>
                    <p className="text-gray-600">{profile.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên</label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={profile.email}
                      className="input-field"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="Nhập số điện thoại"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ngày sinh</label>
                    <input
                      type="date"
                      value={profile.birthday}
                      onChange={(e) => setProfile(prev => ({ ...prev, birthday: e.target.value }))}
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <button className="btn-primary flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    Lưu thay đổi
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'couple' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Thông tin cặp đôi</h2>
                
                {/* Show message */}
                {message && (
                  <div className={`p-3 rounded-lg mb-6 ${
                    message.includes('✅') ? 'bg-green-50 text-green-700 border border-green-200' 
                    : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                    {message}
                  </div>
                )}

                {!couple ? (
                  <div className="text-center py-8">
                    <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Chưa có couple</h3>
                    <p className="text-gray-600 mb-4">Bạn cần thiết lập couple để sử dụng tính năng này.</p>
                    <button 
                      onClick={() => router.push('/dashboard/couple')}
                      className="btn-primary"
                    >
                      Thiết lập Couple
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Show partner info */}
                    <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-4 mb-6">
                      <h3 className="font-medium text-gray-800 mb-2">👫 Cặp đôi của bạn</h3>
                      <div className="flex items-center gap-3">
                        <img 
                          src={couple.user1.avatar || '/avatars/default.jpg'} 
                          alt={couple.user1.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <span className="text-gray-600">{couple.user1.name}</span>
                        <Heart className="w-5 h-5 text-red-500" />
                        <img 
                          src={couple.user2.avatar || '/avatars/default.jpg'} 
                          alt={couple.user2.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <span className="text-gray-600">{couple.user2.name}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Ngày bắt đầu yêu</label>
                        <input
                          type="date"
                          value={coupleData.relationshipStart}
                          onChange={(e) => setCoupleData(prev => ({ ...prev, relationshipStart: e.target.value }))}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Ngày kỷ niệm</label>
                        <input
                          type="date"
                          value={coupleData.anniversaryDate}
                          onChange={(e) => setCoupleData(prev => ({ ...prev, anniversaryDate: e.target.value }))}
                          className="input-field"
                        />
                      </div>
                    </div>

                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Mục tiêu chung</label>
                      <textarea
                        rows={4}
                        value={coupleData.coupleGoals}
                        onChange={(e) => setCoupleData(prev => ({ ...prev, coupleGoals: e.target.value }))}
                        placeholder="Những điều hai bạn muốn thực hiện cùng nhau..."
                        className="input-field"
                      />
                    </div>

                    <div className="flex justify-end mt-6">
                      <button 
                        onClick={handleSaveCouple}
                        disabled={saving}
                        className="btn-primary flex items-center gap-2 disabled:opacity-50"
                      >
                        {saving ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Đang lưu...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            Lưu thay đổi
                          </>
                        )}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'notifications' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Cài đặt thông báo</h2>
                
                <div className="space-y-4">
                  {Object.entries(notifications).map(([key, value]) => {
                    const labels = {
                      dailyReminder: 'Nhắc nhở hàng ngày',
                      anniversaryAlert: 'Cảnh báo kỷ niệm',
                      moodCheckIn: 'Nhắc nhở check-in tâm trạng',
                      partnerActivity: 'Hoạt động của người yêu',
                      weeklyReport: 'Báo cáo hàng tuần'
                    }
                    
                    return (
                      <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-800">{labels[key as keyof typeof labels]}</div>
                          <div className="text-sm text-gray-600">Nhận thông báo về {labels[key as keyof typeof labels].toLowerCase()}</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) => setNotifications(prev => ({ ...prev, [key]: e.target.checked }))}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                        </label>
                      </div>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'privacy' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Riêng tư & Bảo mật</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-3">Đổi mật khẩu</h3>
                    <div className="grid grid-cols-1 gap-4">
                      <input
                        type="password"
                        placeholder="Mật khẩu hiện tại"
                        className="input-field"
                      />
                      <input
                        type="password"
                        placeholder="Mật khẩu mới"
                        className="input-field"
                      />
                      <input
                        type="password"
                        placeholder="Xác nhận mật khẩu mới"
                        className="input-field"
                      />
                    </div>
                    <button className="btn-primary mt-4">Đổi mật khẩu</button>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-3">Xuất dữ liệu</h3>
                    <p className="text-gray-600 mb-4">Tải xuống tất cả dữ liệu cá nhân của bạn</p>
                    <button className="btn-secondary flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      Xuất dữ liệu
                    </button>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="text-lg font-medium text-red-600 mb-3">Xóa tài khoản</h3>
                    <p className="text-gray-600 mb-4">Xóa vĩnh viễn tài khoản và tất cả dữ liệu</p>
                    <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                      <Trash2 className="w-4 h-4" />
                      Xóa tài khoản
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'app' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Cài đặt ứng dụng</h2>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                      <div>
                        <div className="font-medium text-gray-800">Giao diện tối</div>
                        <div className="text-sm text-gray-600">Chuyển sang chế độ tối để bảo vệ mắt</div>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isDarkMode}
                        onChange={(e) => setIsDarkMode(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-3">Ngôn ngữ</h3>
                    <select className="input-field max-w-xs">
                      <option>Tiếng Việt</option>
                      <option>English</option>
                    </select>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-3">Về ứng dụng</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>Phiên bản: 1.0.0</p>
                      <p>Cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN')}</p>
                      <p>© 2024 Loveeee. Tất cả quyền được bảo lưu.</p>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <button 
                      onClick={handleLogout}
                      className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      Đăng xuất
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
