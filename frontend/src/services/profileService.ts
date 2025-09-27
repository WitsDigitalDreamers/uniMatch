import { supabase } from '@/lib/supabase';

export interface StudentProfile {
  profile_id?: string;
  student_id: string;
  
  // Personal Information
  date_of_birth?: string;
  gender?: string;
  contact_number?: string;
  citizenship?: string;
  home_address?: {
    province: string;
    city: string;
    suburb: string;
    postal_code: string;
  };
  
  // Education Information
  high_school_name?: string;
  high_school_address?: string;
  year_matriculated?: number;
  matric_type?: string;
  current_institution?: string;
  student_number?: string;
  qualification_name?: string;
  year_of_study?: string;
  
  // Academic Performance
  average_percentage?: number;
  aps_score?: number;
  subjects_passed?: number;
  subjects_failed?: number;
  subjects?: Array<{
    name: string;
    mark: number;
  }>;
  
  // Financial Information
  household_income?: string;
  parents_occupation?: string;
  number_of_dependents?: number;
  receiving_other_funding?: boolean;
  funding_source?: string;
  
  // Family/Guardian Information
  guardians?: Array<{
    full_name: string;
    contact_number: string;
    email: string;
    relationship: string;
    employment_status: string;
  }>;
  
  // Supporting Documents
  documents?: {
    id_copy?: string;
    matric_results?: string;
    proof_of_address?: string;
    proof_of_income?: string;
    curriculum_vitae?: string;
  };
  
  // Metadata
  created_at?: string;
  updated_at?: string;
}

class ProfileService {
  // Get profile for a student
  async getProfile(studentId: string): Promise<StudentProfile | null> {
    try {
      const { data, error } = await supabase
        .from('student_profiles')
        .select('*')
        .eq('student_id', studentId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  }

  // Create or update profile
  async saveProfile(profile: StudentProfile): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('student_profiles')
        .upsert(profile, {
          onConflict: 'student_id'
        });

      if (error) {
        console.error('Error saving profile:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error saving profile:', error);
      return false;
    }
  }

  // Update specific profile fields
  async updateProfile(studentId: string, updates: Partial<StudentProfile>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('student_profiles')
        .update(updates)
        .eq('student_id', studentId);

      if (error) {
        console.error('Error updating profile:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      return false;
    }
  }

  // Delete profile
  async deleteProfile(studentId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('student_profiles')
        .delete()
        .eq('student_id', studentId);

      if (error) {
        console.error('Error deleting profile:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error deleting profile:', error);
      return false;
    }
  }

  // Upload document file (placeholder - would need file storage service)
  async uploadDocument(file: File, documentType: string): Promise<string | null> {
    try {
      // This is a placeholder implementation
      // In a real app, you would upload to a file storage service like AWS S3, Cloudinary, etc.
      console.log('Uploading document:', file.name, 'Type:', documentType);
      
      // For now, return a mock URL
      const mockUrl = `https://example.com/documents/${Date.now()}_${file.name}`;
      return mockUrl;
    } catch (error) {
      console.error('Error uploading document:', error);
      return null;
    }
  }

  // Calculate APS score from subjects
  calculateAPS(subjects: Array<{ name: string; mark: number }>): number {
    const marks = subjects.map(s => s.mark);
    const topSeven = marks.sort((a, b) => b - a).slice(0, 7);
    
    return topSeven.reduce((total, mark) => {
      if (mark >= 80) return total + 7;
      if (mark >= 70) return total + 6;
      if (mark >= 60) return total + 5;
      if (mark >= 50) return total + 4;
      if (mark >= 40) return total + 3;
      if (mark >= 30) return total + 2;
      return total + 1;
    }, 0);
  }

  // Calculate average percentage from subjects
  calculateAveragePercentage(subjects: Array<{ name: string; mark: number }>): number {
    if (subjects.length === 0) return 0;
    const total = subjects.reduce((sum, subject) => sum + subject.mark, 0);
    return total / subjects.length;
  }

  // Count passed/failed subjects
  countSubjects(subjects: Array<{ name: string; mark: number }>): { passed: number; failed: number } {
    const passed = subjects.filter(s => s.mark >= 50).length;
    const failed = subjects.filter(s => s.mark < 50).length;
    return { passed, failed };
  }
}

export const profileService = new ProfileService();
