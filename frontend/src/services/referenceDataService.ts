// Phase 3: Reference Data Integration Service
// Comprehensive service for managing all reference data operations

import { supabase } from '../../../lib/supabase';
import type { 
  University, 
  Course, 
  School, 
  Bursary, 
  Residence, 
  Career 
} from '@/types';

export class ReferenceDataService {
  // ==================== UNIVERSITIES ====================
  
  static async getAllUniversities(): Promise<University[]> {
    try {
      const { data, error } = await supabase
        .from('universities')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching universities:', error);
      throw error;
    }
  }

  static async getUniversityById(id: string): Promise<University | null> {
    try {
      const { data, error } = await supabase
        .from('universities')
        .select('*')
        .eq('university_id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching university:', error);
      return null;
    }
  }

  static async searchUniversities(searchTerm: string): Promise<University[]> {
    try {
      const { data, error } = await supabase
        .from('universities')
        .select('*')
        .or(`name.ilike.%${searchTerm}%, location.ilike.%${searchTerm}%, province.ilike.%${searchTerm}%`)
        .order('name');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error searching universities:', error);
      throw error;
    }
  }

  static async getUniversitiesByProvince(province: string): Promise<University[]> {
    try {
      const { data, error } = await supabase
        .from('universities')
        .select('*')
        .eq('province', province)
        .order('name');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching universities by province:', error);
      throw error;
    }
  }

