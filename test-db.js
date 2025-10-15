const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testConnection() {
  try {
    console.log('🔍 Testing database connection...')
    
    // Test connection
    await prisma.$connect()
    console.log('✅ Database connected successfully!')
    
    // Count existing records
    const userCount = await prisma.user.count()
    const coupleCount = await prisma.couple.count()
    const messageCount = await prisma.loveMessage.count()
    
    console.log(`👥 Users: ${userCount}`)
    console.log(`💑 Couples: ${coupleCount}`) 
    console.log(`💕 Love Messages: ${messageCount}`)
    
    if (userCount === 0) {
      console.log('🌱 Database is empty, creating demo data...')
      
      // Create demo user
      const user1 = await prisma.user.create({
        data: {
          email: 'demo@loveeee.app',
          name: 'Demo User',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
        }
      })
      
      console.log(`✅ Created demo user: ${user1.name} (${user1.email})`)
    }
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()
