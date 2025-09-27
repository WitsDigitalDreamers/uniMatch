#!/usr/bin/env node

/**
 * UniMatch Database Test Script
 * This script tests the database connection and basic operations
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testDatabase() {
  console.log('🧪 Testing UniMatch Database Connection');
  console.log('======================================\n');

  try {
    // Read environment variables
    const envPath = path.join(__dirname, '..', '.env.local');
    if (!fs.existsSync(envPath)) {
      console.log('❌ .env.local not found. Please run setup first.');
      process.exit(1);
    }

    const envContent = fs.readFileSync(envPath, 'utf8');
    const supabaseUrl = envContent.match(/VITE_SUPABASE_URL=(.+)/)?.[1];
    const supabaseKey = envContent.match(/VITE_SUPABASE_ANON_KEY=(.+)/)?.[1];

    if (!supabaseUrl || !supabaseKey) {
      console.log('❌ Missing Supabase configuration');
      process.exit(1);
    }

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Test 1: Basic connection
    console.log('1. Testing basic connection...');
    const { data: connectionTest, error: connectionError } = await supabase
      .from('students')
      .select('count')
      .limit(1);

    if (connectionError) {
      console.log('❌ Connection failed:', connectionError.message);
      return false;
    }
    console.log('✅ Connection successful\n');

    // Test 2: Check if students table exists and has data
    console.log('2. Checking students table...');
    const { data: students, error: studentsError } = await supabase
      .from('students')
      .select('*')
      .limit(5);

    if (studentsError) {
      console.log('❌ Students table error:', studentsError.message);
      return false;
    }

    console.log(`✅ Students table accessible (${students?.length || 0} records found)\n`);

    // Test 3: Test login functionality
    console.log('3. Testing login functionality...');
    const { data: loginTest, error: loginError } = await supabase
      .from('students')
      .select('*')
      .eq('id_number', '0123456789')
      .eq('username', 'thabo.molefe')
      .single();

    if (loginError) {
      console.log('❌ Login test failed:', loginError.message);
      return false;
    }

    if (loginTest) {
      console.log('✅ Login functionality working');
      console.log(`   Found student: ${loginTest.first_name} ${loginTest.last_name}\n`);
    } else {
      console.log('⚠️  No test student found (this is normal if no sample data is loaded)\n');
    }

    // Test 4: Test APS calculation function
    console.log('4. Testing APS calculation...');
    const { data: apsTest, error: apsError } = await supabase
      .rpc('calculate_aps', { 
        marks: { mathematics: 85, english: 78, physical_sciences: 82, life_sciences: 79 } 
      });

    if (apsError) {
      console.log('❌ APS calculation failed:', apsError.message);
      return false;
    }

    console.log(`✅ APS calculation working (test score: ${apsTest})\n`);

    console.log('🎉 All tests passed! Database is ready to use.');
    return true;

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    return false;
  }
}

// Run tests
testDatabase().then(success => {
  process.exit(success ? 0 : 1);
});
