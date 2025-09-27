import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { Student } from '@/types';
import { offersService } from '@/services/offersService';

interface AuthContextType {
  student: Student | null;
  login: (idNumber: string, username: string) => Promise<boolean>;
  signup: (studentData: Omit<Student, 'id_number'> & { id_number: string }) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [student, setStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const token = localStorage.getItem('student_token');
    const studentData = localStorage.getItem('student_data');
    
    if (token && studentData) {
      try {
        const parsedStudent = JSON.parse(studentData);
        setStudent(parsedStudent);
        
        // Generate offers if they don't exist
        const existingOffers = offersService.getOffers(parsedStudent.id_number);
        if (existingOffers.length === 0) {
          // Generate sample applications and offers
          offersService.generateSampleApplications(parsedStudent);
          const offers = offersService.generateOffersFromApplications(parsedStudent);
          offersService.saveOffers(parsedStudent.id_number, offers);
        }
      } catch (error) {
        console.error('Error parsing student data:', error);
        localStorage.removeItem('student_token');
        localStorage.removeItem('student_data');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (idNumber: string, username: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Query the students table to find matching student
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('id_number', idNumber)
        .eq('username', username)
        .single();

      if (error || !data) {
        console.error('Login error:', error?.message || 'Student not found');
        return false;
      }

      // Generate session token
      const token = `student_token_${Date.now()}_${data.id_number}`;
      
      // Store in localStorage
      localStorage.setItem('student_token', token);
      localStorage.setItem('student_data', JSON.stringify(data));
      
      setStudent(data as Student);
      
      // Generate offers if they don't exist
      const existingOffers = offersService.getOffers(data.id_number);
      if (existingOffers.length === 0) {
        // Generate sample applications and offers
        offersService.generateSampleApplications(data as Student);
        const offers = offersService.generateOffersFromApplications(data as Student);
        offersService.saveOffers(data.id_number, offers);
      }
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (
    studentData: Omit<Student, 'id_number'> & { id_number: string }
  ): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Check if student already exists
      const { data: existingStudent } = await supabase
        .from('students')
        .select('id_number, username')
        .or(`id_number.eq.${studentData.id_number},username.eq.${studentData.username}`)
        .single();

      if (existingStudent) {
        console.error('Student already exists with this ID or username');
        return false;
      }

      // Create student record
      const { data, error } = await supabase
        .from('students')
        .insert({
          id_number: studentData.id_number,
          username: studentData.username,
          first_name: studentData.first_name,
          last_name: studentData.last_name,
          email: studentData.email,
          school_id: studentData.school_id,
          marks: studentData.marks,
          preferred_residences: studentData.preferred_residences || [],
        })
        .select()
        .single();

      if (error) {
        console.error('Student creation error:', error);
        return false;
      }

      if (!data) {
        return false;
      }

      // Generate session token
      const token = `student_token_${Date.now()}_${data.id_number}`;
      
      // Store in localStorage
      localStorage.setItem('student_token', token);
      localStorage.setItem('student_data', JSON.stringify(data));
      
      setStudent(data as Student);
      
      // Generate sample applications and offers for new student
      offersService.generateSampleApplications(data as Student);
      const offers = offersService.generateOffersFromApplications(data as Student);
      offersService.saveOffers(data.id_number, offers);
      
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('student_token');
    localStorage.removeItem('student_data');
    setStudent(null);
  };

  const value = {
    student,
    login,
    signup,
    logout,
    isAuthenticated: !!student,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};