'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Trophy,
  Star,
  CheckCircle,
  Lock,
  Calendar,
  Target,
  Heart,
  Zap,
  Award,
  Crown,
  Medal
} from 'lucide-react'
import Link from 'next/link'

export default function AchievementsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    { id: 'all', label: 'Tất cả', count: 15 },
    { id: 'beginner', label: 'Người mới', count: 5 },
    { id: 'social', label: 'Xã hội', count: 4 },
    { id: 'expert', label: 'Chuyên gia', count: 3 },
    { id: 'special', label: 'Đặc biệt', count: 3 }
  ]

  const achievements = [
    {
      id: 1,
      title: 'Người chơi mới',
      description: 'Hoàn thành game đầu tiên',
      icon: '🎮',
      category: 'beginner',
      unlocked: true,
      unlockedAt: '2024-11-01',
      progress: 100,
      requirement: 'Chơi và hoàn thành 1 game bất kỳ',
      reward: '+50 điểm tương thích',
      rarity: 'common'
    },
    {
      id: 2,
      title: 'Tâm đầu ý hợp',
      description: 'Đạt 90% compatibility trong một game',
      icon: '💕',
      category: 'social',
      unlocked: true,
      unlockedAt: '2024-11-03',
      progress: 100,
      requirement: 'Đạt điểm tương thích ≥ 90% trong bất kỳ game nào',
      reward: 'Unlock "Perfect Match" badge',
      rarity: 'rare'
    },
    {
      id: 3,
      title: 'Khám phá',
      description: 'Chơi 5 games khác nhau',
      icon: '🔍',
      category: 'beginner',
      unlocked: false,
      progress: 60,
      requirement: 'Chơi ít nhất 1 lần với 5 games khác nhau',
      reward: '+100 điểm tương thích',
      rarity: 'common'
    },
    {
      id: 4,
      title: 'Streak Master',
      description: 'Chơi games 7 ngày liên tiếp',
      icon: '🔥',
      category: 'expert',
      unlocked: false,
      progress: 43,
      requirement: 'Chơi ít nhất 1 game mỗi ngày trong 7 ngày',
      reward: 'Unlock exclusive streak badge',
      rarity: 'legendary'
    },
    {
      id: 5,
      title: 'Perfect Score',
      description: 'Đạt điểm tuyệt đối trong một game',
      icon: '⭐',
      category: 'expert',
      unlocked: false,
      progress: 0,
      requirement: 'Đạt 100% điểm trong bất kỳ game nào',
      reward: '+200 điểm tương thích',
      rarity: 'legendary'
    },
    {
      id: 6,
      title: 'Deep Thinker',
      description: 'Hoàn thành tất cả games sâu sắc',
      icon: '🧠',
      category: 'expert',
      unlocked: false,
      progress: 33,
      requirement: 'Hoàn thành tất cả games trong category "Sâu sắc"',
      reward: 'Unlock "Philosopher" title',
      rarity: 'epic'
    },
    {
      id: 7,
      title: 'Social Butterfly',
      description: 'Mời 3 cặp đôi khác tham gia app',
      icon: '🦋',
      category: 'social',
      unlocked: false,
      progress: 0,
      requirement: 'Mời thành công 3 cặp đôi tham gia Loveeee',
      reward: 'Unlock referral rewards',
      rarity: 'rare'
    },
    {
      id: 8,
      title: 'Love Guru',
      description: 'Đạt tổng 5000 điểm tương thích',
      icon: '🎯',
      category: 'special',
      unlocked: false,
      progress: 15,
      requirement: 'Tích lũy tổng cộng 5000 điểm tương thích',
      reward: 'Unlock "Guru" title + special avatar frame',
      rarity: 'legendary'
    },
    {
      id: 9,
      title: 'First Month',
      description: 'Chơi games trong tháng đầu',
      icon: '📅',
      category: 'beginner',
      unlocked: true,
      unlockedAt: '2024-11-10',
      progress: 100,
      requirement: 'Chơi ít nhất 5 games trong tháng đầu sử dụng app',
      reward: '+75 điểm tương thích',
      rarity: 'common'
    },
    {
      id: 10,
      title: 'Anniversary Special',
      description: 'Chơi game trong ngày kỷ niệm',
      icon: '🎉',
      category: 'special',
      unlocked: false,
      progress: 0,
      requirement: 'Chơi game trong ngày kỷ niệm tình yêu',
      reward: 'Unlock anniversary badge + special game mode',
      rarity: 'epic'
    }
  ]

  const getRarityColor = (rarity: string) => {
    const colors = {
      common: 'border-gray-300 bg-gray-50',
      rare: 'border-blue-300 bg-blue-50',
      epic: 'border-purple-300 bg-purple-50',
      legendary: 'border-yellow-300 bg-yellow-50'
    }
    return colors[rarity as keyof typeof colors] || colors.common
  }

  const getRarityBadge = (rarity: string) => {
    const badges = {
      common: { label: 'Thông thường', color: 'bg-gray-100 text-gray-800' },
      rare: { label: 'Hiếm', color: 'bg-blue-100 text-blue-800' },
      epic: { label: 'Sử thi', color: 'bg-purple-100 text-purple-800' },
      legendary: { label: 'Huyền thoại', color: 'bg-yellow-100 text-yellow-800' }
    }
    return badges[rarity as keyof typeof badges] || badges.common
  }

  const filteredAchievements = selectedCategory === 'all' 
    ? achievements 
    : achievements.filter(achievement => achievement.category === selectedCategory)

  const unlockedCount = achievements.filter(a => a.unlocked).length
  const totalCompatibilityPoints = achievements
    .filter(a => a.unlocked)
    .reduce((sum, a) => {
      const match = a.reward.match(/\d+/)
      return sum + (match ? parseInt(match[0]) || 0 : 0)
    }, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href="/dashboard/games"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Thành tích</h1>
            <p className="text-gray-600">Khám phá và mở khóa các thành tích đặc biệt</p>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card text-center"
        >
          <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-1">{unlockedCount}/{achievements.length}</div>
          <div className="text-sm text-gray-600">Đã mở khóa</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card text-center"
        >
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Star className="w-6 h-6 text-white" />
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-1">{Math.round((unlockedCount / achievements.length) * 100)}%</div>
          <div className="text-sm text-gray-600">Hoàn thành</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card text-center"
        >
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-1">{totalCompatibilityPoints}</div>
          <div className="text-sm text-gray-600">Điểm thưởng</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card text-center"
        >
          <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-1">{achievements.filter(a => a.unlocked && a.rarity === 'legendary').length}</div>
          <div className="text-sm text-gray-600">Huyền thoại</div>
        </motion.div>
      </div>

      {/* Categories Filter */}
      <div className="card">
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === category.id
                  ? 'bg-primary-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category.label}
              <span className="px-2 py-0.5 bg-black bg-opacity-20 rounded-full text-xs">
                {category.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAchievements.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`card border-2 ${getRarityColor(achievement.rarity)} ${
              achievement.unlocked ? '' : 'opacity-75'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                  achievement.unlocked ? 'bg-white shadow-sm' : 'bg-gray-200 grayscale'
                }`}>
                  {achievement.unlocked ? achievement.icon : '🔒'}
                </div>
                <div className="flex-1">
                  <h3 className={`font-semibold ${achievement.unlocked ? 'text-gray-800' : 'text-gray-500'}`}>
                    {achievement.title}
                  </h3>
                  <p className={`text-sm ${achievement.unlocked ? 'text-gray-600' : 'text-gray-400'}`}>
                    {achievement.description}
                  </p>
                </div>
              </div>
              {achievement.unlocked && (
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
              )}
            </div>

            <div className="space-y-3">
              <div className={`text-xs ${achievement.unlocked ? 'text-gray-600' : 'text-gray-400'}`}>
                <strong>Yêu cầu:</strong> {achievement.requirement}
              </div>

              {!achievement.unlocked && achievement.progress > 0 && (
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">Tiến độ</span>
                    <span className="font-medium text-gray-800">{achievement.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${achievement.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${getRarityBadge(achievement.rarity).color}`}>
                  {getRarityBadge(achievement.rarity).label}
                </span>
                {achievement.unlocked && achievement.unlockedAt && (
                  <span className="text-xs text-gray-500">
                    {new Date(achievement.unlockedAt).toLocaleDateString('vi-VN')}
                  </span>
                )}
              </div>

              <div className={`text-xs p-2 rounded-lg ${
                achievement.unlocked ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-600'
              }`}>
                <strong>Phần thưởng:</strong> {achievement.reward}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Achievement Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card bg-gradient-to-r from-primary-500 to-secondary-500 text-white"
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
            <Zap className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2">Mẹo mở khóa thành tích</h3>
            <ul className="text-sm space-y-1 opacity-90">
              <li>• Chơi game đều đặn để duy trì streak</li>
              <li>• Thử tất cả các loại game để khám phá</li>
              <li>• Trả lời thật lòng để đạt điểm tương thích cao</li>
              <li>• Mời bạn bè tham gia để mở khóa thành tích xã hội</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
