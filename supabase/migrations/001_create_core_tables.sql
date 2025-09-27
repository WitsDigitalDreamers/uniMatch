-- UniMatch Database Migration Scripts
-- Phase 1: Core Database Setup

-- Migration 001: Create core tables
-- Run this first to set up the basic structure

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create schools table
CREATE TABLE IF NOT EXISTS schools (
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

-- Create universities table
CREATE TABLE IF NOT EXISTS universities (
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

-- Create residences table
CREATE TABLE IF NOT EXISTS residences (
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

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
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

-- Create students table
CREATE TABLE IF NOT EXISTS students (
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

-- Create bursaries table
CREATE TABLE IF NOT EXISTS bursaries (
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

-- Create careers table
CREATE TABLE IF NOT EXISTS careers (
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

-- Create offers table
CREATE TABLE IF NOT EXISTS offers (
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

-- Create student applications table
CREATE TABLE IF NOT EXISTS student_applications (
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

-- Create roommate matches table
CREATE TABLE IF NOT EXISTS roommate_matches (
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

-- Create bursary applications table
CREATE TABLE IF NOT EXISTS bursary_applications (
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

-- Create system tables
CREATE TABLE IF NOT EXISTS user_sessions (
  session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id TEXT REFERENCES students(id_number) ON DELETE CASCADE,
  session_data JSONB DEFAULT '{}',
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS system_logs (
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
