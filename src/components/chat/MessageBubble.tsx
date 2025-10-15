import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { MoreVertical, Reply, Edit3, Trash2, Copy } from 'lucide-react'
import { Message } from '../../contexts/ChatContext'

interface MessageBubbleProps {
  message: Message
  isOwn: boolean
  showTime?: boolean
  onReply?: (message: Message) => void
  onEdit?: (messageId: string, newContent: string) => void
  onDelete?: (messageId: string) => void
  onReact?: (messageId: string, emoji: string) => void
}

export default function MessageBubble({
  message,
  isOwn,
  showTime = true,
  onReply,
  onEdit,
  onDelete,
  onReact
}: MessageBubbleProps) {
  const [showMenu, setShowMenu] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(message.content)

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    })
  }

  const handleEdit = () => {
    if (onEdit) {
      onEdit(message.id, editContent)
      setIsEditing(false)
      setShowMenu(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content)
    setShowMenu(false)
  }

  const quickReactions = ['❤️', '😊', '😍', '👍', '😂', '😢']

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`group flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div className={`relative max-w-xs lg:max-w-md ${isOwn ? 'order-2' : 'order-1'}`}>
        {/* Message Bubble */}
        <div className="relative">
          {isEditing ? (
            <div className={`px-4 py-2 rounded-2xl ${
              isOwn
                ? 'bg-primary-100 border border-primary-300'
                : 'bg-gray-100 border border-gray-300'
            }`}>
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full bg-transparent resize-none outline-none text-sm"
                autoFocus
              />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Hủy
                </button>
                <button
                  onClick={handleEdit}
                  className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                >
                  Lưu
                </button>
              </div>
            </div>
          ) : (
            <div
              className={`px-4 py-2 rounded-2xl shadow-sm relative ${
                isOwn
                  ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-br-md'
                  : 'bg-white text-gray-800 rounded-bl-md border border-gray-200'
              }`}
            >
              <p className="text-sm leading-relaxed">{message.content}</p>
              {message.isEdited && (
                <span className={`text-xs ${isOwn ? 'text-white text-opacity-70' : 'text-gray-500'} italic`}>
                  (đã chỉnh sửa)
                </span>
              )}

              {/* Message Menu */}
              <button
                onClick={() => setShowMenu(!showMenu)}
                className={`absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-black hover:bg-opacity-10`}
              >
                <MoreVertical className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Reactions */}
          {message.reactions && message.reactions.length > 0 && (
            <div className="flex gap-1 mt-1">
              {message.reactions.map((reaction, index) => (
                <span
                  key={index}
                  className="text-xs bg-white rounded-full px-2 py-1 shadow-sm border"
                >
                  {reaction}
                </span>
              ))}
            </div>
          )}

          {/* Menu Dropdown */}
          {showMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`absolute top-8 ${isOwn ? 'right-0' : 'left-0'} bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 min-w-32`}
            >
              {/* Quick Reactions */}
              <div className="px-3 py-2 border-b border-gray-100">
                <div className="flex gap-1">
                  {quickReactions.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => {
                        onReact?.(message.id, emoji)
                        setShowMenu(false)
                      }}
                      className="hover:bg-gray-100 rounded p-1 text-sm"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Menu Items */}
              <button
                onClick={() => {
                  onReply?.(message)
                  setShowMenu(false)
                }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
              >
                <Reply className="w-4 h-4" />
                Trả lời
              </button>

              <button
                onClick={handleCopy}
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                Sao chép
              </button>

              {isOwn && (
                <>
                  <button
                    onClick={() => {
                      setIsEditing(true)
                      setShowMenu(false)
                    }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
                  >
                    <Edit3 className="w-4 h-4" />
                    Chỉnh sửa
                  </button>

                  <button
                    onClick={() => {
                      onDelete?.(message.id)
                      setShowMenu(false)
                    }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2 text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                    Xóa
                  </button>
                </>
              )}
            </motion.div>
          )}
        </div>

        {/* Timestamp and Read Status */}
        {showTime && (
          <div className={`flex items-center gap-1 mt-1 text-xs text-gray-500 ${
            isOwn ? 'justify-end' : 'justify-start'
          }`}>
            <span>{formatTime(message.timestamp)}</span>
            {isOwn && (
              <span className={message.isRead ? 'text-blue-500' : 'text-gray-400'}>
                {message.isRead ? '✓✓' : '✓'}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Click outside to close menu */}
      {showMenu && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowMenu(false)}
        />
      )}
    </motion.div>
  )
}
