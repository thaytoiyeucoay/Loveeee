import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/mood - Fetch all mood entries for user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const days = searchParams.get('days') || '30' // Default 30 days

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Calculate date range
    const daysAgo = new Date()
    daysAgo.setDate(daysAgo.getDate() - parseInt(days))

    const entries = await prisma.moodEntry.findMany({
      where: {
        userId,
        createdAt: {
          gte: daysAgo
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: {
          select: { id: true, name: true, avatar: true }
        }
      }
    })

    return NextResponse.json({ entries })
  } catch (error) {
    console.error('Error fetching mood entries:', error)
    return NextResponse.json({ error: 'Failed to fetch mood entries' }, { status: 500 })
  }
}

// POST /api/mood - Create new mood entry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, mood, intensity, note, date } = body

    if (!userId || !mood || !intensity) {
      return NextResponse.json({ error: 'User ID, mood, and intensity are required' }, { status: 400 })
    }

    // Validate intensity is between 1-10
    if (intensity < 1 || intensity > 10) {
      return NextResponse.json({ error: 'Intensity must be between 1 and 10' }, { status: 400 })
    }

    const newEntry = await prisma.moodEntry.create({
      data: {
        userId,
        mood,
        intensity: parseInt(intensity),
        note: note || null,
        date: date ? new Date(date) : new Date()
      },
      include: {
        user: {
          select: { id: true, name: true, avatar: true }
        }
      }
    })

    return NextResponse.json({ message: 'Mood entry created successfully', entry: newEntry }, { status: 201 })
  } catch (error) {
    console.error('Error creating mood entry:', error)
    return NextResponse.json({ error: 'Failed to create mood entry' }, { status: 500 })
  }
}

// PUT /api/mood - Update mood entry
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { entryId, userId, mood, intensity, note, date } = body

    if (!entryId || !userId) {
      return NextResponse.json({ error: 'Entry ID and User ID are required' }, { status: 400 })
    }

    // Find entry and verify ownership
    const existingEntry = await prisma.moodEntry.findUnique({
      where: { id: entryId }
    })

    if (!existingEntry) {
      return NextResponse.json({ error: 'Mood entry not found' }, { status: 404 })
    }

    if (existingEntry.userId !== userId) {
      return NextResponse.json({ error: 'Bạn không có quyền chỉnh sửa mood entry này' }, { status: 403 })
    }

    const updatedEntry = await prisma.moodEntry.update({
      where: { id: entryId },
      data: {
        mood: mood || existingEntry.mood,
        intensity: intensity ? parseInt(intensity) : existingEntry.intensity,
        note: note !== undefined ? note : existingEntry.note,
        date: date ? new Date(date) : existingEntry.date
      },
      include: {
        user: {
          select: { id: true, name: true, avatar: true }
        }
      }
    })

    return NextResponse.json({ message: 'Mood entry updated successfully', entry: updatedEntry })
  } catch (error) {
    console.error('Error updating mood entry:', error)
    return NextResponse.json({ error: 'Failed to update mood entry' }, { status: 500 })
  }
}

// DELETE /api/mood - Delete mood entry
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const entryId = searchParams.get('entryId')
    const userId = searchParams.get('userId')

    if (!entryId || !userId) {
      return NextResponse.json({ error: 'Entry ID and User ID are required' }, { status: 400 })
    }

    // Find entry and verify ownership
    const existingEntry = await prisma.moodEntry.findUnique({
      where: { id: entryId }
    })

    if (!existingEntry) {
      return NextResponse.json({ error: 'Mood entry not found' }, { status: 404 })
    }

    if (existingEntry.userId !== userId) {
      return NextResponse.json({ error: 'Bạn không có quyền xóa mood entry này' }, { status: 403 })
    }

    await prisma.moodEntry.delete({
      where: { id: entryId }
    })

    return NextResponse.json({ message: 'Mood entry deleted successfully' })
  } catch (error) {
    console.error('Error deleting mood entry:', error)
    return NextResponse.json({ error: 'Failed to delete mood entry' }, { status: 500 })
  }
}
