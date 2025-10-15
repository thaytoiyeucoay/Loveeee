'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import {
  Wallet,
  Plus,
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  Calendar,
  Filter,
  Search,
  Target,
  Gift,
  Coffee,
  Utensils,
  Car,
  Home,
  Heart,
  Plane,
  ShoppingBag,
  CreditCard,
  Banknote,
  ArrowUpRight,
  ArrowDownRight,
  Trash2,
  Edit3
} from 'lucide-react'
import Link from 'next/link'

export default function FinancePage() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState<'overview' | 'expenses' | 'savings' | 'goals'>('overview')
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month')
  const [filterCategory, setFilterCategory] = useState('all')
  const [expenses, setExpenses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [hasCouple, setHasCouple] = useState(false)
  const [error, setError] = useState('')

  const categories = [
    { id: 'all', label: 'Tất cả', icon: Wallet, color: 'bg-gray-100' },
    { id: 'food', label: 'Ăn uống', icon: Utensils, color: 'bg-orange-100' },
    { id: 'entertainment', label: 'Giải trí', icon: Gift, color: 'bg-purple-100' },
    { id: 'travel', label: 'Du lịch', icon: Plane, color: 'bg-blue-100' },
    { id: 'shopping', label: 'Mua sắm', icon: ShoppingBag, color: 'bg-pink-100' },
    { id: 'transport', label: 'Di chuyển', icon: Car, color: 'bg-green-100' },
    { id: 'home', label: 'Nhà cửa', icon: Home, color: 'bg-yellow-100' },
    { id: 'gifts', label: 'Quà tặng', icon: Heart, color: 'bg-red-100' }
  ]

  // Fetch expenses
  const fetchExpenses = async () => {
    if (!session?.user?.id) return

    setLoading(true)
    try {
      // Check if user has couple
      const coupleResponse = await fetch(`/api/couples?userId=${session.user.id}`)
      if (coupleResponse.ok) {
        const coupleData = await coupleResponse.json()
        setHasCouple(!!coupleData.couple)
        
        if (coupleData.couple) {
          // Fetch expenses if has couple
          const expensesResponse = await fetch(`/api/expenses?userId=${session.user.id}`)
          if (expensesResponse.ok) {
            const expensesData = await expensesResponse.json()
            console.log('Expenses fetched:', expensesData.expenses)
            setExpenses(expensesData.expenses || [])
          }
        }
      }
    } catch (error) {
      console.error('Error fetching expenses:', error)
      setError('Failed to fetch expenses')
    } finally {
      setLoading(false)
    }
  }

  // Delete expense
  const handleDeleteExpense = async (expenseId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa expense này?')) return

    try {
      const response = await fetch(`/api/expenses?expenseId=${expenseId}&userId=${session?.user?.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        // Remove from local state
        setExpenses(prev => prev.filter(expense => expense.id !== expenseId))
        alert('✅ Expense đã được xóa!')
      } else {
        const error = await response.json()
        alert('❌ ' + error.error)
      }
    } catch (error) {
      console.error('Error deleting expense:', error)
      alert('❌ Failed to delete expense')
    }
  }

  // Fetch expenses on session change
  useEffect(() => {
    fetchExpenses()
  }, [session?.user?.id])

  // Calculate statistics from real data
  const getFinanceStats = () => {
    if (expenses.length === 0) {
      return {
        totalSpent: 0,
        monthlySpent: 0,
        averagePerDay: 0,
        totalTransactions: 0,
        categorySpending: {}
      }
    }

    const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0)
    const monthlySpent = expenses
      .filter(expense => {
        const expenseMonth = new Date(expense.date).getMonth()
        const currentMonth = new Date().getMonth()
        return expenseMonth === currentMonth
      })
      .reduce((sum, expense) => sum + expense.amount, 0)

    const categorySpending = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount
      return acc
    }, {} as Record<string, number>)

    return {
      totalSpent,
      monthlySpent,
      averagePerDay: Math.round(monthlySpent / new Date().getDate()),
      totalTransactions: expenses.length,
      categorySpending
    }
  }

  const stats = getFinanceStats()

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <span className="ml-2 text-gray-600">Đang tải dữ liệu tài chính...</span>
      </div>
    )
  }

  // Show no couple state
  if (!hasCouple) {
    return (
      <div className="text-center py-12">
        <Wallet className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">Chưa có couple</h3>
        <p className="text-gray-500 mb-6">Bạn cần có couple để sử dụng tính năng quản lý tài chính</p>
        <Link href="/dashboard/couple/setup" className="btn-primary">
          Thiết lập Couple
        </Link>
      </div>
    )
  }

  const savingsGoals = [
    {
      id: 1,
      title: 'Đám cưới mơ ước',
      targetAmount: 200000000,
      currentAmount: 45000000,
      deadline: '2025-12-31',
      monthlyTarget: 12000000,
      icon: '💒',
      priority: 'high',
      description: 'Tiết kiệm cho ngày trọng đại',
      contributors: ['Bạn', 'Người yêu']
    },
    {
      id: 2,
      title: 'Du lịch Nhật Bản',
      targetAmount: 25000000,
      currentAmount: 8500000,
      deadline: '2024-12-20',
      monthlyTarget: 4000000,
      icon: '🗾',
      priority: 'medium',
      description: 'Chuyến đi mơ ước mùa đông',
      contributors: ['Bạn', 'Người yêu']
    },
    {
      id: 3,
      title: 'Quỹ khẩn cấp',
      targetAmount: 15000000,
      currentAmount: 12000000,
      deadline: '2024-12-31',
      monthlyTarget: 1000000,
      icon: '🛡️',
      priority: 'high',
      description: 'Dự phòng cho tương lai',
      contributors: ['Bạn', 'Người yêu']
    },
    {
      id: 4,
      title: 'Laptop mới cho em',
      targetAmount: 35000000,
      currentAmount: 15000000,
      deadline: '2024-11-30',
      monthlyTarget: 3000000,
      icon: '💻',
      priority: 'low',
      description: 'Nâng cấp công việc',
      contributors: ['Bạn']
    }
  ]

  // Use real calculated stats
  const monthlyStats = {
    totalIncome: 0, // We don't track income yet
    totalExpenses: stats.monthlySpent,
    personalExpenses: stats.monthlySpent,
    sharedExpenses: 0,
    savingsThisMonth: 0,
    remainingBudget: 0
  }

  const filteredExpenses = filterCategory === 'all' 
    ? expenses 
    : expenses.filter(expense => expense.category === filterCategory)

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.id === category)
    return cat?.icon || Wallet
  }

  const getCategoryColor = (category: string) => {
    const cat = categories.find(c => c.id === category)
    return cat?.color || 'bg-gray-100'
  }

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('vi-VN') + ' VNĐ'
  }

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100)
  }

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: 'border-red-200 bg-red-50',
      medium: 'border-yellow-200 bg-yellow-50',
      low: 'border-green-200 bg-green-50'
    }
    return colors[priority as keyof typeof colors] || colors.medium
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Quản lý tài chính</h1>
          <p className="text-gray-600">Theo dõi chi tiêu và tiết kiệm cùng nhau ({expenses.length} giao dịch)</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard/finance/add-expense" className="btn-secondary inline-flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Thêm chi tiêu
          </Link>
          <Link href="/dashboard/finance/add-goal" className="btn-primary inline-flex items-center gap-2">
            <Target className="w-5 h-5" />
            Tạo mục tiêu
          </Link>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="card">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'overview', label: 'Tổng quan', icon: PieChart },
            { id: 'expenses', label: 'Chi tiêu', icon: CreditCard },
            { id: 'savings', label: 'Tiết kiệm', icon: Target },
            { id: 'goals', label: 'Mục tiêu', icon: TrendingUp }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-primary-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Monthly Summary */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card text-center"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="text-lg font-bold text-gray-800 mb-1">{formatCurrency(monthlyStats.totalIncome)}</div>
              <div className="text-sm text-gray-600">Thu nhập tháng</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card text-center"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                <TrendingDown className="w-6 h-6 text-white" />
              </div>
              <div className="text-lg font-bold text-gray-800 mb-1">{formatCurrency(monthlyStats.totalExpenses)}</div>
              <div className="text-sm text-gray-600">Chi tiêu tháng</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card text-center"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div className="text-lg font-bold text-gray-800 mb-1">{formatCurrency(monthlyStats.savingsThisMonth)}</div>
              <div className="text-sm text-gray-600">Tiết kiệm tháng</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card text-center"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div className="text-lg font-bold text-gray-800 mb-1">{formatCurrency(monthlyStats.remainingBudget)}</div>
              <div className="text-sm text-gray-600">Còn lại</div>
            </motion.div>
          </div>

          {/* Budget Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Ngân sách tháng này</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Chi tiêu cá nhân</span>
                  <span className="font-semibold">{formatCurrency(monthlyStats.personalExpenses)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
                    style={{ width: `${(monthlyStats.personalExpenses / monthlyStats.totalIncome) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Chi tiêu chung</span>
                  <span className="font-semibold">{formatCurrency(monthlyStats.sharedExpenses)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-pink-500 to-red-500 h-3 rounded-full"
                    style={{ width: `${(monthlyStats.sharedExpenses / monthlyStats.totalIncome) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Tiết kiệm</span>
                  <span className="font-semibold text-green-600">{formatCurrency(monthlyStats.savingsThisMonth)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full"
                    style={{ width: `${(monthlyStats.savingsThisMonth / monthlyStats.totalIncome) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Expenses Tab */}
      {activeTab === 'expenses' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="card">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm chi tiêu..."
                  className="input-field pl-10"
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setFilterCategory(category.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all ${
                      filterCategory === category.id
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
          </div>

          {/* Expenses List */}
          <div className="space-y-3">
            {filteredExpenses.map((expense, index) => {
              const CategoryIcon = getCategoryIcon(expense.category)
              return (
                <motion.div
                  key={expense.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card hover:shadow-lg transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getCategoryColor(expense.category)}`}>
                      <CategoryIcon className="w-6 h-6 text-gray-600" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-800">{expense.title}</h3>
                          <p className="text-gray-600 text-sm">{expense.description}</p>
                          <p className="text-gray-500 text-xs">{expense.location}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="text-lg font-bold text-gray-800">{formatCurrency(expense.amount)}</div>
                            <div className="text-sm text-gray-500">{new Date(expense.date).toLocaleDateString('vi-VN')}</div>
                          </div>
                          <button
                            onClick={() => handleDeleteExpense(expense.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Xóa expense"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4">
                          <span className="text-gray-600">
                            Thanh toán bởi: <span className="font-medium">{expense.paidBy?.name || 'User'}</span>
                          </span>
                          {expense.splitType === 'equal' && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                              Chia đều
                            </span>
                          )}
                          {expense.splitType === 'full' && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                              Toàn bộ
                            </span>
                          )}
                        </div>
                        
                        {expense.receipt && (
                          <button className="text-primary-600 hover:text-primary-700 text-xs">
                            Xem hóa đơn
                          </button>
                        )}
                      </div>
                      
                      {expense.splitType === 'equal' && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">Bạn trả:</span>
                              <span className="font-medium">
                                {expense.paidBy === 'Bạn' ? formatCurrency(expense.amount) : formatCurrency(expense.paidByOther)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">Người yêu trả:</span>
                              <span className="font-medium">
                                {expense.paidBy === 'Người yêu' ? formatCurrency(expense.amount) : formatCurrency(expense.paidByOther)}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}

            {/* Empty State */}
            {filteredExpenses.length === 0 && (
              <div className="text-center py-12">
                <Wallet className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Chưa có chi tiêu nào</h3>
                <p className="text-gray-500 mb-6">Hãy bắt đầu ghi lại các khoản chi tiêu!</p>
                <Link href="/dashboard/finance/add-expense" className="btn-primary">
                  Thêm chi tiêu đầu tiên
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Savings Goals Tab */}
      {activeTab === 'goals' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {savingsGoals.map((goal, index) => (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`card border-2 ${getPriorityColor(goal.priority)}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{goal.icon}</div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{goal.title}</h3>
                      <p className="text-gray-600 text-sm">{goal.description}</p>
                    </div>
                  </div>
                  <div className={`px-2 py-1 text-xs font-medium rounded-full ${
                    goal.priority === 'high' ? 'bg-red-100 text-red-800' :
                    goal.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {goal.priority === 'high' ? 'Cao' : goal.priority === 'medium' ? 'Trung bình' : 'Thấp'}
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600">Tiến độ</span>
                    <span className="font-semibold">
                      {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-primary-500 to-secondary-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${getProgressPercentage(goal.currentAmount, goal.targetAmount)}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between mt-2 text-sm text-gray-600">
                    <span>{Math.round(getProgressPercentage(goal.currentAmount, goal.targetAmount))}% hoàn thành</span>
                    <span>Hạn: {new Date(goal.deadline).toLocaleDateString('vi-VN')}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    Mục tiêu hàng tháng: <span className="font-semibold">{formatCurrency(goal.monthlyTarget)}</span>
                  </div>
                  <Link href={`/dashboard/finance/goals/${goal.id}`} className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                    Chi tiết →
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
