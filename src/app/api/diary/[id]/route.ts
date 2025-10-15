import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/diary/[id] - Fetch single diary entry
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const entryId = params.id

    if (!userId || !entryId) {
      return NextResponse.json({ error: 'User ID and Entry ID are required' }, { status: 400 })
    }

    // Find entry and verify user has access
    const entry = await prisma.diaryEntry.findUnique({
      where: { id: entryId },
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

    if (!entry) {
      return NextResponse.json({ error: 'Diary entry not found' }, { status: 404 })
    }

    // Check if user is part of the couple
    if (entry.couple.user1Id !== userId && entry.couple.user2Id !== userId) {
      return NextResponse.json({ error: 'Bạn không có quyền xem diary này' }, { status: 403 })
    }

    return NextResponse.json({ entry })
  } catch (error) {
    console.error('Error fetching diary entry:', error)
    return NextResponse.json({ error: 'Failed to fetch diary entry' }, { status: 500 })
  }
}
