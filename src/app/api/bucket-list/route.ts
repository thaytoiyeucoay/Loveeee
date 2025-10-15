import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/bucket-list - Fetch all bucket list items for user's couple
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

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
      return NextResponse.json({ items: [] })
    }

    const items = await prisma.bucketListItem.findMany({
      where: {
        coupleId: couple.id
      },
      orderBy: {
        createdAt: 'desc'
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
        },
        createdBy: {
          select: { id: true, name: true, avatar: true }
        }
      }
    })

    return NextResponse.json({ items })
  } catch (error) {
    console.error('Error fetching bucket list:', error)
    return NextResponse.json({ error: 'Failed to fetch bucket list' }, { status: 500 })
  }
}

// POST /api/bucket-list - Create new bucket list item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, title, description, category, priority } = body

    if (!userId || !title) {
      return NextResponse.json({ error: 'User ID and title are required' }, { status: 400 })
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
      return NextResponse.json({ 
        error: 'Bạn chưa có couple. Vui lòng thiết lập couple trước khi tạo bucket list.' 
      }, { status: 400 })
    }

    const newItem = await prisma.bucketListItem.create({
      data: {
        coupleId: couple.id,
        createdById: userId,
        title,
        description: description || '',
        category: category || 'other',
        priority: priority || 'medium',
        isCompleted: false
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

    return NextResponse.json({ item: newItem }, { status: 201 })
  } catch (error) {
    console.error('Error creating bucket list item:', error)
    return NextResponse.json({ error: 'Failed to create bucket list item' }, { status: 500 })
  }
}

// PUT /api/bucket-list - Update bucket list item
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { itemId, userId, title, description, category, priority, isCompleted, proofImages, notes } = body

    if (!itemId || !userId) {
      return NextResponse.json({ error: 'Item ID and User ID are required' }, { status: 400 })
    }

    // Find item and verify user has access
    const existingItem = await prisma.bucketListItem.findUnique({
      where: { id: itemId },
      include: {
        couple: true
      }
    })

    if (!existingItem) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }

    // Check if user is part of the couple
    if (existingItem.couple.user1Id !== userId && existingItem.couple.user2Id !== userId) {
      return NextResponse.json({ error: 'Bạn không có quyền chỉnh sửa item này' }, { status: 403 })
    }

    const updatedItem = await prisma.bucketListItem.update({
      where: { id: itemId },
      data: {
        title: title || existingItem.title,
        description: description !== undefined ? description : existingItem.description,
        category: category || existingItem.category,
        priority: priority || existingItem.priority,
        isCompleted: isCompleted !== undefined ? isCompleted : existingItem.isCompleted,
        completedAt: isCompleted && !existingItem.isCompleted ? new Date() : 
                    !isCompleted && existingItem.isCompleted ? null : existingItem.completedAt,
        proofImages: proofImages !== undefined ? proofImages : existingItem.proofImages,
        notes: notes !== undefined ? notes : existingItem.notes
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
        },
        createdBy: {
          select: { id: true, name: true, avatar: true }
        }
      }
    })

    return NextResponse.json({ message: 'Item updated successfully', item: updatedItem })
  } catch (error) {
    console.error('Error updating bucket list item:', error)
    return NextResponse.json({ error: 'Failed to update bucket list item' }, { status: 500 })
  }
}

// DELETE /api/bucket-list - Delete bucket list item
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const itemId = searchParams.get('itemId')
    const userId = searchParams.get('userId')

    if (!itemId || !userId) {
      return NextResponse.json({ error: 'Item ID and User ID are required' }, { status: 400 })
    }

    // Find item and verify user has access
    const existingItem = await prisma.bucketListItem.findUnique({
      where: { id: itemId },
      include: {
        couple: true
      }
    })

    if (!existingItem) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }

    // Check if user is part of the couple
    if (existingItem.couple.user1Id !== userId && existingItem.couple.user2Id !== userId) {
      return NextResponse.json({ error: 'Bạn không có quyền xóa item này' }, { status: 403 })
    }

    await prisma.bucketListItem.delete({
      where: { id: itemId }
    })

    return NextResponse.json({ message: 'Item deleted successfully' })
  } catch (error) {
    console.error('Error deleting bucket list item:', error)
    return NextResponse.json({ error: 'Failed to delete bucket list item' }, { status: 500 })
  }
}
