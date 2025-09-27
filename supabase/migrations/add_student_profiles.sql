-- =============================================
-- Add Student Profiles Table
-- =============================================

-- Create student_profiles table to store comprehensive profile information
CREATE TABLE student_profiles (
  profile_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id TEXT NOT NULL REFERENCES students(id_number) ON DELETE CASCADE,
  
  -- Personal Information
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer-not-to-say')),
  contact_number TEXT,
  citizenship TEXT CHECK (citizenship IN ('south-african', 'other')),
  home_address JSONB DEFAULT '{}', -- {province, city, suburb, postal_code}
  
  -- Education Information
  high_school_name TEXT,
  high_school_address TEXT,
  year_matriculated INTEGER,
  matric_type TEXT CHECK (matric_type IN ('NSC', 'IEB', 'Cambridge', 'Other')),
  current_institution TEXT,
  student_number TEXT,
  qualification_name TEXT,
  year_of_study TEXT CHECK (year_of_study IN ('1st', '2nd', '3rd', '4th', 'honours', 'masters', 'phd')),
  
  -- Academic Performance
  average_percentage DECIMAL(5,2),
  aps_score INTEGER,
  subjects_passed INTEGER,
  subjects_failed INTEGER,
  subjects JSONB DEFAULT '[]', -- Array of {name, mark} objects
  
  -- Financial Information
  household_income TEXT,
  parents_occupation TEXT,
  number_of_dependents INTEGER,
  receiving_other_funding BOOLEAN DEFAULT FALSE,
  funding_source TEXT,
  
  -- Family/Guardian Information
  guardians JSONB DEFAULT '[]', -- Array of guardian objects
  
  -- Supporting Documents (file paths/URLs)
  documents JSONB DEFAULT '{}', -- {id_copy, matric_results, proof_of_address, proof_of_income, curriculum_vitae}
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure one profile per student
  UNIQUE(student_id)
);

-- Create indexes for better performance
CREATE INDEX idx_student_profiles_student_id ON student_profiles(student_id);
CREATE INDEX idx_student_profiles_aps_score ON student_profiles(aps_score);
CREATE INDEX idx_student_profiles_household_income ON student_profiles(household_income);
CREATE INDEX idx_student_profiles_created_at ON student_profiles(created_at);

-- Add updated_at trigger
CREATE TRIGGER update_student_profiles_updated_at
  BEFORE UPDATE ON student_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;

-- Create permissive policy for demo purposes
CREATE POLICY "Allow all operations on student_profiles" ON student_profiles
  FOR ALL USING (true) WITH CHECK (true);

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON student_profiles TO anon, authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
