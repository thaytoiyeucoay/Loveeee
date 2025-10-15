'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import {
  ArrowLeft,
  Save,
  Camera,
  MapPin,
  Calendar,
  DollarSign,
  Utensils,
  Car,
  Home,
  Gift,
  Coffee,
  ShoppingBag,
  Plane,
  Users,
  Calculator
} from 'lucide-react'
import Link from 'next/link'

export default function AddExpensePage() {
  const { data: session } = useSession()
  const router = useRouter()
  
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('food')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [paidBy, setPaidBy] = useState('me')
  const [splitType, setSplitType] = useState('equal')
  const [customSplit, setCustomSplit] = useState({ me: 50, partner: 50 })
  const [receipt, setReceipt] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const categories = [
    { id: 'food', label: 'Ăn uống', icon: Utensils, color: 'bg-orange-100 text-orange-800' },
    { id: 'transport', label: 'Di chuyển', icon: Car, color: 'bg-green-100 text-green-800' },
    { id: 'home', label: 'Nhà cửa', icon: Home, color: 'bg-yellow-100 text-yellow-800' },
    { id: 'gifts', label: 'Quà tặng', icon: Gift, color: 'bg-red-100 text-red-800' },
    { id: 'coffee', label: 'Café', icon: Coffee, color: 'bg-amber-100 text-amber-800' },
    { id: 'shopping', label: 'Mua sắm', icon: ShoppingBag, color: 'bg-pink-100 text-pink-800' },
    { id: 'travel', label: 'Du lịch', icon: Plane, color: 'bg-blue-100 text-blue-800' },
    { id: 'entertainment', label: 'Giải trí', icon: Users, color: 'bg-purple-100 text-purple-800' },
  ]

  const handleReceiptUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setReceipt(file)
    }
  }

  const handleSave = async () => {
    if (!title || !amount || !session?.user?.id) {
      setError('Vui lòng điền đầy đủ thông tin')
      return
    }

    setIsLoading(true)
    setError('')
    
    try {
      const split = calculateSplit()
      
      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: session.user.id,
          title,
          amount: parseFloat(amount),
          currency: 'VND',
          category,
          description,
          date,
          splitType,
          paidByOther: splitType === 'equal' ? split.partner : (splitType === 'custom' ? split.partner : null),
          receipt: null // For now, we'll implement file upload later
        })
      })

      const result = await response.json()

      if (response.ok) {
        alert('✅ Chi tiêu đã được thêm thành công!')
        router.push('/dashboard/finance')
      } else {
        setError(result.error)
      }
    } catch (error: any) {
      console.error('Error creating expense:', error)
      setError('❌ Failed to create expense')
    } finally {
      setIsLoading(false)
    }
  }

  const calculateSplit = () => {
    const totalAmount = parseFloat(amount) || 0
    if (splitType === 'equal') {
      return { me: totalAmount / 2, partner: totalAmount / 2 }
    } else if (splitType === 'full') {
      return paidBy === 'me' ? { me: totalAmount, partner: 0 } : { me: 0, partner: totalAmount }
    } else {
      return {
        me: (totalAmount * customSplit.me) / 100,
        partner: (totalAmount * customSplit.partner) / 100
      }
    }
  }

  const split = calculateSplit()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href="/dashboard/finance"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Thêm chi tiêu</h1>
            <p className="text-gray-600">Ghi lại khoản chi tiêu mới</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={isLoading || !title.trim() || !amount}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          {isLoading ? 'Đang lưu...' : 'Lưu chi tiêu'}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Thông tin chi tiêu</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tên chi tiêu *</label>
                  <input
                    type="text"
                    placeholder="VD: Dinner tại Pizza 4Ps"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Số tiền *</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      placeholder="0"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="input-field pl-10 pr-12"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                      VNĐ
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ngày chi tiêu</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="input-field pl-10"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Địa điểm</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="VD: Pizza 4Ps Lê Thánh Tôn"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="input-field pl-10"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
                <textarea
                  rows={3}
                  placeholder="Ghi chú thêm về khoản chi tiêu này..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>
          </motion.div>

          {/* Category Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Danh mục</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    category === cat.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <cat.icon className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                  <div className="text-sm font-medium text-gray-700">{cat.label}</div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Payment & Split */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Thanh toán & Phân chia</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ai đã thanh toán?</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setPaidBy('me')}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      paidBy === 'me'
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-gray-800">Tôi</div>
                  </button>
                  <button
                    onClick={() => setPaidBy('partner')}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      paidBy === 'partner'
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-gray-800">Người yêu</div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cách phân chia</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="splitType"
                      value="equal"
                      checked={splitType === 'equal'}
                      onChange={(e) => setSplitType(e.target.value)}
                      className="w-4 h-4 text-primary-600"
                    />
                    <span className="text-gray-700">Chia đều (50/50)</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="splitType"
                      value="full"
                      checked={splitType === 'full'}
                      onChange={(e) => setSplitType(e.target.value)}
                      className="w-4 h-4 text-primary-600"
                    />
                    <span className="text-gray-700">Toàn bộ (người thanh toán chịu hết)</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="splitType"
                      value="custom"
                      checked={splitType === 'custom'}
                      onChange={(e) => setSplitType(e.target.value)}
                      className="w-4 h-4 text-primary-600"
                    />
                    <span className="text-gray-700">Tùy chỉnh</span>
                  </label>
                </div>

                {splitType === 'custom' && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Tôi (%)</label>
                        <input
                          type="number"
                          value={customSplit.me}
                          onChange={(e) => setCustomSplit(prev => ({ 
                            ...prev, 
                            me: parseInt(e.target.value) || 0,
                            partner: 100 - (parseInt(e.target.value) || 0)
                          }))}
                          className="input-field"
                          min="0"
                          max="100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Người yêu (%)</label>
                        <input
                          type="number"
                          value={customSplit.partner}
                          onChange={(e) => setCustomSplit(prev => ({ 
                            ...prev, 
                            partner: parseInt(e.target.value) || 0,
                            me: 100 - (parseInt(e.target.value) || 0)
                          }))}
                          className="input-field"
                          min="0"
                          max="100"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Receipt Upload */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Hóa đơn (Tùy chọn)</h3>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleReceiptUpload}
                className="hidden"
                id="receipt-upload"
              />
              <label htmlFor="receipt-upload" className="cursor-pointer">
                <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Chụp ảnh hoặc tải lên hóa đơn</p>
                <p className="text-sm text-gray-500">JPG, PNG (tối đa 5MB)</p>
              </label>
            </div>

            {receipt && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-3">
                  <Camera className="w-5 h-5 text-green-600" />
                  <span className="text-green-800 font-medium">{receipt.name}</span>
                  <button 
                    onClick={() => setReceipt(null)}
                    className="ml-auto text-red-600 hover:text-red-700"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Split Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Phân chia chi phí
            </h3>
            
            {amount && (
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Tổng số tiền</div>
                  <div className="text-xl font-bold text-gray-800">
                    {parseFloat(amount).toLocaleString('vi-VN')} VNĐ
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-sm text-blue-600 mb-1">Tôi trả</div>
                    <div className="font-bold text-blue-800">
                      {split.me.toLocaleString('vi-VN')} VNĐ
                    </div>
                  </div>
                  <div className="p-3 bg-pink-50 rounded-lg border border-pink-200">
                    <div className="text-sm text-pink-600 mb-1">Người yêu trả</div>
                    <div className="font-bold text-pink-800">
                      {split.partner.toLocaleString('vi-VN')} VNĐ
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Quick Amount Buttons */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="card"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Số tiền phổ biến</h3>
            <div className="grid grid-cols-2 gap-2">
              {[50000, 100000, 200000, 500000, 1000000, 2000000].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setAmount(amt.toString())}
                  className="p-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  {amt.toLocaleString('vi-VN')}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Tips */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="card bg-blue-50 border-blue-200"
          >
            <h3 className="text-lg font-semibold text-blue-800 mb-3">💡 Mẹo quản lý chi tiêu</h3>
            <ul className="text-sm text-blue-700 space-y-2">
              <li>• Ghi chi tiêu ngay khi phát sinh</li>
              <li>• Chụp ảnh hóa đơn để theo dõi</li>
              <li>• Phân loại rõ ràng theo danh mục</li>
              <li>• Thảo luận cách chia chi phí với người yêu</li>
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
