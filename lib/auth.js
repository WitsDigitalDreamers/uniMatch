// UniMatch Phase 2: Enhanced Supabase Client
// Authentication and user management utilities

import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey)

// =============================================
// AUTHENTICATION SERVICE
// =============================================

export class AuthService {
  // Get current user
  static async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  }

  // Sign up new user
  static async signUp(email, password, userData = {}) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })
    if (error) throw error
    return data
  }

  // Sign in user
  static async signIn(email, password) {
    // Check rate limiting
    const { data: rateLimitCheck } = await supabase
      .rpc('check_login_rate_limit', { 
        p_email: email,
        p_max_attempts: 5,
        p_window_minutes: 15
      })
    
    if (!rateLimitCheck) {
      throw new Error('Too many login attempts. Please try again later.')
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) {
      // Log failed attempt
      await supabase.rpc('log_login_attempt', {
        p_email: email,
        p_success: false,
        p_failure_reason: error.message
      })
      throw error
    }

    // Log successful attempt
    await supabase.rpc('log_login_attempt', {
      p_email: email,
      p_success: true
    })

    return data
  }

  // Sign out user
  static async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  // Reset password
  static async resetPassword(email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    })
    if (error) throw error
  }

  // Update password
  static async updatePassword(newPassword) {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    })
    if (error) throw error
  }

  // Update user metadata
  static async updateUserMetadata(metadata) {
    const { error } = await supabase.auth.updateUser({
      data: metadata
    })
    if (error) throw error
  }

  // Verify email
  static async verifyEmail(token) {
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: 'email'
    })
    if (error) throw error
    return data
  }
}

// =============================================
// USER MANAGEMENT SERVICE
// =============================================

export class UserManagementService {
  // Get user roles
  static async getUserRoles(userId) {
    const { data, error } = await supabase
      .rpc('get_user_roles', { p_user_id: userId })
    
    if (error) throw error
    return data
  }

  // Assign role to user
  static async assignUserRole(userId, roleId, assignedBy = null, expiresAt = null) {
    const { data, error } = await supabase
      .rpc('assign_user_role', {
        p_user_id: userId,
        p_role_id: roleId,
        p_assigned_by: assignedBy,
        p_expires_at: expiresAt
      })
    
    if (error) throw error
    return data
  }

  // Remove role from user
  static async removeUserRole(userId, roleId) {
    const { data, error } = await supabase
      .from('user_role_assignments')
      .update({ is_active: false })
      .eq('user_id', userId)
      .eq('role_id', roleId)
      .select()
    
    if (error) throw error
    return data
  }

  // Check user permission
  static async checkUserPermission(userId, permission) {
    const { data, error } = await supabase
      .rpc('check_user_permission', {
        p_user_id: userId,
        p_permission: permission
      })
    
    if (error) throw error
    return data
  }

  // Get all users (admin only)
  static async getAllUsers() {
    const { data, error } = await supabase
      .from('auth.users')
      .select('*')
    
    if (error) throw error
    return data
  }

  // Get user by ID
  static async getUserById(userId) {
    const { data, error } = await supabase
      .from('auth.users')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) throw error
    return data
  }

  // Update user status
  static async updateUserStatus(userId, status) {
    const { data, error } = await supabase
      .from('auth.users')
      .update({ status })
      .eq('id', userId)
      .select()
    
    if (error) throw error
    return data
  }
}

// =============================================
// SESSION MANAGEMENT SERVICE
// =============================================

export class SessionManagementService {
  // Create user session
  static async createUserSession(userId, deviceInfo = {}) {
    const sessionToken = Math.random().toString(36).substring(2, 15) + 
                        Math.random().toString(36).substring(2, 15)
    
    const { data, error } = await supabase
      .rpc('create_user_session', {
        p_user_id: userId,
        p_session_token: sessionToken,
        p_device_info: deviceInfo,
        p_ip_address: null, // Will be set by server
        p_user_agent: navigator.userAgent,
        p_location: {}
      })
    
    if (error) throw error
    return data
  }

  // Update session activity
  static async updateSessionActivity(sessionToken) {
    const { data, error } = await supabase
      .rpc('update_session_activity', {
        p_session_token: sessionToken
      })
    
    if (error) throw error
    return data
  }

