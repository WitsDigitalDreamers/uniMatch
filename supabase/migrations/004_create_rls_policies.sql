-- UniMatch Database Migration Scripts
-- Phase 1: Set up Row Level Security (RLS) policies

-- Migration 004: Create RLS policies
-- Run this after creating tables, indexes, and functions

-- Enable RLS on all tables
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE roommate_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE bursary_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- =============================================
-- STUDENT POLICIES
-- =============================================

-- Students can only see their own data
CREATE POLICY "Students can view own data" ON students
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Students can update own data" ON students
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Students can insert own data" ON students
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =============================================
-- OFFER POLICIES
-- =============================================

-- Students can only see their own offers
CREATE POLICY "Students can view own offers" ON offers
  FOR SELECT USING (
    student_id IN (
      SELECT id_number FROM students WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Students can update own offers" ON offers
  FOR UPDATE USING (
    student_id IN (
      SELECT id_number FROM students WHERE user_id = auth.uid()
    )
  );

-- =============================================
-- APPLICATION POLICIES
-- =============================================

-- Students can only see their own applications
CREATE POLICY "Students can view own applications" ON student_applications
  FOR SELECT USING (
    student_id IN (
      SELECT id_number FROM students WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Students can insert own applications" ON student_applications
  FOR INSERT WITH CHECK (
    student_id IN (
      SELECT id_number FROM students WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Students can update own applications" ON student_applications
  FOR UPDATE USING (
    student_id IN (
      SELECT id_number FROM students WHERE user_id = auth.uid()
    )
  );

-- =============================================
-- BURSARY APPLICATION POLICIES
-- =============================================

-- Students can only see their own bursary applications
CREATE POLICY "Students can view own bursary applications" ON bursary_applications
  FOR SELECT USING (
    student_id IN (
      SELECT id_number FROM students WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Students can insert own bursary applications" ON bursary_applications
  FOR INSERT WITH CHECK (
    student_id IN (
      SELECT id_number FROM students WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Students can update own bursary applications" ON bursary_applications
  FOR UPDATE USING (
    student_id IN (
      SELECT id_number FROM students WHERE user_id = auth.uid()
    )
  );

-- =============================================
-- ROOMMATE MATCH POLICIES
-- =============================================

-- Students can only see their own roommate matches
CREATE POLICY "Students can view own roommate matches" ON roommate_matches
  FOR SELECT USING (
    student1_id IN (
      SELECT id_number FROM students WHERE user_id = auth.uid()
    ) OR student2_id IN (
      SELECT id_number FROM students WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Students can update own roommate matches" ON roommate_matches
  FOR UPDATE USING (
    student1_id IN (
      SELECT id_number FROM students WHERE user_id = auth.uid()
    ) OR student2_id IN (
      SELECT id_number FROM students WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Students can insert roommate matches" ON roommate_matches
  FOR INSERT WITH CHECK (
    student1_id IN (
      SELECT id_number FROM students WHERE user_id = auth.uid()
    ) OR student2_id IN (
      SELECT id_number FROM students WHERE user_id = auth.uid()
    )
  );

-- =============================================
-- SESSION POLICIES
-- =============================================

-- Users can only see their own sessions
CREATE POLICY "Users can view own sessions" ON user_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions" ON user_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions" ON user_sessions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own sessions" ON user_sessions
  FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- PUBLIC READ ACCESS POLICIES
-- =============================================

-- Public read access for reference data
CREATE POLICY "Public read access" ON universities
  FOR SELECT USING (true);

CREATE POLICY "Public read access" ON courses
  FOR SELECT USING (true);

CREATE POLICY "Public read access" ON schools
  FOR SELECT USING (true);

CREATE POLICY "Public read access" ON bursaries
  FOR SELECT USING (true);

CREATE POLICY "Public read access" ON careers
  FOR SELECT USING (true);

CREATE POLICY "Public read access" ON residences
  FOR SELECT USING (true);

-- =============================================
-- ADMIN POLICIES (for future implementation)
-- =============================================

-- Admin policies will be added in Phase 2 when we implement role-based access
-- For now, we'll create placeholder policies that can be updated later

-- Admin can view all students (placeholder)
CREATE POLICY "Admin can view all students" ON students
  FOR SELECT USING (false); -- Will be updated with proper admin role check

-- Admin can view all applications (placeholder)
CREATE POLICY "Admin can view all applications" ON student_applications
  FOR SELECT USING (false); -- Will be updated with proper admin role check

-- Admin can view all offers (placeholder)
CREATE POLICY "Admin can view all offers" ON offers
  FOR SELECT USING (false); -- Will be updated with proper admin role check

-- =============================================
-- DATA VALIDATION CONSTRAINTS
-- =============================================

-- Add constraints for data validation
ALTER TABLE students ADD CONSTRAINT check_id_number_format 
  CHECK (id_number ~ '^\d{13}$');

ALTER TABLE students ADD CONSTRAINT check_email_format 
  CHECK (email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

ALTER TABLE courses ADD CONSTRAINT check_positive_cost 
  CHECK (estimated_cost > 0);

ALTER TABLE courses ADD CONSTRAINT check_positive_points 
  CHECK (points_required > 0);

ALTER TABLE residences ADD CONSTRAINT check_positive_price 
  CHECK (price_per_month > 0);

ALTER TABLE residences ADD CONSTRAINT check_positive_capacity 
  CHECK (capacity > 0);

ALTER TABLE bursaries ADD CONSTRAINT check_positive_amount 
  CHECK (amount IS NULL OR amount > 0);

-- =============================================
-- TABLE COMMENTS FOR DOCUMENTATION
-- =============================================

COMMENT ON TABLE schools IS 'High schools and educational institutions';
COMMENT ON TABLE universities IS 'Universities and higher education institutions';
COMMENT ON TABLE courses IS 'Academic courses and programs offered by universities';
COMMENT ON TABLE students IS 'Student profiles and academic records';
COMMENT ON TABLE residences IS 'University residence halls and accommodation';
COMMENT ON TABLE bursaries IS 'Financial aid and scholarship opportunities';
COMMENT ON TABLE careers IS 'Career information and job market data';
COMMENT ON TABLE offers IS 'University course offers to students';
COMMENT ON TABLE student_applications IS 'Student applications to universities';
COMMENT ON TABLE roommate_matches IS 'Compatibility matches for roommates';
COMMENT ON TABLE bursary_applications IS 'Student applications for bursaries';
COMMENT ON TABLE user_sessions IS 'User session management';
COMMENT ON TABLE system_logs IS 'System activity logs for audit purposes';
