-- UniMatch Phase 2: Authentication and User Management
-- RLS policies for authentication tables

-- Migration 006: Create RLS policies for authentication
-- Run this after creating auth tables

-- =============================================
-- ENABLE RLS ON AUTHENTICATION TABLES
-- =============================================

ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_role_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions_enhanced ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_verification_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_attempts ENABLE ROW LEVEL SECURITY;

-- =============================================
-- USER ROLES POLICIES
-- =============================================

-- Public read access to roles (for UI display)
CREATE POLICY "Public can view roles" ON user_roles
  FOR SELECT USING (true);

-- Only admins can manage roles
CREATE POLICY "Admins can manage roles" ON user_roles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_role_assignments ura
      JOIN user_roles ur ON ura.role_id = ur.role_id
      WHERE ura.user_id = auth.uid()
        AND ura.is_active = true
        AND (ura.expires_at IS NULL OR ura.expires_at > NOW())
        AND (ur.permissions ? 'admin' OR ur.permissions ? 'manage_users')
    )
  );

-- =============================================
-- USER ROLE ASSIGNMENTS POLICIES
-- =============================================

-- Users can view their own role assignments
CREATE POLICY "Users can view own role assignments" ON user_role_assignments
  FOR SELECT USING (user_id = auth.uid());

-- Only admins can manage role assignments
CREATE POLICY "Admins can manage role assignments" ON user_role_assignments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_role_assignments ura
      JOIN user_roles ur ON ura.role_id = ur.role_id
      WHERE ura.user_id = auth.uid()
        AND ura.is_active = true
        AND (ura.expires_at IS NULL OR ura.expires_at > NOW())
        AND (ur.permissions ? 'admin' OR ur.permissions ? 'manage_users')
    )
  );

-- =============================================
-- USER SESSIONS POLICIES
-- =============================================

-- Users can view their own sessions
CREATE POLICY "Users can view own sessions" ON user_sessions_enhanced
  FOR SELECT USING (user_id = auth.uid());

-- Users can update their own sessions
CREATE POLICY "Users can update own sessions" ON user_sessions_enhanced
  FOR UPDATE USING (user_id = auth.uid());

-- Users can insert their own sessions
CREATE POLICY "Users can insert own sessions" ON user_sessions_enhanced
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Users can delete their own sessions
CREATE POLICY "Users can delete own sessions" ON user_sessions_enhanced
  FOR DELETE USING (user_id = auth.uid());

-- Admins can view all sessions
CREATE POLICY "Admins can view all sessions" ON user_sessions_enhanced
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_role_assignments ura
      JOIN user_roles ur ON ura.role_id = ur.role_id
      WHERE ura.user_id = auth.uid()
        AND ura.is_active = true
        AND (ura.expires_at IS NULL OR ura.expires_at > NOW())
        AND (ur.permissions ? 'admin' OR ur.permissions ? 'manage_users')
    )
  );

-- =============================================
-- USER PREFERENCES POLICIES
-- =============================================

-- Users can view their own preferences
CREATE POLICY "Users can view own preferences" ON user_preferences
  FOR SELECT USING (user_id = auth.uid());

-- Users can update their own preferences
CREATE POLICY "Users can update own preferences" ON user_preferences
  FOR UPDATE USING (user_id = auth.uid());

-- Users can insert their own preferences
CREATE POLICY "Users can insert own preferences" ON user_preferences
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- =============================================
-- EMAIL VERIFICATION TOKENS POLICIES
-- =============================================

-- Users can view their own verification tokens
CREATE POLICY "Users can view own verification tokens" ON email_verification_tokens
  FOR SELECT USING (user_id = auth.uid());

-- Users can insert their own verification tokens
CREATE POLICY "Users can insert own verification tokens" ON email_verification_tokens
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Users can update their own verification tokens
CREATE POLICY "Users can update own verification tokens" ON email_verification_tokens
  FOR UPDATE USING (user_id = auth.uid());

