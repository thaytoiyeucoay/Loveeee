import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create demo users
  const user1 = await prisma.user.upsert({
    where: { email: 'anh@loveeee.app' },
    update: {},
    create: {
      email: 'anh@loveeee.app',
      name: 'Anh Yêu',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      phone: '0901234567',
      birthday: new Date('1995-06-15'),
    },
  })

  const user2 = await prisma.user.upsert({
    where: { email: 'em@loveeee.app' },
    update: {},
    create: {
      email: 'em@loveeee.app',
      name: 'Em Thương',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      phone: '0912345678',
      birthday: new Date('1997-03-20'),
    },
  })

  // Create couple relationship
  const couple = await prisma.couple.upsert({
    where: { user1Id: user1.id },
    update: {},
    create: {
      user1Id: user1.id,
      user2Id: user2.id,
      relationshipStart: new Date('2023-02-14'),
      anniversaryDate: new Date('2024-02-14'),
      coupleGoals: 'Xây dựng một mối quan hệ hạnh phúc và bền vững ❤️',
    },
  })

  // Seed Love Messages
  const loveMessages = [
    {
      message: 'Chào buổi sáng người yêu! Hôm nay cũng yêu em rất nhiều ❤️',
      type: 'daily',
      sentDate: new Date('2024-01-15T07:00:00Z'),
    },
    {
      message: 'Happy 1 year anniversary my love! 🎉💕',
      type: 'anniversary',
      sentDate: new Date('2024-02-14T00:00:00Z'),
    },
    {
      message: 'Em có khỏe không? Anh nhớ em lắm rồi 🥰',
      type: 'daily',
      sentDate: new Date('2024-03-10T14:30:00Z'),
    },
  ]

  for (const msg of loveMessages) {
    await prisma.loveMessage.create({
      data: {
        coupleId: couple.id,
        ...msg,
      },
    })
  }

  // Seed Diary Entries
  const diaryEntries = [
    {
      title: 'Ngày đầu tiên gặp nhau',
      content: 'Hôm nay là ngày đặc biệt, lần đầu tiên anh gặp em tại quán cafe. Tim anh đập thật nhanh khi nhìn thấy nụ cười của em. Hy vọng đây sẽ là khởi đầu cho một câu chuyện tình yêu đẹp.',
      mood: 'excited',
      tags: 'first-meeting,cafe,nervous,happy',
      authorId: user1.id,
      createdAt: new Date('2023-02-14T18:00:00Z'),
    },
    {
      title: 'Chuyến du lịch Đà Lạt',
      content: 'Chuyến đi Đà Lạt cùng em thật tuyệt vời! Chúng ta đã đi thăm nhiều nơi đẹp, chụp ảnh cùng nhau và thưởng thức những món ăn ngon. Đặc biệt là khoảnh khắc ngắm hoàng hôn trên hồ Xuân Hương.',
      mood: 'romantic',
      tags: 'travel,dalat,romantic,memories',
      authorId: user2.id,
      images: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96,https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
      createdAt: new Date('2023-06-10T20:00:00Z'),
    },
  ]

  for (const entry of diaryEntries) {
    await prisma.diaryEntry.create({
      data: {
        coupleId: couple.id,
        ...entry,
      },
    })
  }

  // Seed Places (Memory Map)
  const places = [
    {
      name: 'Cafe The Coffee House - Nguyễn Huệ',
      description: 'Nơi chúng ta gặp nhau lần đầu tiên',
      latitude: 10.7741,
      longitude: 106.7010,
      address: 'Đường Nguyễn Huệ, Quận 1, TP.HCM',
      visitDate: new Date('2023-02-14'),
      memories: 'Lần đầu gặp mặt, cả hai đều rất nervous nhưng rất vui',
      rating: 5,
    },
    {
      name: 'Hồ Xuân Hương, Đà Lạt',
      description: 'Chuyến du lịch lãng mạn',
      latitude: 11.9404,
      longitude: 108.4583,
      address: 'Phường 5, Thành phố Đà Lạt, Lâm Đồng',
      visitDate: new Date('2023-06-10'),
      memories: 'Ngắm hoàng hôn cùng nhau, rất lãng mạn',
      rating: 5,
    },
    {
      name: 'Shri Restaurant & Lounge',
      description: 'Kỷ niệm 6 tháng yêu nhau',
      latitude: 10.7829,
      longitude: 106.6953,
      address: '72-74 Đồng Khởi, Quận 1, TP.HCM',
      visitDate: new Date('2023-08-14'),
      memories: 'Bữa tối kỷ niệm 6 tháng, món ăn ngon và không khí lãng mạn',
      rating: 4,
    },
    {
      name: 'Nhà của anh',
      description: 'Nơi chúng ta thường gặp nhau',
      latitude: 10.7320,
      longitude: 106.7190,
      address: 'Quận 7, TP. Hồ Chí Minh',
      visitDate: new Date('2023-03-01'),
      memories: 'Nấu ăn cùng nhau, xem phim và trò chuyện',
      rating: 5,
    },
    {
      name: 'Phở Hòa Pasteur',
      description: 'Quán ăn yêu thích của chúng ta',
      latitude: 10.7692,
      longitude: 106.6957,
      address: 'Pasteur, Quận 1, TP.HCM',
      visitDate: new Date('2023-04-20'),
      memories: 'Tô phở ngon nhất Sài Gòn, chúng ta hay đến đây',
      rating: 4,
    },
  ]

  for (const place of places) {
    await prisma.place.create({
      data: {
        coupleId: couple.id,
        ...place,
      },
    })
  }

  // Seed Bucket List Items
  const bucketListItems = [
    {
      title: 'Du lịch Nhật Bản',
      description: 'Đi du lịch Nhật Bản vào mùa anh đào',
      category: 'travel',
      priority: 'high',
      createdById: user1.id,
    },
    {
      title: 'Học nấu ăn cùng nhau',
      description: 'Tham gia lớp học nấu ăn để có thể nấu những món ngon cho nhau',
      category: 'experience',
      priority: 'medium',
      createdById: user2.id,
    },
    {
      title: 'Chạy marathon cùng nhau',
      description: 'Hoàn thành cuộc đua marathon 21km',
      category: 'adventure',
      priority: 'medium',
      isCompleted: true,
      completedAt: new Date('2023-11-15'),
      createdById: user1.id,
    },
  ]

  for (const item of bucketListItems) {
    await prisma.bucketListItem.create({
      data: {
        coupleId: couple.id,
        ...item,
      },
    })
  }

  // Seed Events
  const events = [
    {
      title: 'Kỷ niệm 2 năm yêu nhau',
      description: 'Đi ăn tối lãng mạn và tặng quà cho nhau',
      startDate: new Date('2025-02-14T18:00:00Z'),
      endDate: new Date('2025-02-14T22:00:00Z'),
      location: 'Nhà hàng cao cấp',
      type: 'anniversary',
      reminder: new Date('2025-02-13T09:00:00Z'),
      isRecurring: true,
    },
    {
      title: 'Sinh nhật em yêu',
      description: 'Tổ chức tiệc sinh nhật bất ngờ',
      startDate: new Date('2025-03-20T19:00:00Z'),
      location: 'Tại nhà',
      type: 'birthday',
      reminder: new Date('2025-03-19T09:00:00Z'),
    },
  ]

  for (const event of events) {
    await prisma.event.create({
      data: {
        coupleId: couple.id,
        ...event,
      },
    })
  }

  // Seed Expenses
  const expenses = [
    {
      title: 'Bữa tối romantic',
      amount: 850000,
      category: 'food',
      description: 'Nhà hàng Shri - Kỷ niệm 6 tháng',
      date: new Date('2023-08-14'),
      paidById: user1.id,
    },
    {
      title: 'Vé máy bay Đà Lạt',
      amount: 1200000,
      category: 'travel',
      description: 'Chuyến du lịch Đà Lạt 3 ngày 2 đêm',
      date: new Date('2023-06-08'),
      paidById: user2.id,
    },
    {
      title: 'Quà sinh nhật anh',
      amount: 500000,
      category: 'gifts',
      description: 'Đồng hồ đeo tay',
      date: new Date('2023-06-15'),
      paidById: user2.id,
    },
  ]

  for (const expense of expenses) {
    await prisma.expense.create({
      data: {
        coupleId: couple.id,
        ...expense,
      },
    })
  }

  // Seed Mood Entries
  const moods = ['happy', 'excited', 'love', 'grateful', 'peaceful']
  const moodEntries = []

  for (let i = 0; i < 30; i++) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    
    moodEntries.push({
      userId: Math.random() > 0.5 ? user1.id : user2.id,
      mood: moods[Math.floor(Math.random() * moods.length)],
      intensity: Math.floor(Math.random() * 5) + 6, // 6-10 (mostly positive)
      note: i % 5 === 0 ? 'Hôm nay là một ngày tuyệt vời!' : null,
      date: date,
    })
  }

  for (const mood of moodEntries) {
    await prisma.moodEntry.create({
      data: mood,
    })
  }

  console.log('✅ Database seeded successfully!')
  console.log(`📧 User 1: ${user1.email} (${user1.name})`)
  console.log(`📧 User 2: ${user2.email} (${user2.name})`)
  console.log(`💑 Couple ID: ${couple.id}`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
