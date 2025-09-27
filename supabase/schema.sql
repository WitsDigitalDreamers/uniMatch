-- UniMatch Database Schema
-- Phase 1: Core Database Setup

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================
-- CORE REFERENCE TABLES
-- =============================================

-- Schools table
CREATE TABLE schools (
  school_id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  province TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Public', 'Private', 'Technical')),
  is_partner BOOLEAN DEFAULT false,
  contact_email TEXT,
  contact_phone TEXT,
  address TEXT,
  website TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Universities table
CREATE TABLE universities (
  university_id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  province TEXT NOT NULL,
  website TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  address TEXT,
  established_year INTEGER,
  university_type TEXT CHECK (university_type IN ('Traditional', 'University of Technology', 'Comprehensive')),
  accreditation_status TEXT DEFAULT 'Accredited',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Residences table
CREATE TABLE residences (
  residence_id TEXT PRIMARY KEY,
  university_id TEXT NOT NULL REFERENCES universities(university_id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female', 'mixed')),
  price_per_month INTEGER NOT NULL,
  estimated_annual_cost INTEGER NOT NULL,
  capacity INTEGER NOT NULL,
  amenities TEXT[] DEFAULT '{}',
  distance_from_campus TEXT NOT NULL,
  contact_info JSONB NOT NULL DEFAULT '{}',
  availability_status TEXT DEFAULT 'Available' CHECK (availability_status IN ('Available', 'Full', 'Maintenance')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Courses table
CREATE TABLE courses (
  course_id TEXT PRIMARY KEY,
  university_id TEXT NOT NULL REFERENCES universities(university_id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  faculty TEXT NOT NULL,
  requirements JSONB NOT NULL DEFAULT '{}',
  points_required INTEGER NOT NULL,
  estimated_cost INTEGER NOT NULL,
  modules TEXT[] DEFAULT '{}',
  available_residences TEXT[] DEFAULT '{}',
  duration_years INTEGER DEFAULT 3,
  qualification_type TEXT DEFAULT 'Bachelor' CHECK (qualification_type IN ('Certificate', 'Diploma', 'Bachelor', 'Honours', 'Masters', 'PhD')),
  nqf_level INTEGER CHECK (nqf_level BETWEEN 5 AND 10),
  application_deadline DATE,
  intake_periods TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Students table (extends Supabase auth.users)
CREATE TABLE students (
  id_number TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  school_id TEXT NOT NULL REFERENCES schools(school_id),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  nationality TEXT DEFAULT 'South African',
  marks JSONB NOT NULL DEFAULT '{}',
  preferred_residences TEXT[] DEFAULT '{}',
  quiz_answers JSONB DEFAULT NULL,
  profile_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bursaries table
CREATE TABLE bursaries (
  bursary_id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  provider TEXT NOT NULL,
  eligibility JSONB NOT NULL DEFAULT '{}',
  deadline DATE NOT NULL,
  amount INTEGER,
  amount_type TEXT CHECK (amount_type IN ('Fixed', 'Percentage', 'Full Coverage', 'Partial')),
  description TEXT,
  application_url TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  requirements TEXT[] DEFAULT '{}',
  application_process TEXT,
  renewal_required BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Careers table
CREATE TABLE careers (
  career_id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  required_courses TEXT[] DEFAULT '{}',
  alternative_courses TEXT[] DEFAULT '{}',
  skills_required TEXT[] DEFAULT '{}',
  average_salary JSONB NOT NULL DEFAULT '{}',
  job_market_outlook TEXT NOT NULL CHECK (job_market_outlook IN ('excellent', 'good', 'moderate', 'limited')),
  growth_rate INTEGER NOT NULL,
  learn_more_url TEXT,
  industry TEXT,
  work_environment TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- APPLICATION AND OFFER TABLES
-- =============================================

-- Offers table
CREATE TABLE offers (
  offer_id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL REFERENCES students(id_number) ON DELETE CASCADE,
  university_id TEXT NOT NULL REFERENCES universities(university_id) ON DELETE CASCADE,
  course_id TEXT NOT NULL REFERENCES courses(course_id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'expired')),
  offer_date DATE NOT NULL,
  deadline DATE NOT NULL,
  conditional BOOLEAN DEFAULT false,
  conditions TEXT[] DEFAULT '{}',
  offer_letter_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Student applications table
CREATE TABLE student_applications (
  application_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id TEXT NOT NULL REFERENCES students(id_number) ON DELETE CASCADE,
  course_id TEXT NOT NULL REFERENCES courses(course_id) ON DELETE CASCADE,
  university_id TEXT NOT NULL REFERENCES universities(university_id) ON DELETE CASCADE,
  application_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'under_review', 'accepted', 'rejected', 'waitlisted', 'withdrawn')),
  documents JSONB DEFAULT '{}',
  notes TEXT,
  application_fee_paid BOOLEAN DEFAULT false,
  application_fee_amount INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- MATCHING AND SOCIAL FEATURES
-- =============================================

-- Roommate matches table
CREATE TABLE roommate_matches (
  match_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student1_id TEXT NOT NULL REFERENCES students(id_number) ON DELETE CASCADE,
  student2_id TEXT NOT NULL REFERENCES students(id_number) ON DELETE CASCADE,
  compatibility_score DECIMAL(5,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'expired')),
  match_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student1_id, student2_id),
  CHECK (student1_id != student2_id)
);

-- Student bursary applications
CREATE TABLE bursary_applications (
  application_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id TEXT NOT NULL REFERENCES students(id_number) ON DELETE CASCADE,
  bursary_id TEXT NOT NULL REFERENCES bursaries(bursary_id) ON DELETE CASCADE,
  application_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'under_review', 'approved', 'rejected', 'waitlisted')),
  documents JSONB DEFAULT '{}',
  notes TEXT,
  amount_awarded INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- SYSTEM TABLES
-- =============================================

-- User sessions table
CREATE TABLE user_sessions (
  session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id TEXT REFERENCES students(id_number) ON DELETE CASCADE,
  session_data JSONB DEFAULT '{}',
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- System logs table
CREATE TABLE system_logs (
  log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  table_name TEXT,
  record_id TEXT,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Primary indexes
CREATE INDEX idx_students_user_id ON students(user_id);
CREATE INDEX idx_students_school_id ON students(school_id);
CREATE INDEX idx_students_email ON students(email);
CREATE INDEX idx_students_profile_completed ON students(profile_completed);

CREATE INDEX idx_courses_university_id ON courses(university_id);
CREATE INDEX idx_courses_faculty ON courses(faculty);
CREATE INDEX idx_courses_qualification_type ON courses(qualification_type);
CREATE INDEX idx_courses_nqf_level ON courses(nqf_level);

CREATE INDEX idx_offers_student_id ON offers(student_id);
CREATE INDEX idx_offers_status ON offers(status);
CREATE INDEX idx_offers_deadline ON offers(deadline);
CREATE INDEX idx_offers_course_id ON offers(course_id);

CREATE INDEX idx_residences_university_id ON residences(university_id);
CREATE INDEX idx_residences_gender ON residences(gender);
CREATE INDEX idx_residences_availability ON residences(availability_status);

CREATE INDEX idx_applications_student_id ON student_applications(student_id);
CREATE INDEX idx_applications_course_id ON student_applications(course_id);
CREATE INDEX idx_applications_status ON student_applications(status);
CREATE INDEX idx_applications_date ON student_applications(application_date);

CREATE INDEX idx_bursary_applications_student_id ON bursary_applications(student_id);
CREATE INDEX idx_bursary_applications_bursary_id ON bursary_applications(bursary_id);
CREATE INDEX idx_bursary_applications_status ON bursary_applications(status);

CREATE INDEX idx_roommate_matches_student1 ON roommate_matches(student1_id);
CREATE INDEX idx_roommate_matches_student2 ON roommate_matches(student2_id);
CREATE INDEX idx_roommate_matches_status ON roommate_matches(status);
CREATE INDEX idx_roommate_matches_score ON roommate_matches(compatibility_score);

-- JSONB indexes for efficient querying
CREATE INDEX idx_students_marks_gin ON students USING GIN (marks);
CREATE INDEX idx_students_quiz_answers_gin ON students USING GIN (quiz_answers);
CREATE INDEX idx_courses_requirements_gin ON courses USING GIN (requirements);
CREATE INDEX idx_bursaries_eligibility_gin ON bursaries USING GIN (eligibility);
CREATE INDEX idx_careers_salary_gin ON careers USING GIN (average_salary);

-- Composite indexes for common queries
CREATE INDEX idx_offers_student_status ON offers(student_id, status);
CREATE INDEX idx_applications_student_status ON student_applications(student_id, status);
CREATE INDEX idx_courses_university_faculty ON courses(university_id, faculty);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS on all tables
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE roommate_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE bursary_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- Students can only see their own data
CREATE POLICY "Students can view own data" ON students
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Students can update own data" ON students
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Students can insert own data" ON students
  FOR INSERT WITH CHECK (auth.uid() = user_id);

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
-- FUNCTIONS
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate APS score
CREATE OR REPLACE FUNCTION calculate_aps(marks JSONB)
RETURNS INTEGER AS $$
DECLARE
  subject_mark INTEGER;
  total_points INTEGER := 0;
  mark_values INTEGER[] := ARRAY[]::INTEGER[];
BEGIN
  -- Extract all mark values
  FOR subject_mark IN SELECT jsonb_array_elements_text(jsonb_object_values(marks))::INTEGER
  LOOP
    mark_values := mark_values || subject_mark;
  END LOOP;
  
  -- Sort and take top 7
  SELECT array_agg(val ORDER BY val DESC)
  INTO mark_values
  FROM unnest(mark_values) AS val
  LIMIT 7;
  
  -- Calculate APS points
  FOREACH subject_mark IN ARRAY mark_values
  LOOP
    IF subject_mark >= 80 THEN
      total_points := total_points + 7;
    ELSIF subject_mark >= 70 THEN
      total_points := total_points + 6;
    ELSIF subject_mark >= 60 THEN
      total_points := total_points + 5;
    ELSIF subject_mark >= 50 THEN
      total_points := total_points + 4;
    ELSIF subject_mark >= 40 THEN
      total_points := total_points + 3;
    ELSIF subject_mark >= 30 THEN
      total_points := total_points + 2;
    ELSE
      total_points := total_points + 1;
    END IF;
  END LOOP;
  
  RETURN total_points;
END;
$$ LANGUAGE plpgsql;

-- Function to check course eligibility
CREATE OR REPLACE FUNCTION check_course_eligibility(student_id TEXT, course_id TEXT)
RETURNS JSONB AS $$
DECLARE
  student_marks JSONB;
  course_requirements JSONB;
  student_aps INTEGER;
  required_aps INTEGER;
  result JSONB := '{"eligible": false, "missing": []}'::JSONB;
  missing_reqs TEXT[] := ARRAY[]::TEXT[];
  req_key TEXT;
  req_value TEXT;
  student_mark INTEGER;
BEGIN
  -- Get student marks
  SELECT marks INTO student_marks FROM students WHERE id_number = student_id;
  
  -- Get course requirements
  SELECT requirements INTO course_requirements FROM courses WHERE course_id = course_id;
  
  -- Calculate APS
  student_aps := calculate_aps(student_marks);
  required_aps := COALESCE((course_requirements->>'minimum_aps')::INTEGER, 0);
  
  -- Check APS requirement
  IF student_aps < required_aps THEN
    missing_reqs := missing_reqs || format('APS score (need %s, have %s)', required_aps, student_aps);
  END IF;
  
  -- Check subject requirements
  FOR req_key, req_value IN SELECT * FROM jsonb_each_text(course_requirements)
  LOOP
    IF req_key != 'minimum_aps' AND req_key != 'additional_requirements' THEN
      student_mark := COALESCE((student_marks->>req_key)::INTEGER, 0);
      IF student_mark < req_value::INTEGER THEN
        missing_reqs := missing_reqs || format('%s (need %s%%, have %s%%)', req_key, req_value, student_mark);
      END IF;
    END IF;
  END LOOP;
  
  -- Build result
  result := jsonb_build_object(
    'eligible', array_length(missing_reqs, 1) IS NULL,
    'missing', missing_reqs,
    'aps_score', student_aps,
    'required_aps', required_aps
  );
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to get student qualification report
CREATE OR REPLACE FUNCTION get_student_qualification_report(student_id TEXT)
RETURNS JSONB AS $$
DECLARE
  student_record RECORD;
  course_record RECORD;
  eligibility_result JSONB;
  eligible_courses JSONB := '[]'::JSONB;
  improvement_courses JSONB := '[]'::JSONB;
  all_courses JSONB := '[]'::JSONB;
BEGIN
  -- Get student data
  SELECT * INTO student_record FROM students WHERE id_number = student_id;
  
  -- Process each course
  FOR course_record IN 
    SELECT c.*, u.name as university_name, u.location as university_location
    FROM courses c
    JOIN universities u ON c.university_id = u.university_id
  LOOP
    eligibility_result := check_course_eligibility(student_id, course_record.course_id);
    
    -- Add course info to result
    eligibility_result := eligibility_result || jsonb_build_object(
      'course', row_to_json(course_record),
      'university', jsonb_build_object(
        'name', course_record.university_name,
        'location', course_record.university_location
      )
    );
    
    all_courses := all_courses || eligibility_result;
    
    -- Categorize courses
    IF (eligibility_result->>'eligible')::BOOLEAN THEN
      eligible_courses := eligible_courses || eligibility_result;
    ELSE
      improvement_courses := improvement_courses || eligibility_result;
    END IF;
  END LOOP;
  
  RETURN jsonb_build_object(
    'student', row_to_json(student_record),
    'aps_score', calculate_aps(student_record.marks),
    'eligible_courses', eligible_courses,
    'improvement_courses', improvement_courses,
    'total_eligible', jsonb_array_length(eligible_courses),
    'total_improvement', jsonb_array_length(improvement_courses)
  );
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- TRIGGERS
-- =============================================

-- Apply triggers to all tables with updated_at column
CREATE TRIGGER update_schools_updated_at BEFORE UPDATE ON schools
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_universities_updated_at BEFORE UPDATE ON universities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_offers_updated_at BEFORE UPDATE ON offers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_residences_updated_at BEFORE UPDATE ON residences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bursaries_updated_at BEFORE UPDATE ON bursaries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_careers_updated_at BEFORE UPDATE ON careers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON student_applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_roommate_matches_updated_at BEFORE UPDATE ON roommate_matches
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bursary_applications_updated_at BEFORE UPDATE ON bursary_applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- INITIAL DATA VALIDATION
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
-- COMMENTS FOR DOCUMENTATION
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

COMMENT ON FUNCTION calculate_aps(JSONB) IS 'Calculates Admission Point Score from student marks';
COMMENT ON FUNCTION check_course_eligibility(TEXT, TEXT) IS 'Checks if student meets course requirements';
COMMENT ON FUNCTION get_student_qualification_report(TEXT) IS 'Generates comprehensive qualification report for student';
