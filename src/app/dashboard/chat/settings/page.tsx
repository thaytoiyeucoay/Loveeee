'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Bell,
  BellOff,
  Image,
  File,
  Trash2,
  Download,
  Lock,
  Eye,
  EyeOff,
  Palette,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Save
} from 'lucide-react'
import Link from 'next/link'

export default function ChatSettingsPage() {
  const [settings, setSettings] = useState({
    notifications: {
      messageNotifications: true,
      soundEnabled: true,
      vibrationEnabled: true,
      showPreview: true,
      quietHours: false,
      quietStart: '22:00',
      quietEnd: '08:00'
    },
    privacy: {
      readReceipts: true,
      lastSeen: true,
      onlineStatus: true,
      blockScreenshots: false
    },
    appearance: {
      theme: 'light', // light, dark, auto
      bubbleStyle: 'modern', // modern, classic, minimal
      fontSize: 'medium', // small, medium, large
      chatWallpaper: 'default'
    },
    storage: {
      autoDownloadImages: true,
      autoDownloadVideos: false,
      autoDownloadFiles: false,
      mediaQuality: 'high' // low, medium, high
    }
  })

  const updateSetting = (category: keyof typeof settings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }))
  }

  const wallpapers = [
    { id: 'default', name: 'Mặc định', preview: '🎨' },
    { id: 'hearts', name: 'Trái tim', preview: '💕' },
    { id: 'flowers', name: 'Hoa lá', preview: '🌸' },
    { id: 'gradient', name: 'Gradient', preview: '🌈' },
    { id: 'minimal', name: 'Tối giản', preview: '⚪' },
    { id: 'romantic', name: 'Lãng mạn', preview: '🌹' }
  ]

  const themes = [
    { id: 'light', name: 'Sáng', icon: Sun },
    { id: 'dark', name: 'Tối', icon: Moon },
    { id: 'auto', name: 'Tự động', icon: Palette }
  ]

  const bubbleStyles = [
    { id: 'modern', name: 'Hiện đại', description: 'Góc bo tròn, gradient màu' },
    { id: 'classic', name: 'Cổ điển', description: 'Hình chữ nhật bo góc' },
    { id: 'minimal', name: 'Tối giản', description: 'Đơn giản, màu trơn' }
  ]

  const fontSizes = [
    { id: 'small', name: 'Nhỏ', sample: 'Aa' },
    { id: 'medium', name: 'Vừa', sample: 'Aa' },
    { id: 'large', name: 'Lớn', sample: 'Aa' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link 
          href="/dashboard/chat"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Cài đặt Chat</h1>
          <p className="text-gray-600">Tùy chỉnh trải nghiệm chat của bạn</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary-500" />
            Thông báo
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-800">Thông báo tin nhắn</div>
                <div className="text-sm text-gray-600">Nhận thông báo khi có tin nhắn mới</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.messageNotifications}
                  onChange={(e) => updateSetting('notifications', 'messageNotifications', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-800">Âm thanh</div>
                <div className="text-sm text-gray-600">Phát âm thanh khi có tin nhắn</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.soundEnabled}
                  onChange={(e) => updateSetting('notifications', 'soundEnabled', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-800">Hiển thị nội dung</div>
                <div className="text-sm text-gray-600">Hiển thị preview tin nhắn trong thông báo</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.showPreview}
                  onChange={(e) => updateSetting('notifications', 'showPreview', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="font-medium text-gray-800">Giờ yên tĩnh</div>
                  <div className="text-sm text-gray-600">Tắt thông báo trong khung giờ này</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications.quietHours}
                    onChange={(e) => updateSetting('notifications', 'quietHours', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>

              {settings.notifications.quietHours && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Từ</label>
                    <input
                      type="time"
                      value={settings.notifications.quietStart}
                      onChange={(e) => updateSetting('notifications', 'quietStart', e.target.value)}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Đến</label>
                    <input
                      type="time"
                      value={settings.notifications.quietEnd}
                      onChange={(e) => updateSetting('notifications', 'quietEnd', e.target.value)}
                      className="input-field"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Privacy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5 text-green-500" />
            Quyền riêng tư
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-800">Xác nhận đã đọc</div>
                <div className="text-sm text-gray-600">Hiển thị dấu tick xanh khi đã đọc</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.privacy.readReceipts}
                  onChange={(e) => updateSetting('privacy', 'readReceipts', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-800">Lần cuối online</div>
                <div className="text-sm text-gray-600">Hiển thị thời gian online cuối</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.privacy.lastSeen}
                  onChange={(e) => updateSetting('privacy', 'lastSeen', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-800">Trạng thái online</div>
                <div className="text-sm text-gray-600">Hiển thị khi bạn đang online</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.privacy.onlineStatus}
                  onChange={(e) => updateSetting('privacy', 'onlineStatus', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-800">Chặn chụp màn hình</div>
                <div className="text-sm text-gray-600">Ngăn chụp màn hình chat (beta)</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.privacy.blockScreenshots}
                  onChange={(e) => updateSetting('privacy', 'blockScreenshots', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>
          </div>
        </motion.div>

        {/* Appearance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Palette className="w-5 h-5 text-purple-500" />
            Giao diện
          </h3>

          <div className="space-y-6">
            {/* Theme */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Chủ đề</label>
              <div className="grid grid-cols-3 gap-3">
                {themes.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => updateSetting('appearance', 'theme', theme.id)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      settings.appearance.theme === theme.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <theme.icon className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                    <div className="text-sm font-medium text-gray-700">{theme.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Bubble Style */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Kiểu tin nhắn</label>
              <div className="space-y-2">
                {bubbleStyles.map((style) => (
                  <label key={style.id} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="bubbleStyle"
                      value={style.id}
                      checked={settings.appearance.bubbleStyle === style.id}
                      onChange={(e) => updateSetting('appearance', 'bubbleStyle', e.target.value)}
                      className="w-4 h-4 text-purple-600"
                    />
                    <div>
                      <div className="font-medium text-gray-800">{style.name}</div>
                      <div className="text-sm text-gray-600">{style.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Font Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Kích thước chữ</label>
              <div className="grid grid-cols-3 gap-3">
                {fontSizes.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => updateSetting('appearance', 'fontSize', size.id)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      settings.appearance.fontSize === size.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`text-center mb-2 ${
                      size.id === 'small' ? 'text-sm' : 
                      size.id === 'medium' ? 'text-base' : 'text-lg'
                    }`}>{size.sample}</div>
                    <div className="text-sm font-medium text-gray-700">{size.name}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Storage & Media */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Download className="w-5 h-5 text-blue-500" />
            Lưu trữ & Media
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-800">Tự động tải ảnh</div>
                <div className="text-sm text-gray-600">Tự động tải xuống ảnh khi nhận</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.storage.autoDownloadImages}
                  onChange={(e) => updateSetting('storage', 'autoDownloadImages', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-800">Tự động tải video</div>
                <div className="text-sm text-gray-600">Tự động tải xuống video khi nhận</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.storage.autoDownloadVideos}
                  onChange={(e) => updateSetting('storage', 'autoDownloadVideos', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Chất lượng media</label>
              <select
                value={settings.storage.mediaQuality}
                onChange={(e) => updateSetting('storage', 'mediaQuality', e.target.value)}
                className="input-field"
              >
                <option value="low">Thấp (tiết kiệm dung lượng)</option>
                <option value="medium">Trung bình</option>
                <option value="high">Cao (chất lượng tốt nhất)</option>
              </select>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Dung lượng đã sử dụng</span>
                <span className="text-sm text-gray-600">234 MB</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
              <button className="text-sm text-red-600 hover:text-red-700 flex items-center gap-2">
                <Trash2 className="w-4 h-4" />
                Xóa cache và media
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="btn-primary flex items-center gap-2">
          <Save className="w-4 h-4" />
          Lưu cài đặt
        </button>
      </div>
    </div>
  )
}
