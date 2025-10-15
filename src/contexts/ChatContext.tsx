'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface Message {
  id: string
  content: string
  senderId: 'me' | 'partner'
  senderName: string
  timestamp: Date
  type: 'text' | 'image' | 'voice' | 'file'
  isRead: boolean
  reactions?: string[]
  replyTo?: string
  isEdited?: boolean
  fileUrl?: string
  fileName?: string
}

export interface ChatUser {
  id: string
  name: string
  avatar?: string
  isOnline: boolean
  lastSeen: Date
}

interface ChatContextType {
  messages: Message[]
  currentUser: ChatUser
  partner: ChatUser
  isTyping: boolean
  unreadCount: number
  sendMessage: (content: string, type?: Message['type']) => void
  markAsRead: (messageId: string) => void
  markAllAsRead: () => void
  deleteMessage: (messageId: string) => void
  editMessage: (messageId: string, newContent: string) => void
  addReaction: (messageId: string, emoji: string) => void
  removeReaction: (messageId: string, emoji: string) => void
  setTyping: (isTyping: boolean) => void
  connectToChat: () => void
  disconnectFromChat: () => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export const useChatContext = () => {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider')
  }
  return context
}

interface ChatProviderProps {
  children: ReactNode
}

export const ChatProvider = ({ children }: ChatProviderProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Chào anh yêu! ❤️',
      senderId: 'partner',
      senderName: 'Demo Partner',
      timestamp: new Date(Date.now() - 7200000),
      type: 'text',
      isRead: true
    },
    {
      id: '2',
      content: 'Hôm nay anh có kế hoạch gì không?',
      senderId: 'partner',
      senderName: 'Demo Partner',
      timestamp: new Date(Date.now() - 7100000),
      type: 'text',
      isRead: true
    },
    {
      id: '3',
      content: 'Chào em! Anh định đi mua sắm một chút, em có muốn đi cùng không? 😊',
      senderId: 'me',
      senderName: 'Admin Loveeee',
      timestamp: new Date(Date.now() - 6600000),
      type: 'text',
      isRead: true
    },
    {
      id: '4',
      content: 'Có chứ! Em sẽ chuẩn bị ngay. Chúng ta đi mua gì thế anh? 🛍️',
      senderId: 'partner',
      senderName: 'Demo Partner',
      timestamp: new Date(Date.now() - 6000000),
      type: 'text',
      isRead: true
    },
    {
      id: '5',
      content: 'Mình đi mua đồ cho bữa tối nay, anh muốn nấu món đặc biệt cho em 👨‍🍳✨',
      senderId: 'me',
      senderName: 'Admin Loveeee',
      timestamp: new Date(Date.now() - 5400000),
      type: 'text',
      isRead: true
    },
    {
      id: '6',
      content: 'Aww anh tuyệt vời quá! Em thích lắm 💕 Vậy 30 phút nữa em sẽ sẵn sàng nhé!',
      senderId: 'partner',
      senderName: 'Demo Partner',
      timestamp: new Date(Date.now() - 4800000),
      type: 'text',
      isRead: true
    }
  ])

  const [currentUser] = useState<ChatUser>({
    id: 'me',
    name: 'Admin Loveeee',
    avatar: '/avatars/user1.jpg',
    isOnline: true,
    lastSeen: new Date()
  })

  const [partner, setPartner] = useState<ChatUser>({
    id: 'partner',
    name: 'Demo Partner', 
    avatar: '/avatars/user2.jpg',
    isOnline: true,
    lastSeen: new Date(Date.now() - 120000) // 2 minutes ago
  })

  const [isTyping, setIsTyping] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  // Simulate partner activity
  useEffect(() => {
    const updatePartnerStatus = () => {
      const isOnline = Math.random() > 0.3 // 70% chance online
      setPartner(prev => ({
        ...prev,
        isOnline,
        lastSeen: isOnline ? new Date() : new Date(Date.now() - Math.random() * 1800000) // Up to 30 min ago
      }))
    }

    const interval = setInterval(updatePartnerStatus, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [])

  // Simulate receiving messages
  useEffect(() => {
    const receiveRandomMessage = () => {
      if (Math.random() > 0.8) { // 20% chance
        const responses = [
          'Anh đang làm gì thế? 🤔',
          'Em nhớ anh quá! 💕',
          'Hôm nay trời đẹp nhỉ ☀️',
          'Tối nay mình xem phim nhé! 🎬',
          'Yêu anh nhiều lắm! ❤️',
          'Anh đã ăn cơm chưa? 🍚',
          'Em vừa thấy một món quà cute cho anh! 🎁',
          'Nhớ anh từng giây từng phút 🥺'
        ]

        const randomMessage = responses[Math.floor(Math.random() * responses.length)]
        
        const newMessage: Message = {
          id: Date.now().toString(),
          content: randomMessage,
          senderId: 'partner',
          senderName: 'Demo Partner',
          timestamp: new Date(),
          type: 'text',
          isRead: false
        }

        setMessages(prev => [...prev, newMessage])
        setUnreadCount(prev => prev + 1)
      }
    }

    const interval = setInterval(receiveRandomMessage, 15000 + Math.random() * 30000) // 15-45s
    return () => clearInterval(interval)
  }, [])

  const sendMessage = (content: string, type: Message['type'] = 'text') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      senderId: 'me',
      senderName: currentUser.name,
      timestamp: new Date(),
      type,
      isRead: false
    }

    setMessages(prev => [...prev, newMessage])
    
    // Simulate read receipt
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === newMessage.id ? { ...msg, isRead: true } : msg
      ))
    }, 2000 + Math.random() * 3000)
  }

  const markAsRead = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, isRead: true } : msg
    ))
    if (messages.find(m => m.id === messageId)?.senderId === 'partner') {
      setUnreadCount(prev => Math.max(0, prev - 1))
    }
  }

  const markAllAsRead = () => {
    setMessages(prev => prev.map(msg => ({ ...msg, isRead: true })))
    setUnreadCount(0)
  }

  const deleteMessage = (messageId: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId))
  }

  const editMessage = (messageId: string, newContent: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, content: newContent, isEdited: true }
        : msg
    ))
  }

  const addReaction = (messageId: string, emoji: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const reactions = msg.reactions || []
        if (!reactions.includes(emoji)) {
          return { ...msg, reactions: [...reactions, emoji] }
        }
      }
      return msg
    }))
  }

  const removeReaction = (messageId: string, emoji: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId && msg.reactions) {
        return { 
          ...msg, 
          reactions: msg.reactions.filter(r => r !== emoji) 
        }
      }
      return msg
    }))
  }

  const connectToChat = () => {
    // In a real app, this would establish WebSocket connection
    console.log('Connected to chat')
  }

  const disconnectFromChat = () => {
    // In a real app, this would close WebSocket connection
    console.log('Disconnected from chat')
  }

  return (
    <ChatContext.Provider value={{
      messages,
      currentUser,
      partner,
      isTyping,
      unreadCount,
      sendMessage,
      markAsRead,
      markAllAsRead,
      deleteMessage,
      editMessage,
      addReaction,
      removeReaction,
      setTyping: setIsTyping,
      connectToChat,
      disconnectFromChat
    }}>
      {children}
    </ChatContext.Provider>
  )
}
