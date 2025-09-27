// UniMatch Phase 1: Database Setup Complete
// Supabase client configuration and utility functions

import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey)

// Database utility functions
export class DatabaseService {
  // Test database connection
  static async testConnection() {
    try {
      const { data, error } = await supabase
        .from('universities')
        .select('count')
        .limit(1)
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // Get all universities
  static async getUniversities() {
    const { data, error } = await supabase
      .from('universities')
      .select('*')
      .order('name')
    
    if (error) throw error
    return data
  }

  // Get all courses
  static async getCourses() {
    const { data, error } = await supabase
      .from('courses')
      .select(`
        *,
        universities (
          name,
          location,
          province
        )
      `)
      .order('name')
    
    if (error) throw error
    return data
  }

  // Get courses by university
  static async getCoursesByUniversity(universityId) {
    const { data, error } = await supabase
      .from('courses')
      .select(`
        *,
        universities (
          name,
          location,
          province
        )
      `)
      .eq('university_id', universityId)
      .order('name')
    
    if (error) throw error
    return data
  }

  // Get courses by faculty
  static async getCoursesByFaculty(faculty) {
    const { data, error } = await supabase
      .from('courses')
      .select(`
        *,
        universities (
          name,
          location,
          province
        )
      `)
      .ilike('faculty', `%${faculty}%`)
      .order('name')
    
    if (error) throw error
    return data
  }

  // Get all schools
  static async getSchools() {
    const { data, error } = await supabase
      .from('schools')
      .select('*')
      .order('name')
    
    if (error) throw error
    return data
  }

  // Get all bursaries
  static async getBursaries() {
    const { data, error } = await supabase
      .from('bursaries')
      .select('*')
      .order('deadline')
    
    if (error) throw error
    return data
  }

  // Get all careers
  static async getCareers() {
    const { data, error } = await supabase
      .from('careers')
      .select('*')
      .order('name')
    
    if (error) throw error
    return data
  }

  // Get residences by university
  static async getResidencesByUniversity(universityId) {
    const { data, error } = await supabase
      .from('residences')
      .select('*')
      .eq('university_id', universityId)
      .eq('availability_status', 'Available')
      .order('price_per_month')
    
    if (error) throw error
    return data
  }

  // Calculate APS score using database function
  static async calculateAPS(marks) {
    const { data, error } = await supabase
      .rpc('calculate_aps', { marks })
    
    if (error) throw error
    return data
  }

  // Check course eligibility using database function
  static async checkCourseEligibility(studentId, courseId) {
    const { data, error } = await supabase
      .rpc('check_course_eligibility', { 
        student_id: studentId, 
        course_id: courseId 
      })
    
    if (error) throw error
    return data
  }

  // Get student qualification report using database function
  static async getStudentQualificationReport(studentId) {
    const { data, error } = await supabase
      .rpc('get_student_qualification_report', { 
        student_id: studentId 
      })
    
    if (error) throw error
    return data
  }

  // Search courses by name
  static async searchCourses(searchTerm) {
    const { data, error } = await supabase
      .from('courses')
      .select(`
        *,
        universities (
          name,
          location,
          province
        )
      `)
      .ilike('name', `%${searchTerm}%`)
      .order('name')
    
    if (error) throw error
    return data
  }

  // Search universities by name
  static async searchUniversities(searchTerm) {
    const { data, error } = await supabase
      .from('universities')
      .select('*')
      .ilike('name', `%${searchTerm}%`)
      .order('name')
    
    if (error) throw error
    return data
  }

  // Get courses within APS range
  static async getCoursesWithinAPSRange(minAPS, maxAPS) {
    const { data, error } = await supabase
      .from('courses')
      .select(`
        *,
        universities (
          name,
          location,
          province
        )
      `)
      .gte('points_required', minAPS)
      .lte('points_required', maxAPS)
      .order('points_required')
    
    if (error) throw error
    return data
  }

  // Get courses by cost range
  static async getCoursesByCostRange(minCost, maxCost) {
    const { data, error } = await supabase
      .from('courses')
      .select(`
        *,
        universities (
          name,
          location,
          province
        )
      `)
      .gte('estimated_cost', minCost)
      .lte('estimated_cost', maxCost)
      .order('estimated_cost')
    
    if (error) throw error
    return data
  }

  // Get statistics
  static async getDatabaseStats() {
    try {
      const [
        universitiesCount,
        coursesCount,
        schoolsCount,
        bursariesCount,
        careersCount
      ] = await Promise.all([
        supabase.from('universities').select('count', { count: 'exact', head: true }),
        supabase.from('courses').select('count', { count: 'exact', head: true }),
        supabase.from('schools').select('count', { count: 'exact', head: true }),
        supabase.from('bursaries').select('count', { count: 'exact', head: true }),
        supabase.from('careers').select('count', { count: 'exact', head: true })
      ])

      return {
        universities: universitiesCount.count || 0,
        courses: coursesCount.count || 0,
        schools: schoolsCount.count || 0,
        bursaries: bursariesCount.count || 0,
        careers: careersCount.count || 0
      }
    } catch (error) {
      throw error
    }
  }
}

// Authentication helpers
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
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) throw error
    return data
  }

  // Sign out user
  static async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  // Reset password
  static async resetPassword(email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    if (error) throw error
  }
}

// Real-time subscriptions
export class RealtimeService {
  // Subscribe to student updates
  static subscribeToStudent(studentId, callback) {
    return supabase
      .channel('student-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'students',
        filter: `id_number=eq.${studentId}`
      }, callback)
      .subscribe()
  }

  // Subscribe to offer updates
  static subscribeToOffers(studentId, callback) {
    return supabase
      .channel('offers-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'offers',
        filter: `student_id=eq.${studentId}`
      }, callback)
      .subscribe()
  }

  // Subscribe to application updates
  static subscribeToApplications(studentId, callback) {
    return supabase
      .channel('applications-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'student_applications',
        filter: `student_id=eq.${studentId}`
      }, callback)
      .subscribe()
  }
}

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
  
  return error.message || 'An unexpected error occurred'
}

// Export default
export default supabase
