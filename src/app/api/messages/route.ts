import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/messages - Fetch all love messages for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Find messages where user is part of the couple
    const messages = await prisma.loveMessage.findMany({
      where: {
        couple: {
          OR: [
            { user1Id: userId },
            { user2Id: userId }
          ]
        }
      },
      orderBy: {
        sentDate: 'desc'
      },
      include: {
        couple: {
          include: {
            user1: {
              select: { id: true, name: true, avatar: true }
            },
            user2: {
              select: { id: true, name: true, avatar: true }
            }
          }
        }
      }
    })

    return NextResponse.json({ messages })
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
  }
}

// POST /api/messages - Create new love message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, message, type, title, emoji, isScheduled, deliveryDate, deliveryTime } = body

    if (!userId || !message) {
      return NextResponse.json({ error: 'User ID and message are required' }, { status: 400 })
    }

    // Find couple for this user
    let couple = await prisma.couple.findFirst({
      where: {
        OR: [
          { user1Id: userId },
          { user2Id: userId }
        ]
      }
    })

    if (!couple) {
      return NextResponse.json({ 
        error: 'Bạn chưa có couple. Vui lòng thiết lập couple trước khi tạo messages.' 
      }, { status: 400 })
    }

    // Calculate delivery date if scheduled
    let sentDate = new Date()
    if (isScheduled && deliveryDate && deliveryTime) {
      const [hours, minutes] = deliveryTime.split(':').map(Number)
      sentDate = new Date(deliveryDate)
      sentDate.setHours(hours, minutes, 0, 0)
    }

    // Create the message with title and emoji combined
    const fullMessage = `${emoji} ${title}\n\n${message}`

    const newMessage = await prisma.loveMessage.create({
      data: {
        coupleId: couple.id,
        message: fullMessage,
        type: type || 'daily',
        sentDate,
        isRead: false
      },
      include: {
        couple: {
          include: {
            user1: {
              select: { id: true, name: true, avatar: true }
            },
            user2: {
              select: { id: true, name: true, avatar: true }
            }
          }
        }
      }
    })

    return NextResponse.json({ message: newMessage }, { status: 201 })
  } catch (error) {
    console.error('Error creating message:', error)
    return NextResponse.json({ error: 'Failed to create message' }, { status: 500 })
  }
}

// PUT /api/messages - Update love message
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { messageId, userId, message, type, title, emoji, isScheduled, deliveryDate, deliveryTime } = body

    if (!messageId || !userId) {
      return NextResponse.json({ error: 'Message ID and User ID are required' }, { status: 400 })
    }

    // Find message and verify user has access
    const existingMessage = await prisma.loveMessage.findUnique({
      where: { id: messageId },
      include: {
        couple: true
      }
    })

    if (!existingMessage) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 })
    }

    // Check if user is part of the couple
    if (existingMessage.couple.user1Id !== userId && existingMessage.couple.user2Id !== userId) {
      return NextResponse.json({ error: 'Bạn không có quyền chỉnh sửa message này' }, { status: 403 })
    }

    // Calculate delivery date if scheduled
    let sentDate = existingMessage.sentDate
    if (isScheduled && deliveryDate && deliveryTime) {
      const [hours, minutes] = deliveryTime.split(':').map(Number)
      sentDate = new Date(deliveryDate)
      sentDate.setHours(hours, minutes, 0, 0)
    }

    // Create the updated message with title and emoji combined
    const fullMessage = message ? `${emoji || '💕'} ${title || 'Love Message'}\n\n${message}` : existingMessage.message

    const updatedMessage = await prisma.loveMessage.update({
      where: { id: messageId },
      data: {
        message: fullMessage,
        type: type || existingMessage.type,
        sentDate: sentDate
      },
      include: {
        couple: {
          include: {
            user1: {
              select: { id: true, name: true, avatar: true }
            },
            user2: {
              select: { id: true, name: true, avatar: true }
            }
          }
        }
      }
    })

    return NextResponse.json({ message: 'Message updated successfully', data: updatedMessage })
  } catch (error) {
    console.error('Error updating message:', error)
    return NextResponse.json({ error: 'Failed to update message' }, { status: 500 })
  }
}

// DELETE /api/messages - Delete love message
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const messageId = searchParams.get('messageId')
    const userId = searchParams.get('userId')

    if (!messageId || !userId) {
      return NextResponse.json({ error: 'Message ID and User ID are required' }, { status: 400 })
    }

    // Find message and verify user has access
    const existingMessage = await prisma.loveMessage.findUnique({
      where: { id: messageId },
      include: {
        couple: true
      }
    })

    if (!existingMessage) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 })
    }

    // Check if user is part of the couple
    if (existingMessage.couple.user1Id !== userId && existingMessage.couple.user2Id !== userId) {
      return NextResponse.json({ error: 'Bạn không có quyền xóa message này' }, { status: 403 })
    }

    await prisma.loveMessage.delete({
      where: { id: messageId }
    })

    return NextResponse.json({ message: 'Message deleted successfully' })
  } catch (error) {
    console.error('Error deleting message:', error)
    return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 })
  }
}
