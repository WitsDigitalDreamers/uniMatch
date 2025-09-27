#!/usr/bin/env node

/**
 * UniMatch Supabase Setup Script
 * This script helps set up the Supabase configuration for the frontend
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

async function setupSupabase() {
  console.log('🚀 UniMatch Supabase Setup');
  console.log('========================\n');

  try {
    // Check if .env.local already exists
    const envPath = path.join(__dirname, '..', '.env.local');
    const envExists = fs.existsSync(envPath);

    if (envExists) {
      const overwrite = await question('⚠️  .env.local already exists. Overwrite? (y/N): ');
      if (overwrite.toLowerCase() !== 'y' && overwrite.toLowerCase() !== 'yes') {
        console.log('❌ Setup cancelled.');
        process.exit(0);
      }
    }

    console.log('\n📋 Please provide your Supabase configuration:');
    console.log('   (You can find these in your Supabase dashboard > Settings > API)\n');

    const supabaseUrl = await question('🔗 Supabase URL: ');
    const supabaseKey = await question('🔑 Supabase Anon Key: ');

    if (!supabaseUrl || !supabaseKey) {
      console.log('❌ Both URL and Key are required!');
      process.exit(1);
    }

    // Validate URL format
    if (!supabaseUrl.includes('supabase.co')) {
      console.log('⚠️  Warning: The URL doesn\'t look like a valid Supabase URL');
    }

    // Create .env.local content
    const envContent = `# Supabase Configuration
VITE_SUPABASE_URL=${supabaseUrl}
VITE_SUPABASE_ANON_KEY=${supabaseKey}

# Application Configuration
VITE_APP_NAME=UniMatch
VITE_APP_VERSION=1.0.0
VITE_APP_URL=http://localhost:5173

# Development Settings
VITE_DEBUG=true
VITE_USE_MOCK_DATA=false
`;

    // Write .env.local file
    fs.writeFileSync(envPath, envContent);

    console.log('\n✅ .env.local created successfully!');
    console.log('\n📝 Next steps:');
    console.log('   1. Make sure your Supabase project has the correct schema');
    console.log('   2. Run: npm run dev');
    console.log('   3. Visit: http://localhost:5173');
    console.log('\n🎉 Setup complete!');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Run setup
setupSupabase();
