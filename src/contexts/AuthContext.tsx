import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Student, students } from '@/data/mockData';

interface AuthContextType {
  student: Student | null;
  login: (idNumber: string, username: string) => Promise<boolean>;
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
      } catch (error) {
        console.error('Error parsing student data:', error);
        localStorage.removeItem('student_token');
        localStorage.removeItem('student_data');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (idNumber: string, username: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const foundStudent = students.find(
      s => s.id_number === idNumber && s.username === username
    );
    
    if (foundStudent) {
      // Generate mock token
      const token = `mock_token_${Date.now()}_${foundStudent.id_number}`;
      
      // Store in localStorage
      localStorage.setItem('student_token', token);
      localStorage.setItem('student_data', JSON.stringify(foundStudent));
      
      setStudent(foundStudent);
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    localStorage.removeItem('student_token');
    localStorage.removeItem('student_data');
    setStudent(null);
  };

  const value = {
    student,
    login,
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