#!/usr/bin/env node
/**
 * Database Connection Test Script
 * 
 * This script tests the database connection and verifies that
 * the College Reclaim database schema is correctly initialized.
 * 
 * Usage:
 *   node scripts/test-database.js
 * 
 * Prerequisites:
 *   - DATABASE_URL must be set in .env or .env.local
 *   - Prisma client must be generated (npx prisma generate)
 *   - Database schema must be pushed (npx prisma db push)
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testDatabaseConnection() {
  console.log('🔍 Testing College Reclaim Database Connection...\n');

  try {
    // Test 1: Database Connection
    console.log('1️⃣  Testing database connection...');
    await prisma.$connect();
    console.log('   ✅ Successfully connected to database\n');

    // Test 2: Check Tables
    console.log('2️⃣  Verifying database tables...');
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `;
    console.log('   ✅ Found tables:', tables.length || 'SQLite database');
    
    // Test 3: User Table
    console.log('\n3️⃣  Testing User table...');
    const userCount = await prisma.user.count();
    console.log(`   ✅ Users table accessible (${userCount} users)`);

    // Test 4: Lost Items Table
    console.log('\n4️⃣  Testing LostItem table...');
    const lostItemCount = await prisma.lostItem.count();
    console.log(`   ✅ LostItems table accessible (${lostItemCount} items)`);

    // Test 5: Found Items Table
    console.log('\n5️⃣  Testing FoundItem table...');
    const foundItemCount = await prisma.foundItem.count();
    console.log(`   ✅ FoundItems table accessible (${foundItemCount} items)`);

    // Test 6: Matches Table
    console.log('\n6️⃣  Testing Match table...');
    const matchCount = await prisma.match.count();
    console.log(`   ✅ Matches table accessible (${matchCount} matches)`);

    // Test 7: Notifications Table
    console.log('\n7️⃣  Testing Notification table...');
    const notificationCount = await prisma.notification.count();
    console.log(`   ✅ Notifications table accessible (${notificationCount} notifications)`);

    // Test 8: CRUD Operations (Create, Read, Update, Delete)
    console.log('\n8️⃣  Testing CRUD operations...');
    
    // Create a test user
    const testUser = await prisma.user.create({
      data: {
        email: `test_${Date.now()}@college.edu`,
        name: 'Test User',
        password: 'hashed_password_here',
        role: 'STUDENT',
      },
    });
    console.log('   ✅ CREATE: Test user created');

    // Read the user
    const readUser = await prisma.user.findUnique({
      where: { id: testUser.id },
    });
    console.log('   ✅ READ: Test user retrieved');

    // Update the user
    const updatedUser = await prisma.user.update({
      where: { id: testUser.id },
      data: { college: 'Test College' },
    });
    console.log('   ✅ UPDATE: Test user updated');

    // Delete the user
    await prisma.user.delete({
      where: { id: testUser.id },
    });
    console.log('   ✅ DELETE: Test user deleted');

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('🎉 DATABASE CONNECTION TEST: SUCCESS');
    console.log('='.repeat(60));
    console.log('\n✅ Database is properly configured and ready for use!');
    console.log('✅ All CRUD operations are working correctly');
    console.log('✅ All tables are accessible\n');
    
    console.log('📊 Database Statistics:');
    console.log(`   - Users: ${userCount}`);
    console.log(`   - Lost Items: ${lostItemCount}`);
    console.log(`   - Found Items: ${foundItemCount}`);
    console.log(`   - Matches: ${matchCount}`);
    console.log(`   - Notifications: ${notificationCount}`);
    
    console.log('\n🚀 Your College Reclaim database is ready for production!\n');

  } catch (error) {
    console.error('\n❌ DATABASE CONNECTION TEST: FAILED\n');
    console.error('Error details:', error);
    console.error('\n💡 Troubleshooting:');
    console.error('   1. Check if DATABASE_URL is set in .env or .env.local');
    console.error('   2. Verify database server is running');
    console.error('   3. Run: npx prisma generate');
    console.error('   4. Run: npx prisma db push');
    console.error('   5. Check database credentials and connection string\n');
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testDatabaseConnection();