-- Public can verify tokens (for email verification)
CREATE POLICY "Public can verify tokens" ON email_verification_tokens
  FOR SELECT USING (true);

-- =============================================
-- LOGIN ATTEMPTS POLICIES
-- =============================================

-- Only admins can view login attempts
CREATE POLICY "Admins can view login attempts" ON login_attempts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_role_assignments ura
      JOIN user_roles ur ON ura.role_id = ur.role_id
      WHERE ura.user_id = auth.uid()
        AND ura.is_active = true
        AND (ura.expires_at IS NULL OR ura.expires_at > NOW())
        AND (ur.permissions ? 'admin' OR ur.permissions ? 'manage_users')
    )
  );

-- System can insert login attempts (for security tracking)
CREATE POLICY "System can insert login attempts" ON login_attempts
  FOR INSERT WITH CHECK (true);

-- =============================================
-- ENHANCED STUDENT POLICIES
-- =============================================

-- Drop existing student policies to recreate with enhanced permissions
DROP POLICY IF EXISTS "Students can view own data" ON students;
DROP POLICY IF EXISTS "Students can update own data" ON students;
DROP POLICY IF EXISTS "Students can insert own data" ON students;

-- Enhanced student policies with role-based access
CREATE POLICY "Students can view own data" ON students
  FOR SELECT USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM user_role_assignments ura
      JOIN user_roles ur ON ura.role_id = ur.role_id
      WHERE ura.user_id = auth.uid()
        AND ura.is_active = true
        AND (ura.expires_at IS NULL OR ura.expires_at > NOW())
        AND (ur.permissions ? 'admin' OR ur.permissions ? 'view_all_data' OR ur.permissions ? 'manage_students')
    )
  );

CREATE POLICY "Students can update own data" ON students
  FOR UPDATE USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM user_role_assignments ura
      JOIN user_roles ur ON ura.role_id = ur.role_id
      WHERE ura.user_id = auth.uid()
        AND ura.is_active = true
        AND (ura.expires_at IS NULL OR ura.expires_at > NOW())
        AND (ur.permissions ? 'admin' OR ur.permissions ? 'manage_students')
    )
  );

CREATE POLICY "Students can insert own data" ON students
  FOR INSERT WITH CHECK (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM user_role_assignments ura
      JOIN user_roles ur ON ura.role_id = ur.role_id
      WHERE ura.user_id = auth.uid()
        AND ura.is_active = true
        AND (ura.expires_at IS NULL OR ura.expires_at > NOW())
        AND (ur.permissions ? 'admin' OR ur.permissions ? 'manage_students')
    )
  );

-- =============================================
-- ENHANCED OFFER POLICIES
-- =============================================

-- Drop existing offer policies to recreate with enhanced permissions
DROP POLICY IF EXISTS "Students can view own offers" ON offers;
DROP POLICY IF EXISTS "Students can update own offers" ON offers;

-- Enhanced offer policies
CREATE POLICY "Students can view own offers" ON offers
  FOR SELECT USING (
    student_id IN (
      SELECT id_number FROM students WHERE user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM user_role_assignments ura
      JOIN user_roles ur ON ura.role_id = ur.role_id
      WHERE ura.user_id = auth.uid()
        AND ura.is_active = true
        AND (ura.expires_at IS NULL OR ura.expires_at > NOW())
        AND (ur.permissions ? 'admin' OR ur.permissions ? 'view_all_data' OR ur.permissions ? 'manage_offers')
    )
  );

CREATE POLICY "Students can update own offers" ON offers
  FOR UPDATE USING (
    student_id IN (
      SELECT id_number FROM students WHERE user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM user_role_assignments ura
      JOIN user_roles ur ON ura.role_id = ur.role_id
      WHERE ura.user_id = auth.uid()
        AND ura.is_active = true
        AND (ura.expires_at IS NULL OR ura.expires_at > NOW())
        AND (ur.permissions ? 'admin' OR ur.permissions ? 'manage_offers')
    )
  );