  static async getProvinces(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('universities')
        .select('province')
        .order('province');
      
      if (error) throw error;
      const provinces = [...new Set(data?.map(u => u.province) || [])] as string[];
      return provinces;
    } catch (error) {
      console.error('Error fetching provinces:', error);
      throw error;
    }
  }

  // ==================== COURSES ====================

  static async getAllCourses(): Promise<Course[]> {
    try {
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
        .order('name');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  }

  static async getCourseById(id: string): Promise<Course | null> {
    try {
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
        .eq('course_id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching course:', error);
      return null;
    }
  }

  static async getCoursesByUniversity(universityId: string): Promise<Course[]> {
    try {
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
        .order('name');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching courses by university:', error);
      throw error;
    }
  }

  static async getCoursesByFaculty(faculty: string): Promise<Course[]> {
    try {
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
        .order('name');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching courses by faculty:', error);
      throw error;
    }
  }

  static async searchCourses(searchTerm: string): Promise<Course[]> {
    try {
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
        .or(`name.ilike.%${searchTerm}%, faculty.ilike.%${searchTerm}%`)
        .order('name');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error searching courses:', error);
      throw error;
    }
  }

  static async getCoursesByAPSRange(minAPS: number, maxAPS: number): Promise<Course[]> {
    try {
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
        .order('points_required');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching courses by APS range:', error);
      throw error;
    }
  }

  static async getCoursesByCostRange(minCost: number, maxCost: number): Promise<Course[]> {
    try {
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
        .order('estimated_cost');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching courses by cost range:', error);
      throw error;
    }
  }

  static async getFaculties(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('faculty')
        .order('faculty');
      
      if (error) throw error;
      const faculties = [...new Set(data?.map(c => c.faculty) || [])] as string[];
      return faculties;
    } catch (error) {
      console.error('Error fetching faculties:', error);
      throw error;
    }
  }

  // ==================== SCHOOLS ====================

  static async getAllSchools(): Promise<School[]> {
    try {
      const { data, error } = await supabase
        .from('schools')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching schools:', error);
      throw error;
    }
  }

  static async getSchoolById(id: string): Promise<School | null> {
    try {
      const { data, error } = await supabase
        .from('schools')
        .select('*')
        .eq('school_id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching school:', error);
      return null;
    }
  }

  static async getSchoolsByProvince(province: string): Promise<School[]> {
    try {
      const { data, error } = await supabase
        .from('schools')
        .select('*')
        .eq('province', province)
        .order('name');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching schools by province:', error);
      throw error;
    }
  }

  static async getPartnerSchools(): Promise<School[]> {
    try {
      const { data, error } = await supabase
        .from('schools')
        .select('*')
        .eq('is_partner', true)
        .order('name');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching partner schools:', error);
      throw error;
    }
  }

  // ==================== BURSARIES ====================

  static async getAllBursaries(): Promise<Bursary[]> {
    try {
      const { data, error } = await supabase
        .from('bursaries')
        .select('*')
        .order('deadline');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching bursaries:', error);
      throw error;
    }
  }

  static async getBursaryById(id: string): Promise<Bursary | null> {
    try {
      const { data, error } = await supabase
        .from('bursaries')
        .select('*')
        .eq('bursary_id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching bursary:', error);
      return null;
    }
  }

  static async getBursariesByFaculty(faculty: string): Promise<Bursary[]> {
    try {
      const { data, error } = await supabase
        .from('bursaries')
        .select('*')
        .contains('eligibility->faculties', [faculty])
        .order('deadline');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching bursaries by faculty:', error);
      throw error;
    }
  }

  static async getBursariesByAPS(minAPS: number): Promise<Bursary[]> {
    try {
      const { data, error } = await supabase
        .from('bursaries')
        .select('*')
        .lte('eligibility->minimum_aps', minAPS)
        .order('deadline');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching bursaries by APS:', error);
      throw error;
    }
  }

  static async getActiveBursaries(): Promise<Bursary[]> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('bursaries')
        .select('*')
        .gte('deadline', today)
        .order('deadline');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching active bursaries:', error);
      throw error;
    }
  }

  // ==================== RESIDENCES ====================

  static async getAllResidences(): Promise<Residence[]> {
    try {
      const { data, error } = await supabase
        .from('residences')
        .select(`
          *,
          universities (
            name,
            location,
            province
          )
        `)
        .order('name');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching residences:', error);
      throw error;
    }
  }

  static async getResidenceById(id: string): Promise<Residence | null> {
    try {
      const { data, error } = await supabase
        .from('residences')
        .select(`
          *,
          universities (
            name,
            location,
            province
          )
        `)
        .eq('residence_id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching residence:', error);
      return null;
    }
  }

  static async getResidencesByUniversity(universityId: string): Promise<Residence[]> {
    try {
      const { data, error } = await supabase
        .from('residences')
        .select(`
          *,
          universities (
            name,
            location,
            province
          )
        `)
        .eq('university_id', universityId)
        .eq('availability_status', 'Available')
        .order('price_per_month');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching residences by university:', error);
      throw error;
    }
  }

  static async getResidencesByGender(gender: 'male' | 'female' | 'mixed'): Promise<Residence[]> {
    try {
      const { data, error } = await supabase
        .from('residences')
        .select(`
          *,
          universities (
            name,
            location,
            province
          )
        `)
        .eq('gender', gender)
        .eq('availability_status', 'Available')
        .order('price_per_month');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching residences by gender:', error);
      throw error;
    }
  }

  static async getResidencesByPriceRange(minPrice: number, maxPrice: number): Promise<Residence[]> {
    try {
      const { data, error } = await supabase
        .from('residences')
        .select(`
          *,
          universities (
            name,
            location,
            province
          )
        `)
        .gte('price_per_month', minPrice)
        .lte('price_per_month', maxPrice)
        .eq('availability_status', 'Available')
        .order('price_per_month');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching residences by price range:', error);
      throw error;
    }
  }

  // ==================== CAREERS ====================

  static async getAllCareers(): Promise<Career[]> {
    try {
      const { data, error } = await supabase
        .from('careers')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching careers:', error);
      throw error;
    }
  }

  static async getCareerById(id: string): Promise<Career | null> {
    try {
      const { data, error } = await supabase
        .from('careers')
        .select('*')
        .eq('career_id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching career:', error);
      return null;
    }
  }

  static async getCareersByCategory(category: string): Promise<Career[]> {
    try {
      const { data, error } = await supabase
        .from('careers')
        .select('*')
        .eq('category', category)
        .order('name');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching careers by category:', error);
      throw error;
    }
  }

  static async searchCareers(searchTerm: string): Promise<Career[]> {
    try {
      const { data, error } = await supabase
        .from('careers')
        .select('*')
        .or(`name.ilike.%${searchTerm}%, description.ilike.%${searchTerm}%, category.ilike.%${searchTerm}%`)
        .order('name');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error searching careers:', error);
      throw error;
    }
  }

  static async getCareerCategories(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('careers')
        .select('category')
        .order('category');
      
      if (error) throw error;
      const categories = [...new Set(data?.map(c => c.category) || [])] as string[];
      return categories;
    } catch (error) {
      console.error('Error fetching career categories:', error);
      throw error;
    }
  }

  // ==================== STATISTICS ====================

  static async getReferenceDataStats(): Promise<{
    universities: number;
    courses: number;
    schools: number;
    bursaries: number;
    residences: number;
    careers: number;
  }> {
    try {
      const [
        universitiesCount,
        coursesCount,
        schoolsCount,
        bursariesCount,
        residencesCount,
        careersCount
      ] = await Promise.all([
        supabase.from('universities').select('count', { count: 'exact', head: true }),
        supabase.from('courses').select('count', { count: 'exact', head: true }),
        supabase.from('schools').select('count', { count: 'exact', head: true }),
        supabase.from('bursaries').select('count', { count: 'exact', head: true }),
        supabase.from('residences').select('count', { count: 'exact', head: true }),
        supabase.from('careers').select('count', { count: 'exact', head: true })
      ]);

      return {
        universities: universitiesCount.count || 0,
        courses: coursesCount.count || 0,
        schools: schoolsCount.count || 0,
        bursaries: bursariesCount.count || 0,
        residences: residencesCount.count || 0,
        careers: careersCount.count || 0
      };
    } catch (error) {
      console.error('Error fetching reference data stats:', error);
      throw error;
    }
  }

  // ==================== CACHING ====================

  private static cache = new Map<string, { data: any; timestamp: number }>();
  private static CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  static async getCachedData<T>(
    key: string, 
    fetchFunction: () => Promise<T>
  ): Promise<T> {
    const cached = this.cache.get(key);
    const now = Date.now();

    if (cached && (now - cached.timestamp) < this.CACHE_DURATION) {
      return cached.data;
    }

    const data = await fetchFunction();
    this.cache.set(key, { data, timestamp: now });
    return data;
  }

  static clearCache(): void {
    this.cache.clear();
  }

  static clearCacheByKey(key: string): void {
    this.cache.delete(key);
  }
}

// Export individual functions for convenience
export const {
  getAllUniversities,
  getUniversityById,
  searchUniversities,
  getUniversitiesByProvince,
  getProvinces,
  getAllCourses,
  getCourseById,
  getCoursesByUniversity,
  getCoursesByFaculty,
  searchCourses,
  getCoursesByAPSRange,
  getCoursesByCostRange,
  getFaculties,
  getAllSchools,
  getSchoolById,
  getSchoolsByProvince,
  getPartnerSchools,
  getAllBursaries,
  getBursaryById,
  getBursariesByFaculty,
  getBursariesByAPS,
  getActiveBursaries,
  getAllResidences,
  getResidenceById,
  getResidencesByUniversity,
  getResidencesByGender,
  getResidencesByPriceRange,
  getAllCareers,
  getCareerById,
  getCareersByCategory,
  searchCareers,
  getCareerCategories,
  getReferenceDataStats
} = ReferenceDataService;
