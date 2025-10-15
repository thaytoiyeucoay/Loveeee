'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Send,
  Smile,
  Paperclip,
  Camera,
  Heart,
  MoreVertical,
  Phone,
  Video,
  Info,
  Image,
  Mic,
  MicOff
} from 'lucide-react'

interface Message {
  id: string
  content: string
  senderId: 'me' | 'partner'
  senderName: string
  timestamp: Date
  type: 'text' | 'image' | 'voice'
  isRead: boolean
  reactions?: string[]
}

interface TypingIndicator {
  isTyping: boolean
  user: string
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Chào anh yêu! ❤️',
      senderId: 'partner',
      senderName: 'Demo Partner',
      timestamp: new Date(Date.now() - 3600000),
      type: 'text',
      isRead: true
    },
    {
      id: '2',
      content: 'Em có khỏe không?',
      senderId: 'partner',
      senderName: 'Demo Partner',
      timestamp: new Date(Date.now() - 3500000),
      type: 'text',
      isRead: true
    },
    {
      id: '3',
      content: 'Chào em! Anh vừa về đến nhà đây 😊',
      senderId: 'me',
      senderName: 'Admin Loveeee',
      timestamp: new Date(Date.now() - 3000000),
      type: 'text',
      isRead: true
    },
    {
      id: '4',
      content: 'Hôm nay anh làm việc mệt lắm, may có em động viên',
      senderId: 'me',
      senderName: 'Admin Loveeee',
      timestamp: new Date(Date.now() - 2900000),
      type: 'text',
      isRead: true
    },
    {
      id: '5',
      content: 'Aww, anh nghỉ ngơi nhiều nhé! Em sẽ nấu món anh thích tối nay ✨',
      senderId: 'partner',
      senderName: 'Demo Partner',
      timestamp: new Date(Date.now() - 1800000),
      type: 'text',
      isRead: true
    },
    {
      id: '6',
      content: 'Em tuyệt vời quá! Anh yêu em nhiều lắm 💕',
      senderId: 'me',
      senderName: 'Admin Loveeee',
      timestamp: new Date(Date.now() - 1200000),
      type: 'text',
      isRead: true
    }
  ])
  
  const [newMessage, setNewMessage] = useState('')
  const [typing, setTyping] = useState<TypingIndicator>({ isTyping: false, user: '' })
  const [isRecording, setIsRecording] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  const emojis = ['❤️', '😊', '😍', '🥰', '😘', '💕', '💖', '🌹', '✨', '🎉', '😂', '👍', '🙏', '😢', '😭', '👏']
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Simulate partner typing
  useEffect(() => {
    const simulatePartnerTyping = () => {
      if (Math.random() > 0.7) {
        setTyping({ isTyping: true, user: 'Demo Partner' })
        setTimeout(() => {
          setTyping({ isTyping: false, user: '' })
          // Sometimes send a message after typing
          if (Math.random() > 0.5) {
            const responses = [
              'Anh đang làm gì thế? 🤔',
              'Em nhớ anh quá! 💕',
              'Hôm nay thời tiết đẹp nhỉ ☀️',
              'Tối nay chúng ta xem phim nhé! 🎬',
              'Anh có thấy tin nhắn em gửi không? 💭'
            ]
            setTimeout(() => {
              const randomResponse = responses[Math.floor(Math.random() * responses.length)]
              handleReceiveMessage(randomResponse)
            }, 1000)
          }
        }, 2000 + Math.random() * 3000)
      }
    }

    const interval = setInterval(simulatePartnerTyping, 10000 + Math.random() * 20000)
    return () => clearInterval(interval)
  }, [])

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      senderId: 'me',
      senderName: 'Admin Loveeee',
      timestamp: new Date(),
      type: 'text',
      isRead: false
    }

    setMessages(prev => [...prev, message])
    setNewMessage('')
    
    // Simulate read receipt after a delay
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === message.id ? { ...msg, isRead: true } : msg
      ))
    }, 2000 + Math.random() * 3000)
  }

  const handleReceiveMessage = (content: string) => {
    const message: Message = {
      id: Date.now().toString(),
      content,
      senderId: 'partner',
      senderName: 'Demo Partner',
      timestamp: new Date(),
      type: 'text',
      isRead: true
    }

    setMessages(prev => [...prev, message])
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const addEmoji = (emoji: string) => {
    setNewMessage(prev => prev + emoji)
    setShowEmojiPicker(false)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    })
  }

  const formatDate = (date: Date) => {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return 'Hôm nay'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Hôm qua'
    } else {
      return date.toLocaleDateString('vi-VN')
    }
  }

  const shouldShowDateDivider = (currentMsg: Message, prevMsg?: Message) => {
    if (!prevMsg) return true
    const currentDate = new Date(currentMsg.timestamp).toDateString()
    const prevDate = new Date(prevMsg.timestamp).toDateString()
    return currentDate !== prevDate
  }

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] max-h-[800px] bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Demo Partner</h3>
              <p className="text-sm opacity-90">
                {typing.isTyping ? 'Đang nhập...' : 'Hoạt động 2 phút trước'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors">
              <Phone className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors">
              <Video className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors">
              <Info className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
        style={{ 
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23f8f9fa" fill-opacity="0.4"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          backgroundSize: '30px 30px'
        }}
      >
        <AnimatePresence>
          {messages.map((message, index) => (
            <div key={message.id}>
              {/* Date Divider */}
              {shouldShowDateDivider(message, messages[index - 1]) && (
                <div className="flex items-center justify-center my-4">
                  <div className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                    {formatDate(message.timestamp)}
                  </div>
                </div>
              )}

              {/* Message */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex ${message.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs lg:max-w-md ${message.senderId === 'me' ? 'order-2' : 'order-1'}`}>
                  <div
                    className={`px-4 py-2 rounded-2xl shadow-sm ${
                      message.senderId === 'me'
                        ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-br-md'
                        : 'bg-gray-100 text-gray-800 rounded-bl-md'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  </div>
                  <div className={`flex items-center gap-1 mt-1 text-xs text-gray-500 ${
                    message.senderId === 'me' ? 'justify-end' : 'justify-start'
                  }`}>
                    <span>{formatTime(message.timestamp)}</span>
                    {message.senderId === 'me' && (
                      <span className={message.isRead ? 'text-blue-500' : 'text-gray-400'}>
                        {message.isRead ? '✓✓' : '✓'}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        <AnimatePresence>
          {typing.isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex justify-start"
            >
              <div className="bg-gray-200 rounded-2xl rounded-bl-md px-4 py-3 max-w-xs">
                <div className="flex items-center gap-1">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-xs text-gray-600 ml-2">{typing.user} đang nhập...</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Emoji Picker */}
      <AnimatePresence>
        {showEmojiPicker && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-white border-t border-gray-200 p-4"
          >
            <div className="grid grid-cols-8 gap-2">
              {emojis.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => addEmoji(emoji)}
                  className="p-2 hover:bg-gray-100 rounded-lg text-xl transition-colors"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-end gap-3">
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
              <Paperclip className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
              <Camera className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Smile className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 relative">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Nhập tin nhắn..."
              className="w-full max-h-32 px-4 py-3 bg-gray-100 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
              rows={1}
              style={{
                minHeight: '44px',
                height: 'auto'
              }}
            />
          </div>

          <div className="flex items-center gap-2">
            {newMessage.trim() ? (
              <button
                onClick={handleSendMessage}
                className="p-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-full hover:shadow-lg transition-all"
              >
                <Send className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={() => setIsRecording(!isRecording)}
                className={`p-3 rounded-full transition-all ${
                  isRecording
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
