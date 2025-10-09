#!/bin/bash

# Production Database Setup Script for College Reclaim
# Run this after setting up Vercel Postgres

echo "🔄 Setting up production database..."

# Generate Prisma client
echo "📦 Generating Prisma client..."
npx prisma generate

# Run database migrations
echo "🏗️  Running database migrations..."
npx prisma db push

# Seed database with initial data (optional)
echo "🌱 Seeding database with initial admin user..."
node -e "
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function seed() {
  const prisma = new PrismaClient();
  
  try {
    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    const admin = await prisma.user.upsert({
      where: { email: 'admin@college.edu' },
      update: {},
      create: {
        email: 'admin@college.edu',
        name: 'System Administrator',
        password: hashedPassword,
        role: 'ADMIN',
        college: 'College University',
        emailVerified: new Date(),
      },
    });
    
    console.log('✅ Admin user created:', admin.email);
    console.log('📧 Login with: admin@college.edu / admin123');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await prisma.\$disconnect();
  }
}

seed();
"

echo "🎉 Database setup complete!"
echo "🔗 Your app is ready at: https://collegereclaimprod-9qu57g0r9-surya-s-koundinyas-projects.vercel.app"