-- =============================================
-- ENHANCED APPLICATION POLICIES
-- =============================================

-- Drop existing application policies to recreate with enhanced permissions
DROP POLICY IF EXISTS "Students can view own applications" ON student_applications;
DROP POLICY IF EXISTS "Students can insert own applications" ON student_applications;
DROP POLICY IF EXISTS "Students can update own applications" ON student_applications;

-- Enhanced application policies
CREATE POLICY "Students can view own applications" ON student_applications
  FOR SELECT USING (
    student_id IN (
      SELECT id_number FROM students WHERE user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM user_role_assignments ura
      JOIN user_roles ur ON ura.role_id = ur.role_id
      WHERE ura.user_id = auth.uid()
        AND ura.is_active = true
        AND (ura.expires_at IS NULL OR ura.expires_at > NOW())
        AND (ur.permissions ? 'admin' OR ur.permissions ? 'view_all_data' OR ur.permissions ? 'view_applications')
    )
  );

CREATE POLICY "Students can insert own applications" ON student_applications
  FOR INSERT WITH CHECK (
    student_id IN (
      SELECT id_number FROM students WHERE user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM user_role_assignments ura
      JOIN user_roles ur ON ura.role_id = ur.role_id
      WHERE ura.user_id = auth.uid()
        AND ura.is_active = true
        AND (ura.expires_at IS NULL OR ura.expires_at > NOW())
        AND (ur.permissions ? 'admin' OR ur.permissions ? 'manage_applications')
    )
  );

CREATE POLICY "Students can update own applications" ON student_applications
  FOR UPDATE USING (
    student_id IN (
      SELECT id_number FROM students WHERE user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM user_role_assignments ura
      JOIN user_roles ur ON ura.role_id = ur.role_id
      WHERE ura.user_id = auth.uid()
        AND ura.is_active = true
        AND (ura.expires_at IS NULL OR ura.expires_at > NOW())
        AND (ur.permissions ? 'admin' OR ur.permissions ? 'manage_applications')
    )
  );

-- =============================================
-- ENHANCED BURSARY APPLICATION POLICIES
-- =============================================

-- Drop existing bursary application policies to recreate with enhanced permissions
DROP POLICY IF EXISTS "Students can view own bursary applications" ON bursary_applications;
DROP POLICY IF EXISTS "Students can insert own bursary applications" ON bursary_applications;
DROP POLICY IF EXISTS "Students can update own bursary applications" ON bursary_applications;

-- Enhanced bursary application policies
CREATE POLICY "Students can view own bursary applications" ON bursary_applications
  FOR SELECT USING (
    student_id IN (
      SELECT id_number FROM students WHERE user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM user_role_assignments ura
      JOIN user_roles ur ON ura.role_id = ur.role_id
      WHERE ura.user_id = auth.uid()
        AND ura.is_active = true
        AND (ura.expires_at IS NULL OR ura.expires_at > NOW())
        AND (ur.permissions ? 'admin' OR ur.permissions ? 'view_all_data')
    )
  );

CREATE POLICY "Students can insert own bursary applications" ON bursary_applications
  FOR INSERT WITH CHECK (
    student_id IN (
      SELECT id_number FROM students WHERE user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM user_role_assignments ura
      JOIN user_roles ur ON ura.role_id = ur.role_id
      WHERE ura.user_id = auth.uid()
        AND ura.is_active = true
        AND (ura.expires_at IS NULL OR ura.expires_at > NOW())
        AND (ur.permissions ? 'admin' OR ur.permissions ? 'manage_bursaries')
    )
  );

CREATE POLICY "Students can update own bursary applications" ON bursary_applications
  FOR UPDATE USING (
    student_id IN (
      SELECT id_number FROM students WHERE user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM user_role_assignments ura
      JOIN user_roles ur ON ura.role_id = ur.role_id
      WHERE ura.user_id = auth.uid()
        AND ura.is_active = true
        AND (ura.expires_at IS NULL OR ura.expires_at > NOW())
        AND (ur.permissions ? 'admin' OR ur.permissions ? 'manage_bursaries')
    )
  );

