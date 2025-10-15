'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Users,
  Heart,
  Play,
  Trophy,
  Star,
  CheckCircle,
  Clock,
  Zap,
  Target,
  Gift,
  Brain,
  Lightbulb,
  Award,
  Plus,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'

export default function GamesPage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedGame, setSelectedGame] = useState<string | null>(null)

  const categories = [
    { id: 'all', label: 'Tất cả', icon: Users },
    { id: 'getting_to_know', label: 'Tìm hiểu', icon: Heart },
    { id: 'fun', label: 'Vui nhộn', icon: Play },
    { id: 'deep', label: 'Sâu sắc', icon: Brain },
    { id: 'romantic', label: 'Lãng mạn', icon: Star },
    { id: 'challenge', label: 'Thử thách', icon: Target }
  ]

  const games = [
    {
      id: 1,
      title: '100 Câu hỏi tìm hiểu',
      description: 'Khám phá những điều mới mẻ về nhau qua 100 câu hỏi thú vị',
      category: 'getting_to_know',
      difficulty: 'easy',
      duration: '20-30 phút',
      playersCompleted: 1247,
      rating: 4.8,
      questions: 100,
      isCompleted: false,
      progress: 23,
      lastPlayed: '2024-11-08',
      thumbnail: '/games/100questions.jpg',
      tags: ['Tìm hiểu', 'Câu hỏi', 'Dễ chơi']
    },
    {
      id: 2,
      title: 'Thử thách tình yêu',
      description: 'Những thử thách nhỏ để thể hiện tình yêu và sự quan tâm',
      category: 'challenge',
      difficulty: 'medium',
      duration: '15-45 phút',
      playersCompleted: 892,
      rating: 4.9,
      questions: 50,
      isCompleted: true,
      progress: 100,
      lastPlayed: '2024-11-05',
      thumbnail: '/games/lovechallenge.jpg',
      tags: ['Thử thách', 'Hành động', 'Sáng tạo']
    },
    {
      id: 3,
      title: 'Câu hỏi sâu sắc',
      description: 'Những câu hỏi giúp hiểu sâu hơn về suy nghĩ và cảm xúc của nhau',
      category: 'deep',
      difficulty: 'hard',
      duration: '30-60 phút',
      playersCompleted: 456,
      rating: 4.7,
      questions: 75,
      isCompleted: false,
      progress: 0,
      lastPlayed: null,
      thumbnail: '/games/deepquestions.jpg',
      tags: ['Triết lý', 'Cảm xúc', 'Suy ngẫm']
    },
    {
      id: 4,
      title: 'Trò chơi ký ức',
      description: 'Ôn lại những kỷ niệm đẹp và tạo ra những câu chuyện mới',
      category: 'romantic',
      difficulty: 'easy',
      duration: '15-25 phút',
      playersCompleted: 723,
      rating: 4.6,
      questions: 40,
      isCompleted: false,
      progress: 67,
      lastPlayed: '2024-11-09',
      thumbnail: '/games/memory.jpg',
      tags: ['Kỷ niệm', 'Lãng mạn', 'Hoài niệm']
    },
    {
      id: 5,
      title: 'Đoán ý nghĩ',
      description: 'Xem bạn hiểu người yêu của mình đến đâu',
      category: 'fun',
      difficulty: 'medium',
      duration: '10-20 phút',
      playersCompleted: 1089,
      rating: 4.5,
      questions: 30,
      isCompleted: true,
      progress: 100,
      lastPlayed: '2024-11-07',
      thumbnail: '/games/mindreader.jpg',
      tags: ['Đoán', 'Vui nhộn', 'Tương tác']
    },
    {
      id: 6,
      title: 'Kế hoạch tương lai',
      description: 'Chia sẻ và thảo luận về những kế hoạch, ước mơ trong tương lai',
      category: 'deep',
      difficulty: 'medium',
      duration: '25-40 phút',
      playersCompleted: 334,
      rating: 4.8,
      questions: 45,
      isCompleted: false,
      progress: 15,
      lastPlayed: '2024-11-06',
      thumbnail: '/games/future.jpg',
      tags: ['Tương lai', 'Kế hoạch', 'Ước mơ']
    }
  ]

  const recentResults = [
    {
      id: 1,
      gameTitle: 'Thử thách tình yêu',
      completedAt: '2024-11-05T20:30:00',
      userScore: 85,
      partnerScore: 92,
      compatibilityScore: 88,
      totalQuestions: 50,
      achievements: ['Sweetest Answer', 'Perfect Match']
    },
    {
      id: 2,
      gameTitle: 'Đoán ý nghĩ',
      completedAt: '2024-11-07T16:15:00',
      userScore: 78,
      partnerScore: 84,
      compatibilityScore: 81,
      totalQuestions: 30,
      achievements: ['Mind Reader']
    }
  ]

  const achievements = [
    { id: 1, title: 'Người chơi mới', description: 'Hoàn thành game đầu tiên', icon: '🎮', unlocked: true },
    { id: 2, title: 'Tâm đầu ý hợp', description: 'Đạt 90% compatibility', icon: '💕', unlocked: true },
    { id: 3, title: 'Khám phá', description: 'Chơi 5 games khác nhau', icon: '🔍', unlocked: false },
    { id: 4, title: 'Streak Master', description: 'Chơi 7 ngày liên tiếp', icon: '🔥', unlocked: false },
    { id: 5, title: 'Perfect Score', description: 'Đạt điểm tuyệt đối', icon: '⭐', unlocked: false },
    { id: 6, title: 'Deep Thinker', description: 'Hoàn thành tất cả games sâu sắc', icon: '🧠', unlocked: false }
  ]

  const filteredGames = activeCategory === 'all' 
    ? games 
    : games.filter(game => game.category === activeCategory)

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      easy: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      hard: 'bg-red-100 text-red-800'
    }
    return colors[difficulty as keyof typeof colors] || colors.easy
  }

  const getDifficultyLabel = (difficulty: string) => {
    const labels = {
      easy: 'Dễ',
      medium: 'Trung bình',
      hard: 'Khó'
    }
    return labels[difficulty as keyof typeof labels] || 'Dễ'
  }

  const overallStats = {
    gamesPlayed: games.filter(g => g.isCompleted || g.progress > 0).length,
    gamesCompleted: games.filter(g => g.isCompleted).length,
    averageCompatibility: Math.round(recentResults.reduce((sum, r) => sum + r.compatibilityScore, 0) / recentResults.length),
    totalAchievements: achievements.filter(a => a.unlocked).length,
    currentStreak: 3
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Trò chơi câu hỏi</h1>
          <p className="text-gray-600">Khám phá và hiểu nhau hơn qua những trò chơi thú vị</p>
        </div>
        <Link href="/dashboard/games/custom" className="btn-primary inline-flex items-center gap-2 w-fit">
          <Plus className="w-5 h-5" />
          Tạo game riêng
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card text-center"
        >
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Play className="w-6 h-6 text-white" />
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-1">{overallStats.gamesPlayed}</div>
          <div className="text-sm text-gray-600">Đã chơi</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card text-center"
        >
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-1">{overallStats.gamesCompleted}</div>
          <div className="text-sm text-gray-600">Hoàn thành</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card text-center"
        >
          <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-1">{overallStats.averageCompatibility}%</div>
          <div className="text-sm text-gray-600">Phù hợp</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card text-center"
        >
          <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-1">{overallStats.totalAchievements}</div>
          <div className="text-sm text-gray-600">Thành tích</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card text-center"
        >
          <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-1">{overallStats.currentStreak}</div>
          <div className="text-sm text-gray-600">Streak ngày</div>
        </motion.div>
      </div>

      {/* Categories Filter */}
      <div className="card">
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === category.id
                  ? 'bg-primary-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <category.icon className="w-4 h-4" />
              {category.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Games List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredGames.map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card card-hover group cursor-pointer"
                onClick={() => setSelectedGame(game.id.toString())}
              >
                {/* Game Thumbnail */}
                <div className="aspect-video bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg mb-4 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Play className="w-12 h-12 text-primary-600 group-hover:scale-110 transition-transform" />
                  </div>
                  {game.isCompleted && (
                    <div className="absolute top-2 right-2 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                  )}
                  {game.progress > 0 && !game.isCompleted && (
                    <div className="absolute top-2 right-2 px-2 py-1 bg-blue-500 text-white text-xs rounded-full">
                      {game.progress}%
                    </div>
                  )}
                </div>

                {/* Game Info */}
                <div className="mb-3">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1 group-hover:text-primary-600 transition-colors">
                    {game.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2">{game.description}</p>
                </div>

                {/* Game Stats */}
                <div className="flex items-center gap-3 mb-3 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {game.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {game.questions} câu
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    {game.rating}
                  </div>
                </div>

                {/* Tags and Difficulty */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex flex-wrap gap-1">
                    {game.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(game.difficulty)}`}>
                    {getDifficultyLabel(game.difficulty)}
                  </span>
                </div>

                {/* Progress Bar */}
                {game.progress > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                      <span>Tiến độ</span>
                      <span>{game.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${game.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <button className="w-full py-2 px-4 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                  {game.isCompleted ? (
                    <>
                      <Trophy className="w-4 h-4" />
                      Chơi lại
                    </>
                  ) : game.progress > 0 ? (
                    <>
                      <Play className="w-4 h-4" />
                      Tiếp tục
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      Bắt đầu
                    </>
                  )}
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recent Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-primary-600" />
              Kết quả gần đây
            </h3>
            <div className="space-y-4">
              {recentResults.map((result) => (
                <div key={result.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="font-medium text-gray-800 text-sm mb-2">{result.gameTitle}</div>
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>Điểm của bạn</span>
                    <span className="font-semibold">{result.userScore}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>Điểm người yêu</span>
                    <span className="font-semibold">{result.partnerScore}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">Độ phù hợp</span>
                    <span className="text-primary-600 font-semibold">{result.compatibilityScore}%</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(result.completedAt).toLocaleDateString('vi-VN')}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary-600" />
              Thành tích
            </h3>
            <div className="space-y-3">
              {achievements.slice(0, 4).map((achievement) => (
                <div 
                  key={achievement.id} 
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    achievement.unlocked ? 'bg-green-50 border border-green-200' : 'bg-gray-50 opacity-60'
                  }`}
                >
                  <div className="text-2xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <div className={`font-medium text-sm ${
                      achievement.unlocked ? 'text-green-800' : 'text-gray-700'
                    }`}>
                      {achievement.title}
                    </div>
                    <div className={`text-xs ${
                      achievement.unlocked ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {achievement.description}
                    </div>
                  </div>
                  {achievement.unlocked && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                </div>
              ))}
            </div>
            <Link href="/dashboard/games/achievements" className="block mt-4 text-center text-primary-600 hover:text-primary-700 font-medium text-sm">
              Xem tất cả thành tích →
            </Link>
          </motion.div>

          {/* Quick Tips */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="card"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-primary-600" />
              Mẹo chơi
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-blue-800 text-sm">💡 Hãy trung thực với câu trả lời để hiểu nhau hơn</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-green-800 text-sm">🎯 Chơi đều đặn để duy trì streak và mở khóa thành tích</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <p className="text-yellow-800 text-sm">❤️ Thảo luận sau mỗi game để hiệu quả tốt nhất</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
