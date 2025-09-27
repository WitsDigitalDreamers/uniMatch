-- UniMatch Phase 2: Authentication and User Management
-- Database migrations for authentication features (CORRECTED)

-- Migration 005: Create authentication tables and functions
-- Run this after Phase 1 migrations

-- =============================================
-- USER ROLES AND PERMISSIONS
-- =============================================

-- User roles table
CREATE TABLE IF NOT EXISTS user_roles (
  role_id TEXT PRIMARY KEY,
  role_name TEXT NOT NULL UNIQUE,
  description TEXT,
  permissions JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User role assignments
CREATE TABLE IF NOT EXISTS user_role_assignments (
  assignment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id TEXT NOT NULL REFERENCES user_roles(role_id) ON DELETE CASCADE,
  assigned_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, role_id)
);

-- User sessions (enhanced)
CREATE TABLE IF NOT EXISTS user_sessions_enhanced (
  session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id TEXT REFERENCES students(id_number) ON DELETE CASCADE,
  session_token TEXT NOT NULL UNIQUE,
  device_info JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  location JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User preferences
CREATE TABLE IF NOT EXISTS user_preferences (
  preference_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  preferences JSONB NOT NULL DEFAULT '{}',
  notification_settings JSONB DEFAULT '{}',
  privacy_settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Email verification tokens
CREATE TABLE IF NOT EXISTS email_verification_tokens (
  token_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  token_type TEXT NOT NULL CHECK (token_type IN ('email_verification', 'password_reset', 'email_change')),
  email TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Login attempts tracking
CREATE TABLE IF NOT EXISTS login_attempts (
  attempt_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  ip_address INET,
  user_agent TEXT,
  success BOOLEAN NOT NULL,
  failure_reason TEXT,
  attempted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- INDEXES FOR AUTHENTICATION TABLES
-- =============================================

-- User roles indexes
CREATE INDEX IF NOT EXISTS idx_user_roles_name ON user_roles(role_name);
CREATE INDEX IF NOT EXISTS idx_user_role_assignments_user_id ON user_role_assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_user_role_assignments_role_id ON user_role_assignments(role_id);
CREATE INDEX IF NOT EXISTS idx_user_role_assignments_active ON user_role_assignments(is_active);
CREATE INDEX IF NOT EXISTS idx_user_role_assignments_expires ON user_role_assignments(expires_at);

-- Enhanced sessions indexes
CREATE INDEX IF NOT EXISTS idx_user_sessions_enhanced_user_id ON user_sessions_enhanced(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_enhanced_token ON user_sessions_enhanced(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_enhanced_active ON user_sessions_enhanced(is_active);
CREATE INDEX IF NOT EXISTS idx_user_sessions_enhanced_expires ON user_sessions_enhanced(expires_at);
CREATE INDEX IF NOT EXISTS idx_user_sessions_enhanced_last_activity ON user_sessions_enhanced(last_activity);

-- User preferences indexes
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_user_preferences_gin ON user_preferences USING GIN (preferences);
CREATE INDEX IF NOT EXISTS idx_user_preferences_notifications_gin ON user_preferences USING GIN (notification_settings);

-- Email verification indexes
CREATE INDEX IF NOT EXISTS idx_email_verification_tokens_user_id ON email_verification_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_email_verification_tokens_token ON email_verification_tokens(token);
CREATE INDEX IF NOT EXISTS idx_email_verification_tokens_type ON email_verification_tokens(token_type);
CREATE INDEX IF NOT EXISTS idx_email_verification_tokens_expires ON email_verification_tokens(expires_at);
CREATE INDEX IF NOT EXISTS idx_email_verification_tokens_email ON email_verification_tokens(email);

-- Login attempts indexes
CREATE INDEX IF NOT EXISTS idx_login_attempts_email ON login_attempts(email);
CREATE INDEX IF NOT EXISTS idx_login_attempts_ip ON login_attempts(ip_address);
CREATE INDEX IF NOT EXISTS idx_login_attempts_success ON login_attempts(success);
CREATE INDEX IF NOT EXISTS idx_login_attempts_attempted_at ON login_attempts(attempted_at);

-- =============================================
-- AUTHENTICATION FUNCTIONS
-- =============================================

-- Function to create user role
CREATE OR REPLACE FUNCTION create_user_role(
  p_role_id TEXT,
  p_role_name TEXT,
  p_permissions JSONB DEFAULT '{}',
  p_description TEXT DEFAULT NULL
)
RETURNS TEXT AS $$
BEGIN
  INSERT INTO user_roles (role_id, role_name, description, permissions)
  VALUES (p_role_id, p_role_name, p_description, p_permissions)
  ON CONFLICT (role_id) DO UPDATE SET
    role_name = EXCLUDED.role_name,
    description = EXCLUDED.description,
    permissions = EXCLUDED.permissions,
    updated_at = NOW();
  
  RETURN p_role_id;
END;
$$ LANGUAGE plpgsql;

-- Function to assign role to user
CREATE OR REPLACE FUNCTION assign_user_role(
  p_user_id UUID,
  p_role_id TEXT,
  p_assigned_by UUID DEFAULT NULL,
  p_expires_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  assignment_id UUID;
BEGIN
  INSERT INTO user_role_assignments (user_id, role_id, assigned_by, expires_at)
  VALUES (p_user_id, p_role_id, p_assigned_by, p_expires_at)
  ON CONFLICT (user_id, role_id) DO UPDATE SET
    assigned_by = EXCLUDED.assigned_by,
    expires_at = EXCLUDED.expires_at,
    is_active = true,
    updated_at = NOW()
  RETURNING assignment_id INTO assignment_id;
  
  RETURN assignment_id;
END;
$$ LANGUAGE plpgsql;

-- Function to check user permissions
CREATE OR REPLACE FUNCTION check_user_permission(
  p_user_id UUID,
  p_permission TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  has_permission BOOLEAN := false;
BEGIN
  SELECT EXISTS(
    SELECT 1
    FROM user_role_assignments ura
    JOIN user_roles ur ON ura.role_id = ur.role_id
    WHERE ura.user_id = p_user_id
      AND ura.is_active = true
      AND (ura.expires_at IS NULL OR ura.expires_at > NOW())
      AND (ur.permissions ? p_permission OR ur.permissions ? 'admin')
  ) INTO has_permission;
  
  RETURN has_permission;
END;
$$ LANGUAGE plpgsql;

-- Function to get user roles
CREATE OR REPLACE FUNCTION get_user_roles(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
  user_roles JSONB;
BEGIN
  SELECT jsonb_agg(
    jsonb_build_object(
      'role_id', ur.role_id,
      'role_name', ur.role_name,
      'description', ur.description,
      'permissions', ur.permissions,
      'assigned_at', ura.assigned_at,
      'expires_at', ura.expires_at
    )
  )
  INTO user_roles
  FROM user_role_assignments ura
  JOIN user_roles ur ON ura.role_id = ur.role_id
  WHERE ura.user_id = p_user_id
    AND ura.is_active = true
    AND (ura.expires_at IS NULL OR ura.expires_at > NOW());
  
  RETURN COALESCE(user_roles, '[]'::JSONB);
END;
$$ LANGUAGE plpgsql;

-- Function to create user session
CREATE OR REPLACE FUNCTION create_user_session(
  p_user_id UUID,
  p_session_token TEXT,
  p_device_info JSONB DEFAULT '{}',
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL,
  p_location JSONB DEFAULT '{}',
  p_expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days')
)
RETURNS UUID AS $$
DECLARE
  session_id UUID;
BEGIN
  INSERT INTO user_sessions_enhanced (
    user_id, session_token, device_info, ip_address, 
    user_agent, location, expires_at
  )
  VALUES (
    p_user_id, p_session_token, p_device_info, p_ip_address,
    p_user_agent, p_location, p_expires_at
  )
  RETURNING session_id INTO session_id;
  
  RETURN session_id;
END;
$$ LANGUAGE plpgsql;

-- Function to update session activity
CREATE OR REPLACE FUNCTION update_session_activity(
  p_session_token TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  updated BOOLEAN := false;
BEGIN
  UPDATE user_sessions_enhanced
  SET last_activity = NOW()
  WHERE session_token = p_session_token
    AND is_active = true
    AND expires_at > NOW();
  
  GET DIAGNOSTICS updated = ROW_COUNT;
  RETURN updated > 0;
END;
$$ LANGUAGE plpgsql;

-- Function to invalidate user sessions
CREATE OR REPLACE FUNCTION invalidate_user_sessions(
  p_user_id UUID,
  p_keep_current_session TEXT DEFAULT NULL
)
RETURNS INTEGER AS $$
DECLARE
  invalidated_count INTEGER;
BEGIN
  UPDATE user_sessions_enhanced
  SET is_active = false
  WHERE user_id = p_user_id
    AND (p_keep_current_session IS NULL OR session_token != p_keep_current_session);
  
  GET DIAGNOSTICS invalidated_count = ROW_COUNT;
  RETURN invalidated_count;
END;
$$ LANGUAGE plpgsql;

-- Function to log login attempt
CREATE OR REPLACE FUNCTION log_login_attempt(
  p_email TEXT,
  p_success BOOLEAN,
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL,
  p_failure_reason TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  attempt_id UUID;
BEGIN
  INSERT INTO login_attempts (
    email, ip_address, user_agent, success, failure_reason
  )
  VALUES (
    p_email, p_ip_address, p_user_agent, p_success, p_failure_reason
  )
  RETURNING attempt_id INTO attempt_id;
  
  RETURN attempt_id;
END;
$$ LANGUAGE plpgsql;

-- Function to check login rate limiting
CREATE OR REPLACE FUNCTION check_login_rate_limit(
  p_email TEXT,
  p_ip_address INET DEFAULT NULL,
  p_max_attempts INTEGER DEFAULT 5,
  p_window_minutes INTEGER DEFAULT 15
)
RETURNS BOOLEAN AS $$
DECLARE
  attempt_count INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO attempt_count
  FROM login_attempts
  WHERE email = p_email
    AND (p_ip_address IS NULL OR ip_address = p_ip_address)
    AND success = false
    AND attempted_at > (NOW() - INTERVAL '1 minute' * p_window_minutes);
  
  RETURN attempt_count < p_max_attempts;
END;
$$ LANGUAGE plpgsql;

-- Function to create email verification token
CREATE OR REPLACE FUNCTION create_email_verification_token(
  p_user_id UUID,
  p_email TEXT,
  p_token_type TEXT DEFAULT 'email_verification',
  p_expires_hours INTEGER DEFAULT 24
)
RETURNS TEXT AS $$
DECLARE
  token TEXT;
BEGIN
  -- Generate random token
  token := encode(gen_random_bytes(32), 'hex');
  
  INSERT INTO email_verification_tokens (
    user_id, token, token_type, email, expires_at
  )
  VALUES (
    p_user_id, token, p_token_type, p_email, 
    NOW() + INTERVAL '1 hour' * p_expires_hours
  );
  
  RETURN token;
END;
$$ LANGUAGE plpgsql;

-- Function to verify email token
CREATE OR REPLACE FUNCTION verify_email_token(
  p_token TEXT,
  p_token_type TEXT DEFAULT 'email_verification'
)
RETURNS JSONB AS $$
DECLARE
  token_record RECORD;
  result JSONB;
BEGIN
  SELECT * INTO token_record
  FROM email_verification_tokens
  WHERE token = p_token
    AND token_type = p_token_type
    AND expires_at > NOW()
    AND used_at IS NULL;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('valid', false, 'error', 'Invalid or expired token');
  END IF;
  
  -- Mark token as used
  UPDATE email_verification_tokens
  SET used_at = NOW()
  WHERE token = p_token;
  
  RETURN jsonb_build_object(
    'valid', true,
    'user_id', token_record.user_id,
    'email', token_record.email
  );
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- TRIGGERS FOR AUTHENTICATION TABLES
-- =============================================

-- Apply updated_at triggers
CREATE TRIGGER update_user_roles_updated_at BEFORE UPDATE ON user_roles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_role_assignments_updated_at BEFORE UPDATE ON user_role_assignments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- INITIAL ROLE DATA
-- =============================================

-- Insert default roles
INSERT INTO user_roles (role_id, role_name, description, permissions) VALUES
('student', 'Student', 'Regular student user', '{"read_own_data": true, "update_own_profile": true, "apply_courses": true, "view_offers": true}'),
('admin', 'Administrator', 'System administrator', '{"admin": true, "manage_users": true, "manage_data": true, "view_all_data": true}'),
('university_admin', 'University Administrator', 'University staff member', '{"manage_university_data": true, "view_applications": true, "manage_offers": true}'),
('school_admin', 'School Administrator', 'High school staff member', '{"manage_school_data": true, "view_student_data": true, "manage_students": true}')
ON CONFLICT (role_id) DO UPDATE SET
  role_name = EXCLUDED.role_name,
  description = EXCLUDED.description,
  permissions = EXCLUDED.permissions,
  updated_at = NOW();

-- =============================================
-- COMMENTS FOR DOCUMENTATION
-- =============================================

COMMENT ON TABLE user_roles IS 'User roles and their permissions';
COMMENT ON TABLE user_role_assignments IS 'User role assignments with expiration';
COMMENT ON TABLE user_sessions_enhanced IS 'Enhanced user session tracking';
COMMENT ON TABLE user_preferences IS 'User preferences and settings';
COMMENT ON TABLE email_verification_tokens IS 'Email verification and password reset tokens';
COMMENT ON TABLE login_attempts IS 'Login attempt tracking for security';

COMMENT ON FUNCTION create_user_role(TEXT, TEXT, JSONB, TEXT) IS 'Creates or updates a user role';
COMMENT ON FUNCTION assign_user_role(UUID, TEXT, UUID, TIMESTAMP WITH TIME ZONE) IS 'Assigns a role to a user';
COMMENT ON FUNCTION check_user_permission(UUID, TEXT) IS 'Checks if user has specific permission';
COMMENT ON FUNCTION get_user_roles(UUID) IS 'Gets all active roles for a user';
COMMENT ON FUNCTION create_user_session(UUID, TEXT, JSONB, INET, TEXT, JSONB, TIMESTAMP WITH TIME ZONE) IS 'Creates a new user session';
COMMENT ON FUNCTION update_session_activity(TEXT) IS 'Updates session last activity timestamp';
COMMENT ON FUNCTION invalidate_user_sessions(UUID, TEXT) IS 'Invalidates all user sessions except current';
COMMENT ON FUNCTION log_login_attempt(TEXT, BOOLEAN, INET, TEXT, TEXT) IS 'Logs a login attempt for security tracking';
COMMENT ON FUNCTION check_login_rate_limit(TEXT, INET, INTEGER, INTEGER) IS 'Checks if login attempts are within rate limits';
COMMENT ON FUNCTION create_email_verification_token(UUID, TEXT, TEXT, INTEGER) IS 'Creates email verification token';
COMMENT ON FUNCTION verify_email_token(TEXT, TEXT) IS 'Verifies email verification token';
