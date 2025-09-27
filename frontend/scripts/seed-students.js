#!/usr/bin/env node

/**
 * UniMatch Student Data Seeding Script
 * This script populates the database with sample student data
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function seedStudents() {
  console.log('🌱 Seeding UniMatch Database with Sample Students');
  console.log('================================================\n');

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

    // Sample student data
    const sampleStudents = [
      {
        id_number: '0123456789',
        username: 'thabo.molefe',
        first_name: 'Thabo',
        last_name: 'Molefe',
        email: 'thabo.molefe@example.com',
        school_id: 'SCH001',
        marks: {
          mathematics: 85,
          english: 78,
          physical_sciences: 82,
          life_sciences: 79,
          accounting: 88,
          economics: 75
        },
        preferred_residences: ['RES001', 'RES002']
      },
      {
        id_number: '9876543210',
        username: 'sarah.johnson',
        first_name: 'Sarah',
        last_name: 'Johnson',
        email: 'sarah.johnson@example.com',
        school_id: 'SCH002',
        marks: {
          mathematics: 92,
          english: 89,
          physical_sciences: 95,
          life_sciences: 87,
          accounting: 91,
          economics: 83
        },
        preferred_residences: ['RES003', 'RES004']
      },
      {
        id_number: '1234567890',
        username: 'aisha.patel',
        first_name: 'Aisha',
        last_name: 'Patel',
        email: 'aisha.patel@example.com',
        school_id: 'SCH003',
        marks: {
          mathematics: 78,
          english: 85,
          physical_sciences: 76,
          life_sciences: 88,
          accounting: 82,
          economics: 79
        },
        preferred_residences: ['RES001', 'RES005']
      },
      {
        id_number: '5555555555',
        username: 'mike.van.der.merwe',
        first_name: 'Mike',
        last_name: 'van der Merwe',
        email: 'mike.vandermerwe@example.com',
        school_id: 'SCH004',
        marks: {
          mathematics: 88,
          english: 82,
          physical_sciences: 91,
          life_sciences: 85,
          accounting: 79,
          economics: 87
        },
        preferred_residences: ['RES002', 'RES006']
      },
      {
        id_number: '7777777777',
        username: 'fatima.ndlovu',
        first_name: 'Fatima',
        last_name: 'Ndlovu',
        email: 'fatima.ndlovu@example.com',
        school_id: 'SCH005',
        marks: {
          mathematics: 95,
          english: 91,
          physical_sciences: 93,
          life_sciences: 89,
          accounting: 94,
          economics: 88
        },
        preferred_residences: ['RES003', 'RES007']
      }
    ];

    console.log('1. Checking existing students...');
    const { data: existingStudents, error: checkError } = await supabase
      .from('students')
      .select('id_number');

    if (checkError) {
      console.log('❌ Error checking existing students:', checkError.message);
      return false;
    }

    if (existingStudents && existingStudents.length > 0) {
      console.log(`⚠️  Found ${existingStudents.length} existing students. Skipping seed.`);
      console.log('   To re-seed, first clear the students table.\n');
      return true;
    }

    console.log('✅ No existing students found. Proceeding with seed.\n');

    console.log('2. Inserting sample students...');
    const { data: insertedStudents, error: insertError } = await supabase
      .from('students')
      .insert(sampleStudents)
      .select();

    if (insertError) {
      console.log('❌ Error inserting students:', insertError.message);
      return false;
    }

    console.log(`✅ Successfully inserted ${insertedStudents?.length || 0} students\n`);

    console.log('3. Verifying inserted data...');
    const { data: verifyStudents, error: verifyError } = await supabase
      .from('students')
      .select('id_number, username, first_name, last_name, email')
      .order('created_at');

    if (verifyError) {
      console.log('❌ Error verifying students:', verifyError.message);
      return false;
    }

    console.log('✅ Verification successful. Inserted students:');
    verifyStudents?.forEach(student => {
      console.log(`   - ${student.first_name} ${student.last_name} (${student.username})`);
    });

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📝 You can now test the login functionality:');
    console.log('   npm run test:db');
    console.log('\n🚀 Or start the development server:');
    console.log('   npm run dev');

    return true;

  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    return false;
  }
}

// Run seeding
seedStudents().then(success => {
  process.exit(success ? 0 : 1);
});
