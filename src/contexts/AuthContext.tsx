// UniMatch Phase 2: Authentication and User Management
// React components for authentication

import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

// =============================================
// AUTHENTICATION CONTEXT
// =============================================

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// =============================================
// AUTHENTICATION PROVIDER
// =============================================

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [userRoles, setUserRoles] = useState([])
  const [userPermissions, setUserPermissions] = useState([])

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        loadUserRoles(session.user.id)
      }
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        if (session?.user) {
          await loadUserRoles(session.user.id)
        } else {
          setUserRoles([])
          setUserPermissions([])
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // Load user roles and permissions
  const loadUserRoles = async (userId) => {
    try {
      const { data, error } = await supabase
        .rpc('get_user_roles', { p_user_id: userId })
      
      if (error) throw error
      
      setUserRoles(data || [])
      
      // Extract permissions
      const permissions = new Set()
      data?.forEach(role => {
        Object.keys(role.permissions || {}).forEach(permission => {
          permissions.add(permission)
        })
      })
      setUserPermissions(Array.from(permissions))
    } catch (error) {
      console.error('Error loading user roles:', error)
    }
  }

  // Sign up with email and password
  const signUp = async (email, password, userData = {}) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      })
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // Sign in with email and password
  const signIn = async (email, password) => {
    try {
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

      return { success: true, data }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // Sign out
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      // Invalidate all sessions
      if (user) {
        await supabase.rpc('invalidate_user_sessions', {
          p_user_id: user.id
        })
      }
      
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // Reset password
  const resetPassword = async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })
      if (error) throw error
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // Update password
  const updatePassword = async (newPassword) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })
      if (error) throw error
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // Check if user has permission
  const hasPermission = (permission) => {
    return userPermissions.includes(permission) || userPermissions.includes('admin')
  }

  // Check if user has role
  const hasRole = (roleId) => {
    return userRoles.some(role => role.role_id === roleId)
  }

  // Get user preferences
  const getUserPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single()
      
      if (error && error.code !== 'PGRST116') throw error
      return { success: true, data: data || null }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // Update user preferences
  const updateUserPreferences = async (preferences) => {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          preferences: preferences.preferences || {},
          notification_settings: preferences.notification_settings || {},
          privacy_settings: preferences.privacy_settings || {}
        })
        .select()
        .single()
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // Create user session
  const createUserSession = async (deviceInfo = {}) => {
    try {
      const sessionToken = Math.random().toString(36).substring(2, 15) + 
                          Math.random().toString(36).substring(2, 15)
      
      const { data, error } = await supabase
        .rpc('create_user_session', {
          p_user_id: user.id,
          p_session_token: sessionToken,
          p_device_info: deviceInfo,
          p_ip_address: null, // Will be set by server
          p_user_agent: navigator.userAgent,
          p_location: {}
        })
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // Update session activity
  const updateSessionActivity = async (sessionToken) => {
    try {
      const { data, error } = await supabase
        .rpc('update_session_activity', {
          p_session_token: sessionToken
        })
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const value = {
    user,
    loading,
    userRoles,
    userPermissions,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    hasPermission,
    hasRole,
    getUserPreferences,
    updateUserPreferences,
    createUserSession,
    updateSessionActivity
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// =============================================
// PROTECTED ROUTE COMPONENT
// =============================================

export const ProtectedRoute = ({ children, requiredPermission = null, requiredRole = null }) => {
  const { user, loading, hasPermission, hasRole } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    )
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have the required role to access this page.</p>
        </div>
      </div>
    )
  }

  return children
}

// =============================================
// AUTHENTICATION HOOKS
// =============================================

// Hook for checking authentication status
export const useAuthStatus = () => {
  const { user, loading } = useAuth()
  return {
    isAuthenticated: !!user,
    isLoading: loading,
    user
  }
}

// Hook for checking permissions
export const usePermissions = () => {
  const { hasPermission, hasRole, userPermissions, userRoles } = useAuth()
  return {
    hasPermission,
    hasRole,
    permissions: userPermissions,
    roles: userRoles
  }
}

// Hook for user preferences
export const useUserPreferences = () => {
  const { user, getUserPreferences, updateUserPreferences } = useAuth()
  const [preferences, setPreferences] = useState(null)
  const [loading, setLoading] = useState(false)

  const loadPreferences = async () => {
    if (!user) return
    
    setLoading(true)
    const result = await getUserPreferences()
    if (result.success) {
      setPreferences(result.data)
    }
    setLoading(false)
  }

  const updatePreferences = async (newPreferences) => {
    if (!user) return
    
    setLoading(true)
    const result = await updateUserPreferences(newPreferences)
    if (result.success) {
      setPreferences(result.data)
    }
    setLoading(false)
    return result
  }

  useEffect(() => {
    loadPreferences()
  }, [user])

  return {
    preferences,
    loading,
    updatePreferences,
    reloadPreferences: loadPreferences
  }
}

// =============================================
// AUTHENTICATION UTILITIES
// =============================================

// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Password validation
export const validatePassword = (password) => {
  const minLength = 8
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumbers = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  return {
    isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar,
    errors: [
      password.length < minLength && `Password must be at least ${minLength} characters`,
      !hasUpperCase && 'Password must contain at least one uppercase letter',
      !hasLowerCase && 'Password must contain at least one lowercase letter',
      !hasNumbers && 'Password must contain at least one number',
      !hasSpecialChar && 'Password must contain at least one special character'
    ].filter(Boolean)
  }
}

// Generate secure password
export const generateSecurePassword = (length = 12) => {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
  let password = ''
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length))
  }
  return password
}

// Format user display name
export const formatUserDisplayName = (user) => {
  if (user.user_metadata?.first_name && user.user_metadata?.last_name) {
    return `${user.user_metadata.first_name} ${user.user_metadata.last_name}`
  }
  return user.email?.split('@')[0] || 'User'
}

// Get user avatar URL
export const getUserAvatarUrl = (user) => {
  if (user.user_metadata?.avatar_url) {
    return user.user_metadata.avatar_url
  }
  
  // Generate avatar from initials
  const name = formatUserDisplayName(user)
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase()
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=random&color=fff&size=200`
}

export default AuthContext