-- =============================================
-- ENHANCED ROOMMATE MATCH POLICIES
-- =============================================

-- Drop existing roommate match policies to recreate with enhanced permissions
DROP POLICY IF EXISTS "Students can view own roommate matches" ON roommate_matches;
DROP POLICY IF EXISTS "Students can update own roommate matches" ON roommate_matches;
DROP POLICY IF EXISTS "Students can insert roommate matches" ON roommate_matches;

-- Enhanced roommate match policies
CREATE POLICY "Students can view own roommate matches" ON roommate_matches
  FOR SELECT USING (
    student1_id IN (
      SELECT id_number FROM students WHERE user_id = auth.uid()
    ) OR student2_id IN (
      SELECT id_number FROM students WHERE user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM user_role_assignments ura
      JOIN user_roles ur ON ura.role_id = ur.role_id
      WHERE ura.user_id = auth.uid()
        AND ura.is_active = true
        AND (ura.expires_at IS NULL OR ura.expires_at > NOW())
        AND (ur.permissions ? 'admin' OR ur.permissions ? 'view_all_data')
    )
  );

CREATE POLICY "Students can update own roommate matches" ON roommate_matches
  FOR UPDATE USING (
    student1_id IN (
      SELECT id_number FROM students WHERE user_id = auth.uid()
    ) OR student2_id IN (
      SELECT id_number FROM students WHERE user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM user_role_assignments ura
      JOIN user_roles ur ON ura.role_id = ur.role_id
      WHERE ura.user_id = auth.uid()
        AND ura.is_active = true
        AND (ura.expires_at IS NULL OR ura.expires_at > NOW())
        AND (ur.permissions ? 'admin' OR ur.permissions ? 'manage_matches')
    )
  );

CREATE POLICY "Students can insert roommate matches" ON roommate_matches
  FOR INSERT WITH CHECK (
    student1_id IN (
      SELECT id_number FROM students WHERE user_id = auth.uid()
    ) OR student2_id IN (
      SELECT id_number FROM students WHERE user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM user_role_assignments ura
      JOIN user_roles ur ON ura.role_id = ur.role_id
      WHERE ura.user_id = auth.uid()
        AND ura.is_active = true
        AND (ura.expires_at IS NULL OR ura.expires_at > NOW())
        AND (ur.permissions ? 'admin' OR ur.permissions ? 'manage_matches')
    )
  );

-- =============================================
-- COMMENTS FOR DOCUMENTATION
-- =============================================

COMMENT ON POLICY "Public can view roles" ON user_roles IS 'Allows public to view available roles for UI display';
COMMENT ON POLICY "Admins can manage roles" ON user_roles IS 'Only admins can create, update, or delete roles';
COMMENT ON POLICY "Users can view own role assignments" ON user_role_assignments IS 'Users can view their own role assignments';
COMMENT ON POLICY "Admins can manage role assignments" ON user_role_assignments IS 'Only admins can assign or revoke roles';
COMMENT ON POLICY "Users can view own sessions" ON user_sessions_enhanced IS 'Users can view their own active sessions';
COMMENT ON POLICY "Admins can view all sessions" ON user_sessions_enhanced IS 'Admins can view all user sessions for monitoring';
COMMENT ON POLICY "Users can view own preferences" ON user_preferences IS 'Users can view and manage their own preferences';
COMMENT ON POLICY "Public can verify tokens" ON email_verification_tokens IS 'Allows public verification of email tokens';
COMMENT ON POLICY "Admins can view login attempts" ON login_attempts IS 'Admins can view login attempts for security monitoring';
COMMENT ON POLICY "System can insert login attempts" ON login_attempts IS 'System can log login attempts for security tracking';
