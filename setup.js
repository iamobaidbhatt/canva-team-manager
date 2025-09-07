#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Setting up Canva Pro Team Manager...\n');

// Create .env file if it doesn't exist
const envPath = path.join(__dirname, 'server', '.env');
if (!fs.existsSync(envPath)) {
  const envContent = `PORT=5000
JWT_SECRET=${generateRandomSecret()}
NODE_ENV=development`;
  
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created server/.env file with random JWT secret');
}

// Install dependencies
console.log('📦 Installing dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Root dependencies installed');
  
  execSync('cd server && npm install', { stdio: 'inherit' });
  console.log('✅ Server dependencies installed');
  
  execSync('cd client && npm install', { stdio: 'inherit' });
  console.log('✅ Client dependencies installed');
} catch (error) {
  console.error('❌ Error installing dependencies:', error.message);
  process.exit(1);
}

console.log('\n🎉 Setup complete!');
console.log('\n📋 Next steps:');
console.log('1. Run: npm run dev');
console.log('2. Open: http://localhost:3000');
console.log('3. Admin login: http://localhost:3000/admin/login');
console.log('   - Username: admin');
console.log('   - Password: admin123');
console.log('   - ⚠️  Please change these credentials after first login!');
console.log('\n🔗 Add your Canva Pro team invite links in the admin panel');

function generateRandomSecret() {
  return require('crypto').randomBytes(32).toString('hex');
}
