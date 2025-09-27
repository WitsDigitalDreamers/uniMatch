-- UniMatch Database Migration Scripts
-- Phase 1: Create functions and triggers

-- Migration 003: Create functions and triggers
-- Run this after creating tables and indexes

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

-- Function to generate roommate compatibility score
CREATE OR REPLACE FUNCTION calculate_roommate_compatibility(student1_id TEXT, student2_id TEXT)
RETURNS DECIMAL(5,2) AS $$
DECLARE
  student1_quiz JSONB;
  student2_quiz JSONB;
  compatibility_score DECIMAL(5,2) := 0;
  total_weight INTEGER := 0;
  field TEXT;
  weight INTEGER;
  value1 INTEGER;
  value2 INTEGER;
  difference INTEGER;
  max_difference INTEGER;
  field_compatibility DECIMAL(5,2);
BEGIN
  -- Get quiz answers for both students
  SELECT quiz_answers INTO student1_quiz FROM students WHERE id_number = student1_id;
  SELECT quiz_answers INTO student2_quiz FROM students WHERE id_number = student2_id;
  
  -- If either student hasn't completed the quiz, return 0
  IF student1_quiz IS NULL OR student2_quiz IS NULL THEN
    RETURN 0;
  END IF;
  
  -- Define lifestyle factors with weights
  -- Study habits, cleanliness, social level, sleep schedule, etc.
  
  -- For now, return a placeholder score
  -- This will be implemented with the actual quiz structure
  RETURN 75.0;
END;
$$ LANGUAGE plpgsql;

-- Function to log system activities
CREATE OR REPLACE FUNCTION log_system_activity(
  p_user_id UUID,
  p_action TEXT,
  p_table_name TEXT DEFAULT NULL,
  p_record_id TEXT DEFAULT NULL,
  p_old_values JSONB DEFAULT NULL,
  p_new_values JSONB DEFAULT NULL,
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO system_logs (
    user_id,
    action,
    table_name,
    record_id,
    old_values,
    new_values,
    ip_address,
    user_agent
  ) VALUES (
    p_user_id,
    p_action,
    p_table_name,
    p_record_id,
    p_old_values,
    p_new_values,
    p_ip_address,
    p_user_agent
  );
END;
$$ LANGUAGE plpgsql;

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

-- Add comments for documentation
COMMENT ON FUNCTION calculate_aps(JSONB) IS 'Calculates Admission Point Score from student marks';
COMMENT ON FUNCTION check_course_eligibility(TEXT, TEXT) IS 'Checks if student meets course requirements';
COMMENT ON FUNCTION get_student_qualification_report(TEXT) IS 'Generates comprehensive qualification report for student';
COMMENT ON FUNCTION calculate_roommate_compatibility(TEXT, TEXT) IS 'Calculates compatibility score between two students for roommate matching';
COMMENT ON FUNCTION log_system_activity(UUID, TEXT, TEXT, TEXT, JSONB, JSONB, INET, TEXT) IS 'Logs system activities for audit purposes';
