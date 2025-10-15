import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/diary - Fetch all diary entries for user's couple
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
      return NextResponse.json({ entries: [] })
    }

    const entries = await prisma.diaryEntry.findMany({
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
        author: {
          select: { id: true, name: true, avatar: true }
        }
      }
    })


    return NextResponse.json({ entries })
  } catch (error) {
    console.error('Error fetching diary entries:', error)
    return NextResponse.json({ error: 'Failed to fetch diary entries' }, { status: 500 })
  }
}

// POST /api/diary - Create new diary entry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, title, content, mood, images, videos, entryDate } = body

    if (!userId || !title || !content) {
      return NextResponse.json({ error: 'User ID, title and content are required' }, { status: 400 })
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
        error: 'Bạn chưa có couple. Vui lòng thiết lập couple trước khi tạo diary.' 
      }, { status: 400 })
    }


    const newEntry = await prisma.diaryEntry.create({
      data: {
        coupleId: couple.id,
        authorId: userId,
        title,
        content,
        entryDate: entryDate ? new Date(entryDate) : new Date(),
        mood: mood || null,
        images: images ? images.join('|||') : null, // Use ||| as separator (base64 never contains this)
        videos: videos ? videos.join(',') : null
      } as any, // IDE type cache issue - will resolve after TS server restart
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

    return NextResponse.json({ 
      message: 'Diary entry đã được tạo thành công!',
      entry: newEntry 
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating diary entry:', error)
    return NextResponse.json({ error: 'Failed to create diary entry' }, { status: 500 })
  }
}

// PUT /api/diary - Update diary entry
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { entryId, userId, title, content, mood, images, videos, entryDate } = body

    if (!entryId || !userId) {
      return NextResponse.json({ error: 'Entry ID and User ID are required' }, { status: 400 })
    }

    // Find entry and verify user has access
    const entry = await prisma.diaryEntry.findUnique({
      where: { id: entryId },
      include: {
        couple: true
      }
    })

    if (!entry) {
      return NextResponse.json({ error: 'Không tìm thấy diary entry' }, { status: 404 })
    }

    // Check if user is part of the couple
    if (entry.couple.user1Id !== userId && entry.couple.user2Id !== userId) {
      return NextResponse.json({ error: 'Bạn không có quyền chỉnh sửa diary này' }, { status: 403 })
    }

    const updatedEntry = await prisma.diaryEntry.update({
      where: { id: entryId },
      data: {
        title: title || entry.title,
        content: content || entry.content,
        entryDate: entryDate ? new Date(entryDate) : (entry as any).entryDate,
        mood: mood !== undefined ? mood : entry.mood,
        images: images ? images.join('|||') : entry.images, // Use ||| separator
        videos: videos ? videos.join(',') : entry.videos
      } as any, // IDE type cache issue - will resolve after TS server restart  
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

    return NextResponse.json({ 
      message: 'Diary entry đã được cập nhật thành công!',
      entry: updatedEntry 
    })
  } catch (error) {
    console.error('Error updating diary entry:', error)
    return NextResponse.json({ error: 'Failed to update diary entry' }, { status: 500 })
  }
}

// DELETE /api/diary - Delete diary entry
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const entryId = searchParams.get('entryId')
    const userId = searchParams.get('userId')

    if (!entryId || !userId) {
      return NextResponse.json({ error: 'Entry ID and User ID are required' }, { status: 400 })
    }

    // Find entry and verify user has access
    const entry = await prisma.diaryEntry.findUnique({
      where: { id: entryId },
      include: {
        couple: true
      }
    })

    if (!entry) {
      return NextResponse.json({ error: 'Không tìm thấy diary entry' }, { status: 404 })
    }

    // Check if user is part of the couple
    if (entry.couple.user1Id !== userId && entry.couple.user2Id !== userId) {
      return NextResponse.json({ error: 'Bạn không có quyền xóa diary này' }, { status: 403 })
    }

    await prisma.diaryEntry.delete({
      where: { id: entryId }
    })

    return NextResponse.json({ message: 'Diary entry đã được xóa thành công' })
  } catch (error) {
    console.error('Error deleting diary entry:', error)
    return NextResponse.json({ error: 'Failed to delete diary entry' }, { status: 500 })
  }
}
