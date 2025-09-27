-- =============================================
-- Update Offers and Applications Tables
-- =============================================

-- Add missing fields to student_applications table
ALTER TABLE student_applications 
ADD COLUMN IF NOT EXISTS course_name TEXT,
ADD COLUMN IF NOT EXISTS university_name TEXT,
ADD COLUMN IF NOT EXISTS university_location TEXT;

-- Add missing fields to offers table
ALTER TABLE offers 
ADD COLUMN IF NOT EXISTS course_name TEXT,
ADD COLUMN IF NOT EXISTS university_name TEXT,
ADD COLUMN IF NOT EXISTS university_location TEXT;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_applications_course_name ON student_applications(course_name);
CREATE INDEX IF NOT EXISTS idx_applications_university_name ON student_applications(university_name);
CREATE INDEX IF NOT EXISTS idx_offers_course_name ON offers(course_name);
CREATE INDEX IF NOT EXISTS idx_offers_university_name ON offers(university_name);

-- Update existing data with placeholder values (if any)
UPDATE student_applications 
SET 
  course_name = 'Course Name',
  university_name = 'University Name',
  university_location = 'Location'
WHERE course_name IS NULL;

UPDATE offers 
SET 
  course_name = 'Course Name',
  university_name = 'University Name',
  university_location = 'Location'
WHERE course_name IS NULL;
