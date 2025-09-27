# UniMatch Phase 1: Database Setup Guide

## Overview
This guide will help you set up the Supabase database for the UniMatch application. Phase 1 focuses on creating the core database schema, functions, and security policies.

## Prerequisites
- Supabase account (free tier available at supabase.com)
- Basic knowledge of SQL and PostgreSQL
- Node.js installed (for Supabase CLI)

## Step 1: Create Supabase Project

1. **Sign up/Login to Supabase**
   - Go to [supabase.com](https://supabase.com)
   - Create a new account or login

2. **Create New Project**
   - Click "New Project"
   - Choose your organization
   - Enter project details:
     - **Name**: `unimatch-db`
     - **Database Password**: Generate a strong password
     - **Region**: Choose closest to your location
     - **Pricing Plan**: Free tier is sufficient for development

3. **Wait for Setup**
   - Project creation takes 2-3 minutes
   - Note down your project URL and API keys

## Step 2: Install Supabase CLI (Optional but Recommended)

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Initialize project (if you want to use local development)
supabase init
```

## Step 3: Run Database Migrations

### Option A: Using Supabase Dashboard (Recommended for beginners)

1. **Access SQL Editor**
   - Go to your Supabase project dashboard
   - Navigate to "SQL Editor" in the left sidebar

2. **Run Migrations in Order**
   - Copy and paste the contents of each migration file
   - Run them in this exact order:

   ```sql
   -- 1. Run: supabase/migrations/001_create_core_tables.sql
   -- 2. Run: supabase/migrations/002_create_indexes.sql
   -- 3. Run: supabase/migrations/003_create_functions_triggers.sql
   -- 4. Run: supabase/migrations/004_create_rls_policies.sql
   ```

### Option B: Using Supabase CLI (Advanced)

```bash
# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Run migrations
supabase db push
```

## Step 4: Verify Database Setup

### Check Tables Created
Run this query in the SQL Editor to verify all tables were created:

```sql
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

Expected tables:
- `bursaries`
- `bursary_applications`
- `careers`
- `courses`
- `offers`
- `residences`
- `roommate_matches`
- `schools`
- `student_applications`
- `students`
- `system_logs`
- `universities`
- `user_sessions`

### Check Functions Created
```sql
SELECT routine_name, routine_type 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
ORDER BY routine_name;
```

Expected functions:
- `calculate_aps`
- `calculate_roommate_compatibility`
- `check_course_eligibility`
- `get_student_qualification_report`
- `log_system_activity`
- `update_updated_at_column`

### Check Indexes Created
```sql
SELECT indexname, tablename 
FROM pg_indexes 
WHERE schemaname = 'public' 
ORDER BY tablename, indexname;
```

## Step 5: Test Database Functions

### Test APS Calculation
```sql
-- Test APS calculation function
SELECT calculate_aps('{"mathematics": 85, "english": 75, "physical_sciences": 80, "life_sciences": 78, "accounting": 82, "economics": 70, "geography": 65, "history": 60}'::jsonb);
```

Expected result: `42` (APS score)

### Test Course Eligibility (after adding sample data)
```sql
-- This will work after you add sample data in Phase 3
-- SELECT check_course_eligibility('0123456789', 'UCT_ENG001');
```

## Step 6: Environment Variables Setup

Create a `.env.local` file in your project root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Optional: For local development
SUPABASE_DB_PASSWORD=your-database-password
```

## Step 7: Install Supabase Client

```bash
# Install Supabase JavaScript client
npm install @supabase/supabase-js

# Install additional dependencies
npm install @supabase/auth-helpers-nextjs
```

## Step 8: Create Supabase Client Configuration

Create `lib/supabase.js`:

```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)
```

## Step 9: Test Connection

Create a simple test script `test-connection.js`:

```javascript
import { supabase } from './lib/supabase.js'

async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('universities')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('Connection failed:', error)
    } else {
      console.log('✅ Database connection successful!')
    }
  } catch (err) {
    console.error('Connection error:', err)
  }
}

testConnection()
```

Run the test:
```bash
node test-connection.js
```

## Step 10: Database Security Verification

### Check RLS Policies
```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename, policyname;
```

### Test Security (should fail without authentication)
```sql
-- This should fail due to RLS
SELECT * FROM students;
```

## Troubleshooting

### Common Issues

1. **Migration Errors**
   - Ensure migrations are run in the correct order
   - Check for syntax errors in SQL
   - Verify all dependencies are met

2. **Permission Errors**
   - Check that RLS policies are correctly applied
   - Verify user authentication is working
   - Ensure proper API keys are used

3. **Function Errors**
   - Check that all required extensions are enabled
   - Verify function syntax and parameters
   - Test functions individually

### Getting Help

1. **Supabase Documentation**: [supabase.com/docs](https://supabase.com/docs)
2. **Community Forum**: [github.com/supabase/supabase/discussions](https://github.com/supabase/supabase/discussions)
3. **Discord Community**: [discord.supabase.com](https://discord.supabase.com)

## Next Steps

After completing Phase 1:

1. **Phase 2**: Set up authentication and user management
2. **Phase 3**: Import real reference data (universities, courses, etc.)
3. **Phase 4**: Implement student data management
4. **Phase 5**: Build the qualification engine

## Database Schema Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│    Students     │    │   Universities  │    │     Courses     │
│                 │    │                 │    │                 │
│ - id_number     │    │ - university_id │    │ - course_id     │
│ - user_id       │    │ - name          │    │ - university_id │
│ - marks (JSONB) │    │ - location      │    │ - requirements  │
│ - quiz_answers  │    │ - province      │    │ - faculty       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                        │                        │
         │                        │                        │
         ▼                        ▼                        ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     Offers       │    │   Applications   │    │   Residences    │
│                  │    │                  │    │                 │
│ - offer_id       │    │ - application_id │    │ - residence_id  │
│ - student_id     │    │ - student_id     │    │ - university_id │
│ - course_id      │    │ - course_id      │    │ - amenities     │
│ - status         │    │ - status         │    │ - price         │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Performance Considerations

- **Indexes**: Optimized for common query patterns
- **JSONB**: Efficient storage and querying of complex data
- **RLS**: Row-level security for data protection
- **Functions**: Database-level logic for consistency
- **Triggers**: Automatic timestamp updates

The database is now ready for Phase 2: Authentication and User Management!
