// Test script to verify database connection and functionality
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testDatabase() {
  try {
    console.log('🔍 Testing database connection...')
    
    // Test connection
    await prisma.$connect()
    console.log('✅ Database connected successfully!')
    
    // Test creating a user
    console.log('🧪 Testing user creation...')
    const testUser = await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'test@example.com',
        college: 'Test College',
        role: 'STUDENT'
      }
    })
    console.log('✅ User created:', testUser)
    
    // Test creating a lost item
    console.log('🧪 Testing lost item creation...')
    const lostItem = await prisma.lostItem.create({
      data: {
        title: 'Test Lost Wallet',
        description: 'A black leather wallet lost in the library',
        category: 'OTHER',
        location: 'Main Library',
        dateLost: new Date(),
        userId: testUser.id,
      }
    })
    console.log('✅ Lost item created:', lostItem)
    
    // Test creating a found item
    console.log('🧪 Testing found item creation...')
    const foundItem = await prisma.foundItem.create({
      data: {
        title: 'Found Wallet',
        description: 'Found a black wallet near the library entrance',
        category: 'OTHER',
        location: 'Library Entrance',
        dateFound: new Date(),
        userId: testUser.id,
      }
    })
    console.log('✅ Found item created:', foundItem)
    
    // Test creating a notification
    console.log('🧪 Testing notification creation...')
    const notification = await prisma.notification.create({
      data: {
        title: 'Welcome!',
        message: 'Welcome to College Reclaim!',
        type: 'INFO',
        userId: testUser.id,
      }
    })
    console.log('✅ Notification created:', notification)
    
    // Test fetching data
    console.log('🧪 Testing data retrieval...')
    const users = await prisma.user.findMany({
      include: {
        lostItems: true,
        foundItems: true,
        notifications: true,
      }
    })
    console.log('✅ Users fetched:', users.length, 'users')
    
    console.log('🎉 All database tests passed!')
    
  } catch (error) {
    console.error('❌ Database test failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testDatabase()