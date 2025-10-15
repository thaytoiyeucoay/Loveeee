import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/events - Fetch all events for user's couple
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
      return NextResponse.json({ events: [] })
    }

    const events = await prisma.event.findMany({
      where: {
        coupleId: couple.id
      },
      orderBy: {
        startDate: 'asc'
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

    return NextResponse.json({ events })
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
  }
}

// POST /api/events - Create new event
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, title, description, eventDate, eventTime, location, category, isRecurring, reminderBefore } = body

    if (!userId || !title || !eventDate) {
      return NextResponse.json({ error: 'User ID, title and event date are required' }, { status: 400 })
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
        error: 'Bạn chưa có couple. Vui lòng thiết lập couple trước khi tạo sự kiện.' 
      }, { status: 400 })
    }

    // Combine date and time with proper timezone handling
    let eventDateTime = new Date(eventDate + 'T00:00:00') // Force local timezone
    if (eventTime) {
      const [hours, minutes] = eventTime.split(':').map(Number)
      eventDateTime.setHours(hours, minutes, 0, 0)
    } else {
      // If no time specified, set to noon to avoid timezone edge cases
      eventDateTime.setHours(12, 0, 0, 0)
    }

    const newEvent = await prisma.event.create({
      data: {
        coupleId: couple.id,
        title,
        description: description || '',
        startDate: eventDateTime,
        location: location || '',
        type: category || 'other',
        isRecurring: isRecurring || false,
        reminder: reminderBefore ? new Date(eventDateTime.getTime() - reminderBefore * 60000) : null
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

    return NextResponse.json({ 
      message: 'Sự kiện đã được tạo thành công!',
      event: newEvent 
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating event:', error)
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 })
  }
}

// PUT /api/events - Update event
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { eventId, userId, title, description, eventDate, eventTime, location, category, isRecurring, reminderBefore } = body

    if (!eventId || !userId) {
      return NextResponse.json({ error: 'Event ID and User ID are required' }, { status: 400 })
    }

    // Find event and verify user has access
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        couple: true
      }
    })

    if (!event) {
      return NextResponse.json({ error: 'Không tìm thấy sự kiện' }, { status: 404 })
    }

    // Check if user is part of the couple
    if (event.couple.user1Id !== userId && event.couple.user2Id !== userId) {
      return NextResponse.json({ error: 'Bạn không có quyền chỉnh sửa sự kiện này' }, { status: 403 })
    }

    // Combine date and time if provided with proper timezone handling
    let eventDateTime = undefined
    if (eventDate) {
      eventDateTime = new Date(eventDate + 'T00:00:00') // Force local timezone
      if (eventTime) {
        const [hours, minutes] = eventTime.split(':').map(Number)
        eventDateTime.setHours(hours, minutes, 0, 0)
      } else {
        // If no time specified, set to noon to avoid timezone edge cases
        eventDateTime.setHours(12, 0, 0, 0)
      }
    }

    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: {
        title: title || event.title,
        description: description !== undefined ? description : event.description,
        startDate: eventDateTime || event.startDate,
        location: location !== undefined ? location : event.location,
        type: category || event.type,
        isRecurring: isRecurring !== undefined ? isRecurring : event.isRecurring,
        reminder: reminderBefore !== undefined ? 
          (reminderBefore ? new Date((eventDateTime || event.startDate).getTime() - reminderBefore * 60000) : null)
          : event.reminder
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

    return NextResponse.json({ 
      message: 'Sự kiện đã được cập nhật thành công!',
      event: updatedEvent 
    })
  } catch (error) {
    console.error('Error updating event:', error)
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 })
  }
}

// DELETE /api/events - Delete event
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const eventId = searchParams.get('eventId')
    const userId = searchParams.get('userId')

    if (!eventId || !userId) {
      return NextResponse.json({ error: 'Event ID and User ID are required' }, { status: 400 })
    }

    // Find event and verify user has access
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        couple: true
      }
    })

    if (!event) {
      return NextResponse.json({ error: 'Không tìm thấy sự kiện' }, { status: 404 })
    }

    // Check if user is part of the couple
    if (event.couple.user1Id !== userId && event.couple.user2Id !== userId) {
      return NextResponse.json({ error: 'Bạn không có quyền xóa sự kiện này' }, { status: 403 })
    }

    await prisma.event.delete({
      where: { id: eventId }
    })

    return NextResponse.json({ message: 'Sự kiện đã được xóa thành công' })
  } catch (error) {
    console.error('Error deleting event:', error)
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 })
  }
}
