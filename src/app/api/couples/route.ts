import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/couples?userId=xxx - Get couple info for user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Find couple where user is either user1 or user2
    const couple = await prisma.couple.findFirst({
      where: {
        OR: [
          { user1Id: userId },
          { user2Id: userId }
        ]
      },
      include: {
        user1: {
          select: { id: true, name: true, avatar: true, email: true }
        },
        user2: {
          select: { id: true, name: true, avatar: true, email: true }
        }
      }
    })

    return NextResponse.json({ couple })
  } catch (error) {
    console.error('Error fetching couple:', error)
    return NextResponse.json({ error: 'Failed to fetch couple' }, { status: 500 })
  }
}

// POST /api/couples - Create or join couple
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, partnerEmail, action } = body

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    if (action === 'create') {
      // Create couple invitation with partner email
      if (!partnerEmail) {
        return NextResponse.json({ error: 'Partner email is required' }, { status: 400 })
      }

      // Check if partner exists
      const partner = await prisma.user.findUnique({
        where: { email: partnerEmail }
      })

      if (!partner) {
        return NextResponse.json({ error: 'Không tìm thấy người dùng với email này' }, { status: 404 })
      }

      if (partner.id === userId) {
        return NextResponse.json({ error: 'Không thể kết nối với chính mình' }, { status: 400 })
      }

      // Check if either user already has a couple
      const existingCouple = await prisma.couple.findFirst({
        where: {
          OR: [
            { user1Id: userId },
            { user2Id: userId },
            { user1Id: partner.id },
            { user2Id: partner.id }
          ]
        }
      })

      if (existingCouple) {
        return NextResponse.json({ error: 'Một trong hai người đã có couple' }, { status: 400 })
      }

      // Create couple
      const couple = await prisma.couple.create({
        data: {
          user1Id: userId,
          user2Id: partner.id,
          relationshipStart: new Date()
        },
        include: {
          user1: {
            select: { id: true, name: true, avatar: true, email: true }
          },
          user2: {
            select: { id: true, name: true, avatar: true, email: true }
          }
        }
      })

      return NextResponse.json({
        message: 'Couple đã được tạo thành công!',
        couple
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Error managing couple:', error)
    return NextResponse.json({ error: 'Failed to manage couple' }, { status: 500 })
  }
}

// PUT /api/couples - Update couple information
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, relationshipStart, anniversaryDate, coupleGoals } = body

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Find couple for this user
    const couple = await prisma.couple.findFirst({
      where: {
        OR: [
          { user1Id: userId },
          { user2Id: userId }
        ]
      }
    })

    if (!couple) {
      return NextResponse.json({ error: 'Không tìm thấy couple' }, { status: 404 })
    }

    // Update couple info
    const updatedCouple = await prisma.couple.update({
      where: { id: couple.id },
      data: {
        relationshipStart: relationshipStart ? new Date(relationshipStart) : undefined,
        anniversaryDate: anniversaryDate ? new Date(anniversaryDate) : undefined,
        coupleGoals: coupleGoals || undefined
      },
      include: {
        user1: {
          select: { id: true, name: true, avatar: true, email: true }
        },
        user2: {
          select: { id: true, name: true, avatar: true, email: true }
        }
      }
    })

    return NextResponse.json({
      message: 'Thông tin couple đã được cập nhật thành công!',
      couple: updatedCouple
    })
  } catch (error) {
    console.error('Error updating couple:', error)
    return NextResponse.json({ error: 'Failed to update couple' }, { status: 500 })
  }
}

// DELETE /api/couples - Leave couple
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Find and delete couple
    const couple = await prisma.couple.findFirst({
      where: {
        OR: [
          { user1Id: userId },
          { user2Id: userId }
        ]
      }
    })

    if (!couple) {
      return NextResponse.json({ error: 'Không tìm thấy couple' }, { status: 404 })
    }

    await prisma.couple.delete({
      where: { id: couple.id }
    })

    return NextResponse.json({ message: 'Đã rời khỏi couple thành công' })
  } catch (error) {
    console.error('Error leaving couple:', error)
    return NextResponse.json({ error: 'Failed to leave couple' }, { status: 500 })
  }
}
