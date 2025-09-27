// Phase 3: Reference Data Integration Hooks
// React hooks for managing reference data state and operations

import { useState, useEffect, useCallback } from 'react';
import { ReferenceDataService } from '@/services/referenceDataService';
import type { 
  University, 
  Course, 
  School, 
  Bursary, 
  Residence, 
  Career 
} from '@/types';

// ==================== UNIVERSITIES HOOKS ====================

export const useUniversities = () => {
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUniversities = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ReferenceDataService.getAllUniversities();
      setUniversities(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch universities');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUniversities();
  }, [fetchUniversities]);

  return {
    universities,
    loading,
    error,
    refetch: fetchUniversities
  };
};

export const useUniversity = (id: string) => {
  const [university, setUniversity] = useState<University | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUniversity = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await ReferenceDataService.getUniversityById(id);
      setUniversity(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch university');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchUniversity();
  }, [fetchUniversity]);

  return {
    university,
    loading,
    error,
    refetch: fetchUniversity
  };
};

export const useUniversitySearch = (searchTerm: string) => {
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchUniversities = useCallback(async (term: string) => {
    if (!term.trim()) {
      setUniversities([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await ReferenceDataService.searchUniversities(term);
      setUniversities(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search universities');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchUniversities(searchTerm);
    }, 300); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [searchTerm, searchUniversities]);

  return {
    universities,
    loading,
    error,
    search: searchUniversities
  };
};

// ==================== COURSES HOOKS ====================

export const useCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ReferenceDataService.getAllCourses();
      setCourses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return {
    courses,
    loading,
    error,
    refetch: fetchCourses
  };
};

export const useCourse = (id: string) => {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourse = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await ReferenceDataService.getCourseById(id);
      setCourse(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch course');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCourse();
  }, [fetchCourse]);

  return {
    course,
    loading,
    error,
    refetch: fetchCourse
  };
};

export const useCoursesByUniversity = (universityId: string) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = useCallback(async () => {
    if (!universityId) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await ReferenceDataService.getCoursesByUniversity(universityId);
      setCourses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  }, [universityId]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return {
    courses,
    loading,
    error,
    refetch: fetchCourses
  };
};

export const useCoursesByFaculty = (faculty: string) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = useCallback(async () => {
    if (!faculty) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await ReferenceDataService.getCoursesByFaculty(faculty);
      setCourses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  }, [faculty]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return {
    courses,
    loading,
    error,
    refetch: fetchCourses
  };
};

export const useCourseSearch = (searchTerm: string) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchCourses = useCallback(async (term: string) => {
    if (!term.trim()) {
      setCourses([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await ReferenceDataService.searchCourses(term);
      setCourses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search courses');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchCourses(searchTerm);
    }, 300); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [searchTerm, searchCourses]);

  return {
    courses,
    loading,
    error,
    search: searchCourses
  };
};

// ==================== SCHOOLS HOOKS ====================

export const useSchools = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSchools = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ReferenceDataService.getAllSchools();
      setSchools(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch schools');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSchools();
  }, [fetchSchools]);

  return {
    schools,
    loading,
    error,
    refetch: fetchSchools
  };
};

export const usePartnerSchools = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSchools = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ReferenceDataService.getPartnerSchools();
      setSchools(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch partner schools');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSchools();
  }, [fetchSchools]);

  return {
    schools,
    loading,
    error,
    refetch: fetchSchools
  };
};

// ==================== BURSARIES HOOKS ====================

export const useBursaries = () => {
  const [bursaries, setBursaries] = useState<Bursary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBursaries = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ReferenceDataService.getAllBursaries();
      setBursaries(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch bursaries');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBursaries();
  }, [fetchBursaries]);

  return {
    bursaries,
    loading,
    error,
    refetch: fetchBursaries
  };
};

export const useActiveBursaries = () => {
  const [bursaries, setBursaries] = useState<Bursary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBursaries = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ReferenceDataService.getActiveBursaries();
      setBursaries(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch active bursaries');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBursaries();
  }, [fetchBursaries]);

  return {
    bursaries,
    loading,
    error,
    refetch: fetchBursaries
  };
};

// ==================== RESIDENCES HOOKS ====================

export const useResidences = () => {
  const [residences, setResidences] = useState<Residence[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchResidences = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ReferenceDataService.getAllResidences();
      setResidences(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch residences');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResidences();
  }, [fetchResidences]);

  return {
    residences,
    loading,
    error,
    refetch: fetchResidences
  };
};

export const useResidencesByUniversity = (universityId: string) => {
  const [residences, setResidences] = useState<Residence[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchResidences = useCallback(async () => {
    if (!universityId) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await ReferenceDataService.getResidencesByUniversity(universityId);
      setResidences(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch residences');
    } finally {
      setLoading(false);
    }
  }, [universityId]);

  useEffect(() => {
    fetchResidences();
  }, [fetchResidences]);

  return {
    residences,
    loading,
    error,
    refetch: fetchResidences
  };
};

// ==================== CAREERS HOOKS ====================

export const useCareers = () => {
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCareers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ReferenceDataService.getAllCareers();
      setCareers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch careers');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCareers();
  }, [fetchCareers]);

  return {
    careers,
    loading,
    error,
    refetch: fetchCareers
  };
};

export const useCareersByCategory = (category: string) => {
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCareers = useCallback(async () => {
    if (!category) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await ReferenceDataService.getCareersByCategory(category);
      setCareers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch careers');
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    fetchCareers();
  }, [fetchCareers]);

  return {
    careers,
    loading,
    error,
    refetch: fetchCareers
  };
};

export const useCareerSearch = (searchTerm: string) => {
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchCareers = useCallback(async (term: string) => {
    if (!term.trim()) {
      setCareers([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await ReferenceDataService.searchCareers(term);
      setCareers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search careers');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchCareers(searchTerm);
    }, 300); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [searchTerm, searchCareers]);

  return {
    careers,
    loading,
    error,
    search: searchCareers
  };
};

// ==================== UTILITY HOOKS ====================

export const useReferenceDataStats = () => {
  const [stats, setStats] = useState<{
    universities: number;
    courses: number;
    schools: number;
    bursaries: number;
    residences: number;
    careers: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ReferenceDataService.getReferenceDataStats();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  };
};

export const useFaculties = () => {
  const [faculties, setFaculties] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFaculties = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ReferenceDataService.getFaculties();
      setFaculties(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch faculties');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFaculties();
  }, [fetchFaculties]);

  return {
    faculties,
    loading,
    error,
    refetch: fetchFaculties
  };
};

export const useProvinces = () => {
  const [provinces, setProvinces] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProvinces = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ReferenceDataService.getProvinces();
      setProvinces(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch provinces');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProvinces();
  }, [fetchProvinces]);

  return {
    provinces,
    loading,
    error,
    refetch: fetchProvinces
  };
};

export const useCareerCategories = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ReferenceDataService.getCareerCategories();
      setCategories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch career categories');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories
  };
};
