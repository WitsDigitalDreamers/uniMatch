-- UniMatch Database Migration Scripts
-- Phase 1: Create indexes and performance optimizations

-- Migration 002: Create indexes for performance
-- Run this after creating the core tables

-- Primary indexes
CREATE INDEX IF NOT EXISTS idx_students_user_id ON students(user_id);
CREATE INDEX IF NOT EXISTS idx_students_school_id ON students(school_id);
CREATE INDEX IF NOT EXISTS idx_students_email ON students(email);
CREATE INDEX IF NOT EXISTS idx_students_profile_completed ON students(profile_completed);

CREATE INDEX IF NOT EXISTS idx_courses_university_id ON courses(university_id);
CREATE INDEX IF NOT EXISTS idx_courses_faculty ON courses(faculty);
CREATE INDEX IF NOT EXISTS idx_courses_qualification_type ON courses(qualification_type);
CREATE INDEX IF NOT EXISTS idx_courses_nqf_level ON courses(nqf_level);

CREATE INDEX IF NOT EXISTS idx_offers_student_id ON offers(student_id);
CREATE INDEX IF NOT EXISTS idx_offers_status ON offers(status);
CREATE INDEX IF NOT EXISTS idx_offers_deadline ON offers(deadline);
CREATE INDEX IF NOT EXISTS idx_offers_course_id ON offers(course_id);

CREATE INDEX IF NOT EXISTS idx_residences_university_id ON residences(university_id);
CREATE INDEX IF NOT EXISTS idx_residences_gender ON residences(gender);
CREATE INDEX IF NOT EXISTS idx_residences_availability ON residences(availability_status);

CREATE INDEX IF NOT EXISTS idx_applications_student_id ON student_applications(student_id);
CREATE INDEX IF NOT EXISTS idx_applications_course_id ON student_applications(course_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON student_applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_date ON student_applications(application_date);

CREATE INDEX IF NOT EXISTS idx_bursary_applications_student_id ON bursary_applications(student_id);
CREATE INDEX IF NOT EXISTS idx_bursary_applications_bursary_id ON bursary_applications(bursary_id);
CREATE INDEX IF NOT EXISTS idx_bursary_applications_status ON bursary_applications(status);

CREATE INDEX IF NOT EXISTS idx_roommate_matches_student1 ON roommate_matches(student1_id);
CREATE INDEX IF NOT EXISTS idx_roommate_matches_student2 ON roommate_matches(student2_id);
CREATE INDEX IF NOT EXISTS idx_roommate_matches_status ON roommate_matches(status);
CREATE INDEX IF NOT EXISTS idx_roommate_matches_score ON roommate_matches(compatibility_score);

-- JSONB indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_students_marks_gin ON students USING GIN (marks);
CREATE INDEX IF NOT EXISTS idx_students_quiz_answers_gin ON students USING GIN (quiz_answers);
CREATE INDEX IF NOT EXISTS idx_courses_requirements_gin ON courses USING GIN (requirements);
CREATE INDEX IF NOT EXISTS idx_bursaries_eligibility_gin ON bursaries USING GIN (eligibility);
CREATE INDEX IF NOT EXISTS idx_careers_salary_gin ON careers USING GIN (average_salary);

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_offers_student_status ON offers(student_id, status);
CREATE INDEX IF NOT EXISTS idx_applications_student_status ON student_applications(student_id, status);
CREATE INDEX IF NOT EXISTS idx_courses_university_faculty ON courses(university_id, faculty);

-- Additional performance indexes
CREATE INDEX IF NOT EXISTS idx_schools_province ON schools(province);
CREATE INDEX IF NOT EXISTS idx_schools_type ON schools(type);
CREATE INDEX IF NOT EXISTS idx_universities_province ON universities(province);
CREATE INDEX IF NOT EXISTS idx_universities_type ON universities(university_type);
CREATE INDEX IF NOT EXISTS idx_bursaries_deadline ON bursaries(deadline);
CREATE INDEX IF NOT EXISTS idx_bursaries_provider ON bursaries(provider);
CREATE INDEX IF NOT EXISTS idx_careers_category ON careers(category);
CREATE INDEX IF NOT EXISTS idx_careers_outlook ON careers(job_market_outlook);

-- Partial indexes for active records
CREATE INDEX IF NOT EXISTS idx_active_offers ON offers(student_id, status) 
  WHERE status IN ('pending', 'accepted');

CREATE INDEX IF NOT EXISTS idx_active_applications ON student_applications(student_id, status) 
  WHERE status IN ('submitted', 'under_review', 'waitlisted');

CREATE INDEX IF NOT EXISTS idx_available_residences ON residences(university_id, gender) 
  WHERE availability_status = 'Available';

-- Text search indexes
CREATE INDEX IF NOT EXISTS idx_courses_name_trgm ON courses USING GIN (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_universities_name_trgm ON universities USING GIN (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_careers_name_trgm ON careers USING GIN (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_bursaries_name_trgm ON bursaries USING GIN (name gin_trgm_ops);

-- Enable trigram extension for text search
CREATE EXTENSION IF NOT EXISTS pg_trgm;
