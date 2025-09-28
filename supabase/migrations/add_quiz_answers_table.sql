-- =============================================
-- Add quiz_answers table for room matching quiz
-- =============================================

-- Create quiz_answers table
CREATE TABLE quiz_answers (
  quiz_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id TEXT NOT NULL REFERENCES students(id_number) ON DELETE CASCADE,
  
  -- Quiz responses
  social_level INTEGER NOT NULL CHECK (social_level >= 1 AND social_level <= 5),
  sleep_schedule INTEGER NOT NULL CHECK (sleep_schedule >= 1 AND sleep_schedule <= 3),
  music_tolerance INTEGER NOT NULL CHECK (music_tolerance >= 1 AND music_tolerance <= 5),
  party_frequency INTEGER NOT NULL CHECK (party_frequency >= 1 AND party_frequency <= 5),
  smoking_preference INTEGER NOT NULL CHECK (smoking_preference >= 1 AND smoking_preference <= 3),
  
  -- Optional arrays
  hobbies TEXT[] DEFAULT '{}',
  interests TEXT[] DEFAULT '{}',
  
  -- Metadata
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure one quiz per student
  UNIQUE(student_id)
);

-- Create indexes
CREATE INDEX idx_quiz_answers_student_id ON quiz_answers(student_id);
CREATE INDEX idx_quiz_answers_submitted_at ON quiz_answers(submitted_at);
CREATE INDEX idx_quiz_answers_hobbies ON quiz_answers USING GIN(hobbies);
CREATE INDEX idx_quiz_answers_interests ON quiz_answers USING GIN(interests);

-- Add updated_at trigger
CREATE TRIGGER update_quiz_answers_updated_at
  BEFORE UPDATE ON quiz_answers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE quiz_answers ENABLE ROW LEVEL SECURITY;

-- Create permissive policy for demo purposes
CREATE POLICY "Allow all operations on quiz_answers" ON quiz_answers
  FOR ALL USING (true) WITH CHECK (true);

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON quiz_answers TO anon, authenticated;
