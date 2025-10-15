import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/places - Fetch all places for a couple
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const coupleId = searchParams.get('coupleId')

    if (!coupleId) {
      return NextResponse.json({ error: 'Couple ID is required' }, { status: 400 })
    }

    const places = await prisma.place.findMany({
      where: {
        coupleId: coupleId
      },
      orderBy: {
        visitDate: 'desc'
      }
    })

    // Transform to match Memory interface
    const memories = places.map(place => ({
      id: place.id,
      title: place.name,
      description: place.description || place.memories || '',
      location: {
        name: place.address || place.name,
        coordinates: [place.latitude, place.longitude] as [number, number]
      },
      date: place.visitDate?.toISOString() || place.createdAt.toISOString(),
      type: getMemoryType(place.name),
      photos: place.images ? place.images.split(',') : [],
      mood: getMoodFromRating(place.rating),
      rating: place.rating
    }))

    return NextResponse.json({ memories })
  } catch (error) {
    console.error('Error fetching places:', error)
    return NextResponse.json({ error: 'Failed to fetch places' }, { status: 500 })
  }
}

// POST /api/places - Create new place/memory
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      coupleId, 
      name, 
      description, 
      latitude, 
      longitude, 
      address, 
      visitDate, 
      memories, 
      rating,
      images 
    } = body

    if (!coupleId || !name || !latitude || !longitude) {
      return NextResponse.json({ 
        error: 'Couple ID, name, latitude, and longitude are required' 
      }, { status: 400 })
    }

    const newPlace = await prisma.place.create({
      data: {
        coupleId,
        name,
        description,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        address,
        visitDate: visitDate ? new Date(visitDate) : new Date(),
        memories,
        rating: rating ? parseInt(rating) : null,
        images: images ? images.join(',') : null
      }
    })

    // Transform to Memory format
    const memory = {
      id: newPlace.id,
      title: newPlace.name,
      description: newPlace.description || newPlace.memories || '',
      location: {
        name: newPlace.address || newPlace.name,
        coordinates: [newPlace.latitude, newPlace.longitude] as [number, number]
      },
      date: newPlace.visitDate?.toISOString() || newPlace.createdAt.toISOString(),
      type: getMemoryType(newPlace.name),
      photos: newPlace.images ? newPlace.images.split(',') : [],
      mood: getMoodFromRating(newPlace.rating),
      rating: newPlace.rating
    }

    return NextResponse.json({ memory }, { status: 201 })
  } catch (error) {
    console.error('Error creating place:', error)
    return NextResponse.json({ error: 'Failed to create place' }, { status: 500 })
  }
}

// Helper functions
function getMemoryType(placeName: string): string {
  const name = placeName.toLowerCase()
  
  if (name.includes('cafe') || name.includes('coffee') || name.includes('gặp')) {
    return 'first_date'
  }
  if (name.includes('restaurant') || name.includes('nhà hàng')) {
    return 'restaurant'
  }
  if (name.includes('du lịch') || name.includes('hồ') || name.includes('đà lạt')) {
    return 'travel'
  }
  if (name.includes('nhà') || name.includes('home')) {
    return 'home'
  }
  if (name.includes('kỷ niệm') || name.includes('anniversary')) {
    return 'anniversary'
  }
  
  return 'special'
}

function getMoodFromRating(rating: number | null): string {
  if (!rating) return '😊'
  
  if (rating >= 5) return '😍'
  if (rating >= 4) return '😊'
  if (rating >= 3) return '🙂'
  if (rating >= 2) return '😐'
  return '😔'
}
