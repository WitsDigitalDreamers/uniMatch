-- =============================================
-- UniMatch Database Schema v3.0
-- Student-focused with JSON reference data
-- =============================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================
-- STUDENT TABLES
-- =============================================

-- Students table
CREATE TABLE students (
  id_number TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  school_id TEXT NOT NULL,
  marks JSONB NOT NULL DEFAULT '{}',
  preferred_residences TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Student applications table
CREATE TABLE student_applications (
  application_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id TEXT NOT NULL REFERENCES students(id_number) ON DELETE CASCADE,
  course_id TEXT NOT NULL,
  university_id TEXT NOT NULL,
  application_status TEXT NOT NULL DEFAULT 'Pending' CHECK (application_status IN ('Pending', 'Under Review', 'Accepted', 'Rejected', 'Waitlisted')),
  application_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  decision_date TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Offers table (for storing generated offers)
CREATE TABLE offers (
  offer_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id TEXT NOT NULL REFERENCES students(id_number) ON DELETE CASCADE,
  course_id TEXT NOT NULL,
  university_id TEXT NOT NULL,
  offer_type TEXT NOT NULL CHECK (offer_type IN ('Conditional', 'Unconditional', 'Waitlist')),
  offer_conditions JSONB DEFAULT '{}',
  expiry_date DATE,
  acceptance_deadline DATE,
  offer_status TEXT NOT NULL DEFAULT 'Active' CHECK (offer_status IN ('Active', 'Accepted', 'Declined', 'Expired')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Roommate matching table
CREATE TABLE roommate_matches (
  match_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id TEXT NOT NULL REFERENCES students(id_number) ON DELETE CASCADE,
  matched_student_id TEXT NOT NULL REFERENCES students(id_number) ON DELETE CASCADE,
  compatibility_score DECIMAL(3,2) NOT NULL CHECK (compatibility_score >= 0 AND compatibility_score <= 1),
  match_status TEXT NOT NULL DEFAULT 'Pending' CHECK (match_status IN ('Pending', 'Accepted', 'Rejected', 'Expired')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, matched_student_id)
);

-- =============================================
-- INDEXES
-- =============================================

-- Students table indexes
CREATE INDEX idx_students_username ON students(username);
CREATE INDEX idx_students_email ON students(email);
CREATE INDEX idx_students_school_id ON students(school_id);
CREATE INDEX idx_students_created_at ON students(created_at);

-- Student applications indexes
CREATE INDEX idx_applications_student_id ON student_applications(student_id);
CREATE INDEX idx_applications_course_id ON student_applications(course_id);
CREATE INDEX idx_applications_university_id ON student_applications(university_id);
CREATE INDEX idx_applications_status ON student_applications(application_status);
CREATE INDEX idx_applications_date ON student_applications(application_date);

-- Offers indexes
CREATE INDEX idx_offers_student_id ON offers(student_id);
CREATE INDEX idx_offers_course_id ON offers(course_id);
CREATE INDEX idx_offers_university_id ON offers(university_id);
CREATE INDEX idx_offers_status ON offers(offer_status);
CREATE INDEX idx_offers_expiry ON offers(expiry_date);

-- Roommate matches indexes
CREATE INDEX idx_matches_student_id ON roommate_matches(student_id);
CREATE INDEX idx_matches_matched_student_id ON roommate_matches(matched_student_id);
CREATE INDEX idx_matches_status ON roommate_matches(match_status);
CREATE INDEX idx_matches_compatibility ON roommate_matches(compatibility_score);

-- =============================================
-- FUNCTIONS
-- =============================================

-- Function to calculate APS score
CREATE OR REPLACE FUNCTION calculate_aps(marks JSONB)
RETURNS INTEGER AS $$
DECLARE
  total_points INTEGER := 0;
  subject TEXT;
  mark INTEGER;
BEGIN
  -- Core subjects (Mathematics, English, Physical Sciences, Life Sciences)
  FOR subject IN SELECT jsonb_object_keys(marks) LOOP
    mark := (marks->>subject)::INTEGER;
    
    -- Convert percentage to APS points
    IF mark >= 90 THEN
      total_points := total_points + 7;
    ELSIF mark >= 80 THEN
      total_points := total_points + 6;
    ELSIF mark >= 70 THEN
      total_points := total_points + 5;
    ELSIF mark >= 60 THEN
      total_points := total_points + 4;
    ELSIF mark >= 50 THEN
      total_points := total_points + 3;
    ELSIF mark >= 40 THEN
      total_points := total_points + 2;
    ELSIF mark >= 30 THEN
      total_points := total_points + 1;
    END IF;
  END LOOP;
  
  RETURN total_points;
END;
$$ LANGUAGE plpgsql;

-- Function to check course eligibility
CREATE OR REPLACE FUNCTION check_course_eligibility(student_id TEXT, course_id TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  student_aps INTEGER;
  course_requirements JSONB;
  required_aps INTEGER;
BEGIN
  -- Get student's APS score
  SELECT calculate_aps(marks) INTO student_aps
  FROM students
  WHERE id_number = student_id;
  
  -- Get course requirements (this would need to be populated from reference data)
  -- For now, return true as a placeholder
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Function to get student qualification report
CREATE OR REPLACE FUNCTION get_student_qualification_report(student_id TEXT)
RETURNS JSONB AS $$
DECLARE
  student_data RECORD;
  result JSONB;
BEGIN
  SELECT 
    s.*,
    calculate_aps(s.marks) as aps_score
  INTO student_data
  FROM students s
  WHERE s.id_number = student_id;
  
  IF NOT FOUND THEN
    RETURN '{"error": "Student not found"}'::JSONB;
  END IF;
  
  result := jsonb_build_object(
    'student_id', student_data.id_number,
    'name', student_data.first_name || ' ' || student_data.last_name,
    'email', student_data.email,
    'aps_score', student_data.aps_score,
    'marks', student_data.marks,
    'school_id', student_data.school_id,
    'preferred_residences', student_data.preferred_residences
  );
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- TRIGGERS
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all tables
CREATE TRIGGER update_students_updated_at
  BEFORE UPDATE ON students
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at
  BEFORE UPDATE ON student_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_offers_updated_at
  BEFORE UPDATE ON offers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_matches_updated_at
  BEFORE UPDATE ON roommate_matches
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- ROW LEVEL SECURITY (RLS) - DISABLED FOR DEMO
-- =============================================

-- Disable RLS for demo purposes since we're not using Supabase Auth
-- In production, you would want to implement proper RLS policies

-- Enable RLS on all tables
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE roommate_matches ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for demo purposes
-- WARNING: These policies allow full access - only use for development!

-- Students table - allow all operations for authenticated users
CREATE POLICY "Allow all operations on students" ON students
  FOR ALL USING (true) WITH CHECK (true);

-- Student applications - allow all operations for authenticated users
CREATE POLICY "Allow all operations on applications" ON student_applications
  FOR ALL USING (true) WITH CHECK (true);

-- Offers - allow all operations for authenticated users
CREATE POLICY "Allow all operations on offers" ON offers
  FOR ALL USING (true) WITH CHECK (true);

-- Roommate matches - allow all operations for authenticated users
CREATE POLICY "Allow all operations on matches" ON roommate_matches
  FOR ALL USING (true) WITH CHECK (true);

-- =============================================
-- SAMPLE DATA
-- =============================================

-- Insert sample students
INSERT INTO students (id_number, username, first_name, last_name, email, school_id, marks, preferred_residences) VALUES
('0123456789', 'thabo.molefe', 'Thabo', 'Molefe', 'thabo.molefe@example.com', 'SCH001', 
 '{"mathematics": 85, "english": 78, "physical_sciences": 82, "life_sciences": 79, "accounting": 88, "economics": 75}',
 '{"RES001", "RES002"}'),
('9876543210', 'sarah.johnson', 'Sarah', 'Johnson', 'sarah.johnson@example.com', 'SCH002',
 '{"mathematics": 92, "english": 89, "physical_sciences": 95, "life_sciences": 87, "accounting": 91, "economics": 83}',
 '{"RES003", "RES004"}'),
('1234567890', 'aisha.patel', 'Aisha', 'Patel', 'aisha.patel@example.com', 'SCH003',
 '{"mathematics": 78, "english": 85, "physical_sciences": 76, "life_sciences": 88, "accounting": 82, "economics": 79}',
 '{"RES001", "RES005"}'),
('5555555555', 'mike.van.der.merwe', 'Mike', 'van der Merwe', 'mike.vandermerwe@example.com', 'SCH004',
 '{"mathematics": 88, "english": 82, "physical_sciences": 91, "life_sciences": 85, "accounting": 79, "economics": 87}',
 '{"RES002", "RES006"}'),
('7777777777', 'fatima.ndlovu', 'Fatima', 'Ndlovu', 'fatima.ndlovu@example.com', 'SCH005',
 '{"mathematics": 95, "english": 91, "physical_sciences": 93, "life_sciences": 89, "accounting": 94, "economics": 88}',
 '{"RES003", "RES007"}');

-- =============================================
-- VIEWS
-- =============================================

-- View for student dashboard data
CREATE VIEW student_dashboard AS
SELECT 
  s.id_number,
  s.username,
  s.first_name,
  s.last_name,
  s.email,
  s.school_id,
  calculate_aps(s.marks) as aps_score,
  s.marks,
  s.preferred_residences,
  COUNT(DISTINCT sa.application_id) as total_applications,
  COUNT(DISTINCT o.offer_id) as total_offers,
  COUNT(DISTINCT rm.match_id) as total_matches
FROM students s
LEFT JOIN student_applications sa ON s.id_number = sa.student_id
LEFT JOIN offers o ON s.id_number = o.student_id
LEFT JOIN roommate_matches rm ON s.id_number = rm.student_id OR s.id_number = rm.matched_student_id
GROUP BY s.id_number, s.username, s.first_name, s.last_name, s.email, s.school_id, s.marks, s.preferred_residences;

-- View for active offers
CREATE VIEW active_offers AS
SELECT 
  o.*,
  s.first_name,
  s.last_name,
  s.email
FROM offers o
JOIN students s ON o.student_id = s.id_number
WHERE o.offer_status = 'Active' AND (o.expiry_date IS NULL OR o.expiry_date > CURRENT_DATE);

-- =============================================
-- GRANTS
-- =============================================

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;
