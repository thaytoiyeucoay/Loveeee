import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PUT /api/messages/[id] - Mark message as read
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    const updatedMessage = await prisma.loveMessage.update({
      where: { id },
      data: { isRead: true },
      include: {
        couple: {
          include: {
            user1: { select: { id: true, name: true, avatar: true } },
            user2: { select: { id: true, name: true, avatar: true } }
          }
        }
      }
    })

    return NextResponse.json({ message: updatedMessage })
  } catch (error) {
    console.error('Error updating message:', error)
    return NextResponse.json({ error: 'Failed to update message' }, { status: 500 })
  }
}

// DELETE /api/messages/[id] - Delete message
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    await prisma.loveMessage.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting message:', error)
    return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 })
  }
}
