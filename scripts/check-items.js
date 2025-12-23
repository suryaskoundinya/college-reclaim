const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkItems() {
  try {
    const lostCount = await prisma.lostItem.count();
    const foundCount = await prisma.foundItem.count();
    
    console.log('\n=== Database Item Count ===');
    console.log('Lost items:', lostCount);
    console.log('Found items:', foundCount);
    console.log('Total items:', lostCount + foundCount);
    
    if (lostCount > 0) {
      console.log('\n=== Sample Lost Items ===');
      const lostItems = await prisma.lostItem.findMany({
        take: 3,
        select: {
          id: true,
          title: true,
          status: true,
          createdAt: true
        }
      });
      console.table(lostItems);
    }
    
    if (foundCount > 0) {
      console.log('\n=== Sample Found Items ===');
      const foundItems = await prisma.foundItem.findMany({
        take: 3,
        select: {
          id: true,
          title: true,
          status: true,
          createdAt: true
        }
      });
      console.table(foundItems);
    }
  } catch (error) {
    console.error('Error checking items:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkItems();
