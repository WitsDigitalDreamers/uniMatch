#!/usr/bin/env node

/**
 * UniMatch Database Setup Script
 * This script helps set up the database and test the connection
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function setupDatabase() {
  console.log('🚀 UniMatch Database Setup');
  console.log('==========================\n');

  try {
    // Check if .env.local exists
    const envPath = path.join(__dirname, '..', '.env.local');
    const envExists = fs.existsSync(envPath);

    if (!envExists) {
      console.log('❌ .env.local not found. Please run the Supabase setup first:');
      console.log('   npm run setup:supabase\n');
      process.exit(1);
    }

    // Read environment variables
    const envContent = fs.readFileSync(envPath, 'utf8');
    const supabaseUrl = envContent.match(/VITE_SUPABASE_URL=(.+)/)?.[1];
    const supabaseKey = envContent.match(/VITE_SUPABASE_ANON_KEY=(.+)/)?.[1];

    if (!supabaseUrl || !supabaseKey) {
      console.log('❌ Missing Supabase configuration in .env.local');
      process.exit(1);
    }

    console.log('✅ Environment configuration found');
    console.log(`   Supabase URL: ${supabaseUrl}`);
    console.log(`   Supabase Key: ${supabaseKey.substring(0, 20)}...\n`);

    console.log('📋 Next steps:');
    console.log('   1. Make sure your Supabase project is running');
    console.log('   2. Run the schema migration:');
    console.log('      npm run migrate');
    console.log('   3. Test the connection:');
    console.log('      npm run test:db');
    console.log('   4. Start the development server:');
    console.log('      npm run dev\n');

    console.log('🎉 Setup complete!');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Run setup
setupDatabase();
