# Database Setup for Profile Storage

## Overview
This document explains how to set up the database to store comprehensive student profiles.

## Migration Required

To enable profile storage, you need to run the following SQL migration in your Supabase database:

### 1. Access Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Create a new query

### 2. Run the Migration
Copy and paste the contents of `supabase/migrations/add_student_profiles.sql` into the SQL Editor and execute it.

### 3. Verify the Migration
After running the migration, you should see a new table called `student_profiles` in your database with the following structure:

- `profile_id` (UUID, Primary Key)
- `student_id` (TEXT, Foreign Key to students table)
- Personal information fields (date_of_birth, gender, contact_number, etc.)
- Education information fields (high_school_name, matric_type, etc.)
- Academic performance fields (aps_score, average_percentage, etc.)
- Financial information fields (household_income, parents_occupation, etc.)
- Guardian information (stored as JSONB array)
- Document URLs (stored as JSONB object)
- Timestamps (created_at, updated_at)

## Features Enabled

After running this migration, the Edit Profile form will:

1. **Load existing profile data** from the database when a student visits the page
2. **Save profile data** to the database when the student clicks "Save Profile"
3. **Handle file uploads** (currently mocked, but ready for real file storage integration)
4. **Calculate APS scores** automatically based on subject marks
5. **Validate data** before saving to ensure data integrity

## File Storage

The current implementation includes a placeholder for file uploads. To enable real file storage:

1. Set up a file storage service (AWS S3, Cloudinary, etc.)
2. Update the `uploadDocument` method in `profileService.ts`
3. Configure the storage service credentials in your environment variables

## Testing

To test the profile storage:

1. Log in as a student
2. Navigate to "Edit Profile" in the main navigation
3. Fill out the form with test data
4. Click "Save Profile"
5. Refresh the page to verify data persistence
6. Check the `student_profiles` table in Supabase to see the saved data

## Troubleshooting

If you encounter issues:

1. **Migration fails**: Check that you have the necessary permissions in Supabase
2. **Profile not loading**: Verify the student is logged in and the profile exists
3. **Save fails**: Check the browser console for error messages
4. **Type errors**: Ensure all TypeScript types are properly defined

## Next Steps

After setting up profile storage, consider:

1. Adding profile completion percentage tracking
2. Implementing profile validation for applications
3. Adding profile sharing features for bursary applications
4. Creating profile analytics and insights