  // Get user sessions
  static async getUserSessions(userId) {
    const { data, error } = await supabase
      .from('user_sessions_enhanced')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('last_activity', { ascending: false })
    
    if (error) throw error
    return data
  }

  // Invalidate user sessions
  static async invalidateUserSessions(userId, keepCurrentSession = null) {
    const { data, error } = await supabase
      .rpc('invalidate_user_sessions', {
        p_user_id: userId,
        p_keep_current_session: keepCurrentSession
      })
    
    if (error) throw error
    return data
  }

  // Delete session
  static async deleteSession(sessionId) {
    const { data, error } = await supabase
      .from('user_sessions_enhanced')
      .delete()
      .eq('session_id', sessionId)
      .select()
    
    if (error) throw error
    return data
  }
}

// =============================================
// USER PREFERENCES SERVICE
// =============================================

export class UserPreferencesService {
  // Get user preferences
  static async getUserPreferences(userId) {
    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  }

  // Update user preferences
  static async updateUserPreferences(userId, preferences) {
    const { data, error } = await supabase
      .from('user_preferences')
      .upsert({
        user_id: userId,
        preferences: preferences.preferences || {},
        notification_settings: preferences.notification_settings || {},
        privacy_settings: preferences.privacy_settings || {}
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Update notification settings
  static async updateNotificationSettings(userId, settings) {
    const { data, error } = await supabase
      .from('user_preferences')
      .upsert({
        user_id: userId,
        notification_settings: settings
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Update privacy settings
  static async updatePrivacySettings(userId, settings) {
    const { data, error } = await supabase
      .from('user_preferences')
      .upsert({
        user_id: userId,
        privacy_settings: settings
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}

// =============================================
// EMAIL VERIFICATION SERVICE
// =============================================

export class EmailVerificationService {
  // Create email verification token
  static async createEmailVerificationToken(userId, email, tokenType = 'email_verification', expiresHours = 24) {
    const { data, error } = await supabase
      .rpc('create_email_verification_token', {
        p_user_id: userId,
        p_email: email,
        p_token_type: tokenType,
        p_expires_hours: expiresHours
      })
    
    if (error) throw error
    return data
  }

  // Verify email token
  static async verifyEmailToken(token, tokenType = 'email_verification') {
    const { data, error } = await supabase
      .rpc('verify_email_token', {
        p_token: token,
        p_token_type: tokenType
      })
    
    if (error) throw error
    return data
  }

  // Get verification tokens for user
  static async getUserVerificationTokens(userId) {
    const { data, error } = await supabase
      .from('email_verification_tokens')
      .select('*')
      .eq('user_id', userId)
      .eq('used_at', null)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }

  // Clean expired tokens
  static async cleanExpiredTokens() {
    const { data, error } = await supabase
      .from('email_verification_tokens')
      .delete()
      .lt('expires_at', new Date().toISOString())
      .select()
    
    if (error) throw error
    return data
  }
}

// =============================================
// SECURITY SERVICE
// =============================================

export class SecurityService {
  // Log login attempt
  static async logLoginAttempt(email, success, ipAddress = null, userAgent = null, failureReason = null) {
    const { data, error } = await supabase
      .rpc('log_login_attempt', {
        p_email: email,
        p_success: success,
        p_ip_address: ipAddress,
        p_user_agent: userAgent,
        p_failure_reason: failureReason
      })
    
    if (error) throw error
    return data
  }

  // Check login rate limit
  static async checkLoginRateLimit(email, ipAddress = null, maxAttempts = 5, windowMinutes = 15) {
    const { data, error } = await supabase
      .rpc('check_login_rate_limit', {
        p_email: email,
        p_ip_address: ipAddress,
        p_max_attempts: maxAttempts,
        p_window_minutes: windowMinutes
      })
    
    if (error) throw error
    return data
  }

  // Get login attempts
  static async getLoginAttempts(email = null, ipAddress = null, limit = 100) {
    let query = supabase
      .from('login_attempts')
      .select('*')
      .order('attempted_at', { ascending: false })
      .limit(limit)

    if (email) {
      query = query.eq('email', email)
    }

    if (ipAddress) {
      query = query.eq('ip_address', ipAddress)
    }

    const { data, error } = await query
    
    if (error) throw error
    return data
  }

  // Get security statistics
  static async getSecurityStats() {
    const { data, error } = await supabase
      .from('login_attempts')
      .select('success, attempted_at')
      .gte('attempted_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
    
    if (error) throw error
    
    const stats = {
      totalAttempts: data.length,
      successfulAttempts: data.filter(attempt => attempt.success).length,
      failedAttempts: data.filter(attempt => !attempt.success).length,
      successRate: data.length > 0 ? (data.filter(attempt => attempt.success).length / data.length) * 100 : 0
    }
    
    return stats
  }
}

// =============================================
// ROLE MANAGEMENT SERVICE
// =============================================

export class RoleManagementService {
  // Create user role
  static async createUserRole(roleId, roleName, permissions = {}, description = null) {
    const { data, error } = await supabase
      .rpc('create_user_role', {
        p_role_id: roleId,
        p_role_name: roleName,
        p_permissions: permissions,
        p_description: description
      })
    
    if (error) throw error
    return data
  }

  // Get all roles
  static async getAllRoles() {
    const { data, error } = await supabase
      .from('user_roles')
      .select('*')
      .order('role_name')
    
    if (error) throw error
    return data
  }

  // Get role by ID
  static async getRoleById(roleId) {
    const { data, error } = await supabase
      .from('user_roles')
      .select('*')
      .eq('role_id', roleId)
      .single()
    
    if (error) throw error
    return data
  }

  // Update role permissions
  static async updateRolePermissions(roleId, permissions) {
    const { data, error } = await supabase
      .from('user_roles')
      .update({ permissions })
      .eq('role_id', roleId)
      .select()
    
    if (error) throw error
    return data
  }

  // Delete role
  static async deleteRole(roleId) {
    const { data, error } = await supabase
      .from('user_roles')
      .delete()
      .eq('role_id', roleId)
      .select()
    
    if (error) throw error
    return data
  }

  // Get role assignments
  static async getRoleAssignments(roleId = null) {
    let query = supabase
      .from('user_role_assignments')
      .select(`
        *,
        user_roles (*),
        assigned_by_user:auth.users!assigned_by (*)
      `)
      .eq('is_active', true)
      .order('assigned_at', { ascending: false })

    if (roleId) {
      query = query.eq('role_id', roleId)
    }

    const { data, error } = await query
    
    if (error) throw error
    return data
  }
}

// =============================================
// UTILITY FUNCTIONS
// =============================================

// Error handling utility
export function handleSupabaseError(error) {
  console.error('Supabase Error:', error)
  
  if (error.code === 'PGRST116') {
    return 'No data found'
  }
  
  if (error.code === '23505') {
    return 'This record already exists'
  }
  
  if (error.code === '23503') {
    return 'Referenced record does not exist'
  }
  
  if (error.code === '42501') {
    return 'Permission denied'
  }
  
  if (error.code === 'PGRST301') {
    return 'Too many requests'
  }
  
  return error.message || 'An unexpected error occurred'
}

// Format user display name
export function formatUserDisplayName(user) {
  if (user.user_metadata?.first_name && user.user_metadata?.last_name) {
    return `${user.user_metadata.first_name} ${user.user_metadata.last_name}`
  }
  return user.email?.split('@')[0] || 'User'
}

// Get user avatar URL
export function getUserAvatarUrl(user) {
  if (user.user_metadata?.avatar_url) {
    return user.user_metadata.avatar_url
  }
  
  // Generate avatar from initials
  const name = formatUserDisplayName(user)
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase()
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=random&color=fff&size=200`
}

// Check if user is admin
export function isAdmin(userRoles) {
  return userRoles.some(role => 
    role.role_id === 'admin' || 
    role.permissions?.admin === true
  )
}

// Check if user has permission
export function hasPermission(userRoles, permission) {
  return userRoles.some(role => 
    role.permissions?.[permission] === true || 
    role.permissions?.admin === true
  )
}

// Export default
export default supabase
