# Supabase Authentication Setup

This guide will help you set up Supabase authentication for the UniMatch frontend.

## Prerequisites

1. A Supabase project created at [supabase.com](https://supabase.com)
2. Node.js and npm installed
3. The UniMatch database schema deployed to your Supabase project

## Quick Setup

### 1. Run the setup script

```bash
npm run setup:supabase
```

This will prompt you for your Supabase URL and API key.

### 2. Manual Setup (Alternative)

If you prefer to set up manually:

1. Copy the environment template:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your-supabase-url-here
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key-here
   ```

### 3. Get your Supabase credentials

1. Go to your Supabase dashboard
2. Navigate to Settings > API
3. Copy the Project URL and anon/public key

### 4. Database Setup

Make sure your Supabase database has the correct schema:

1. Run the schema migration:
   ```bash
   npm run migrate
   ```

2. Or manually run the SQL from `supabase/schema.sql` in your Supabase SQL editor

### 5. Start the development server

```bash
npm run dev
```

## Authentication Features

The updated authentication system includes:

- ✅ Email/password sign up
- ✅ Email/password sign in
- ✅ Automatic session management
- ✅ Student profile creation
- ✅ Protected routes
- ✅ Real-time auth state updates

## Database Schema

The authentication system expects these tables:

- `students` - Student profiles linked to Supabase auth users
- `schools` - School reference data
- `universities` - University reference data
- `courses` - Course reference data
- `careers` - Career reference data
- `bursaries` - Bursary reference data
- `residences` - Residence reference data

## Troubleshooting

### Common Issues

1. **"Missing Supabase environment variables"**
   - Make sure `.env.local` exists and has the correct variables
   - Restart the development server after adding environment variables

2. **"Invalid credentials"**
   - Check that your Supabase URL and key are correct
   - Ensure your Supabase project is active

3. **"User not found"**
   - Make sure the student record is created in the database
   - Check that the `students` table exists and has the correct schema

4. **Database connection issues**
   - Verify your Supabase project is running
   - Check that the database schema is properly deployed

### Getting Help

- Check the Supabase documentation: [docs.supabase.com](https://docs.supabase.com)
- Review the console for error messages
- Ensure all environment variables are set correctly

## Development Notes

- The authentication state is managed by Supabase Auth
- Student data is stored in the `students` table
- All protected routes require authentication
- The system automatically handles session persistence
