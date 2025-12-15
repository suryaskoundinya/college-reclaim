const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function seedDummyData() {
  console.log('🌱 Seeding database with dummy items...')

  // Get the first user (you) from the database
  const user = await prisma.user.findFirst()
  
  if (!user) {
    console.error('❌ No user found. Please sign in first.')
    return
  }

  console.log(`✅ Found user: ${user.name || user.email}`)

  // Create dummy lost items
  const lostItems = await Promise.all([
    prisma.lostItem.create({
      data: {
        title: 'Black Leather Wallet',
        description: 'Lost my black leather wallet near the library. Contains ID card and credit cards. Reward if found!',
        category: 'OTHER',
        location: 'Main Library - 2nd Floor',
        dateLost: new Date('2024-12-10'),
        userId: user.id,
        status: 'LOST'
      }
    }),
    prisma.lostItem.create({
      data: {
        title: 'Apple AirPods Pro',
        description: 'White AirPods Pro in charging case. Lost somewhere between the cafeteria and computer lab.',
        category: 'ELECTRONICS',
        location: 'Campus Cafeteria',
        dateLost: new Date('2024-12-11'),
        userId: user.id,
        status: 'LOST'
      }
    }),
    prisma.lostItem.create({
      data: {
        title: 'Blue Backpack',
        description: 'Navy blue JanSport backpack with laptop inside. Has a small JSS keychain attached.',
        category: 'BAGS',
        location: 'Sports Complex',
        dateLost: new Date('2024-12-09'),
        userId: user.id,
        status: 'LOST'
      }
    }),
    prisma.lostItem.create({
      data: {
        title: 'College ID Card',
        description: 'Student ID card with name "Rahul Kumar". Need it urgently for exams.',
        category: 'ID_CARD',
        location: 'Engineering Block - Room 301',
        dateLost: new Date('2024-12-12'),
        userId: user.id,
        status: 'LOST'
      }
    }),
    prisma.lostItem.create({
      data: {
        title: 'Data Structures Textbook',
        description: 'Data Structures and Algorithms textbook by Cormen. Has handwritten notes inside.',
        category: 'BOOK',
        location: 'Central Library Reading Room',
        dateLost: new Date('2024-12-08'),
        userId: user.id,
        status: 'LOST'
      }
    })
  ])

  console.log(`✅ Created ${lostItems.length} lost items`)

  // Create dummy found items
  const foundItems = await Promise.all([
    prisma.foundItem.create({
      data: {
        title: 'Silver Watch',
        description: 'Found a silver wristwatch near the parking lot. Brand: Fastrack. Contact to claim.',
        category: 'ACCESSORIES',
        location: 'Main Parking Lot',
        dateFound: new Date('2024-12-11'),
        userId: user.id,
        status: 'FOUND',
        handedToAdmin: false
      }
    }),
    prisma.foundItem.create({
      data: {
        title: 'Red Umbrella',
        description: 'Found a red umbrella left in the auditorium after yesterday\'s event.',
        category: 'OTHER',
        location: 'Main Auditorium',
        dateFound: new Date('2024-12-10'),
        userId: user.id,
        status: 'FOUND',
        handedToAdmin: true
      }
    }),
    prisma.foundItem.create({
      data: {
        title: 'iPhone 13 Pro',
        description: 'Found an iPhone 13 Pro (blue color) in the washroom. Handed to admin office.',
        category: 'ELECTRONICS',
        location: 'Ground Floor Washroom',
        dateFound: new Date('2024-12-09'),
        userId: user.id,
        status: 'FOUND',
        handedToAdmin: true
      }
    }),
    prisma.foundItem.create({
      data: {
        title: 'Bike Keys',
        description: 'Found bike keys with a green keychain near the canteen.',
        category: 'KEYS',
        location: 'College Canteen',
        dateFound: new Date('2024-12-12'),
        userId: user.id,
        status: 'FOUND',
        handedToAdmin: false
      }
    }),
    prisma.foundItem.create({
      data: {
        title: 'Sports Jersey',
        description: 'Found basketball jersey (number 23) in the sports complex locker room.',
        category: 'CLOTHING',
        location: 'Sports Complex - Locker Room',
        dateFound: new Date('2024-12-11'),
        userId: user.id,
        status: 'FOUND',
        handedToAdmin: false
      }
    })
  ])

  console.log(`✅ Created ${foundItems.length} found items`)

  // Create some books
  const books = await Promise.all([
    prisma.book.create({
      data: {
        title: 'Introduction to Algorithms (CLRS)',
        author: 'Cormen, Leiserson, Rivest, Stein',
        description: 'Classic algorithms textbook. Used for one semester, in excellent condition.',
        condition: 'LIKE_NEW',
        priceOrRent: 800,
        type: 'SELL',
        available: true,
        ownerUserId: user.id
      }
    }),
    prisma.book.create({
      data: {
        title: 'Database Management Systems',
        author: 'Raghu Ramakrishnan',
        description: 'DBMS textbook for rent. Available for this semester.',
        condition: 'GOOD',
        priceOrRent: 50,
        type: 'RENT',
        available: true,
        ownerUserId: user.id
      }
    }),
    prisma.book.create({
      data: {
        title: 'Operating System Concepts',
        author: 'Silberschatz, Galvin, Gagne',
        description: 'OS textbook. Some highlighting but all pages intact.',
        condition: 'GOOD',
        priceOrRent: 600,
        type: 'SELL',
        available: true,
        ownerUserId: user.id
      }
    })
  ])

  console.log(`✅ Created ${books.length} books`)

  // Create some events
  const events = await Promise.all([
    prisma.event.create({
      data: {
        title: 'Tech Fest 2024',
        description: 'Annual technical festival with coding competitions, hackathons, and tech talks.',
        date: new Date('2024-12-20'),
        time: '9:00 AM',
        venue: 'Main Auditorium',
        clubOrDept: 'Computer Science Department',
        postedByUserId: user.id,
        contactInfo: 'techfest@college.edu'
      }
    }),
    prisma.event.create({
      data: {
        title: 'Career Counseling Session',
        description: 'Industry experts will guide students about career opportunities in software development.',
        date: new Date('2024-12-18'),
        time: '2:00 PM',
        venue: 'Seminar Hall - Block A',
        clubOrDept: 'Placement Cell',
        postedByUserId: user.id,
        contactInfo: 'placement@college.edu'
      }
    }),
    prisma.event.create({
      data: {
        title: 'Basketball Tournament',
        description: 'Inter-department basketball championship. Register your team now!',
        date: new Date('2024-12-22'),
        time: '4:00 PM',
        venue: 'Sports Complex',
        clubOrDept: 'Sports Club',
        postedByUserId: user.id,
        contactInfo: 'sports@college.edu'
      }
    })
  ])

  console.log(`✅ Created ${events.length} events`)

  console.log('\n✅ Database seeded successfully!')
  console.log(`📊 Summary:`)
  console.log(`   - ${lostItems.length} Lost Items`)
  console.log(`   - ${foundItems.length} Found Items`)
  console.log(`   - ${books.length} Books`)
  console.log(`   - ${events.length} Events`)
}

seedDummyData()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
