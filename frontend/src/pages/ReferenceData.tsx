// Phase 3: Reference Data Integration - Main Reference Data Page

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  UniversityGrid, 
  CourseGrid, 
  BursaryGrid, 
  ResidenceGrid, 
  CareerGrid 
} from '@/components/reference';
import { 
  SearchBar, 
  CourseFilters, 
  BursaryFilters, 
  ResidenceFilters 
} from '@/components/reference/SearchAndFilter';
import { 
  useUniversities, 
  useCourses, 
  useBursaries, 
  useResidences, 
  useCareers,
  useReferenceDataStats,
  useFaculties,
  useProvinces,
  useCareerCategories
} from '@/hooks/useReferenceData';
import { 
  Building, 
  BookOpen, 
  DollarSign, 
  Users, 
  Briefcase,
  Search,
  Filter,
  RefreshCw,
  BarChart3
} from 'lucide-react';
import type { University, Course, Bursary, Residence, Career } from '@/types';

const ReferenceDataPage: React.FC = () => {
  // ==================== STATE MANAGEMENT ====================
  
  // Data fetching
  const { universities, loading: universitiesLoading, error: universitiesError } = useUniversities();
  const { courses, loading: coursesLoading, error: coursesError } = useCourses();
  const { bursaries, loading: bursariesLoading, error: bursariesError } = useBursaries();
  const { residences, loading: residencesLoading, error: residencesError } = useResidences();
  const { careers, loading: careersLoading, error: careersError } = useCareers();
  const { stats, loading: statsLoading } = useReferenceDataStats();
  const { faculties } = useFaculties();
  const { provinces } = useProvinces();
  const { categories } = useCareerCategories();

  // Search states
  const [universitySearch, setUniversitySearch] = useState('');
  const [courseSearch, setCourseSearch] = useState('');
  const [bursarySearch, setBursarySearch] = useState('');
  const [residenceSearch, setResidenceSearch] = useState('');
  const [careerSearch, setCareerSearch] = useState('');

  // Filter states
  const [courseFilters, setCourseFilters] = useState({
    faculties: [] as string[],
    universities: [] as string[],
    provinces: [] as string[],
    apsRange: [20, 50] as [number, number],
    costRange: [20000, 150000] as [number, number]
  });

  const [bursaryFilters, setBursaryFilters] = useState({
    faculties: [] as string[],
    provinces: [] as string[],
    apsRange: [20, 50] as [number, number],
    incomeRange: [0, 1000000] as [number, number]
  });

  const [residenceFilters, setResidenceFilters] = useState({
    universities: [] as string[],
    genders: [] as string[],
    priceRange: [2000, 8000] as [number, number]
  });

  // Filtered data
  const [filteredUniversities, setFilteredUniversities] = useState<University[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [filteredBursaries, setFilteredBursaries] = useState<Bursary[]>([]);
  const [filteredResidences, setFilteredResidences] = useState<Residence[]>([]);
  const [filteredCareers, setFilteredCareers] = useState<Career[]>([]);

  // ==================== FILTERING LOGIC ====================

  useEffect(() => {
    // Filter universities
    let filtered = universities;
    if (universitySearch) {
      filtered = filtered.filter(u => 
        u.name.toLowerCase().includes(universitySearch.toLowerCase()) ||
        u.location.toLowerCase().includes(universitySearch.toLowerCase()) ||
        u.province.toLowerCase().includes(universitySearch.toLowerCase())
      );
    }
    setFilteredUniversities(filtered);
  }, [universities, universitySearch]);

  useEffect(() => {
    // Filter courses
    let filtered = courses;
    
    if (courseSearch) {
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(courseSearch.toLowerCase()) ||
        c.faculty.toLowerCase().includes(courseSearch.toLowerCase())
      );
    }
    
    if (courseFilters.faculties.length > 0) {
      filtered = filtered.filter(c => courseFilters.faculties.includes(c.faculty));
    }
    
    if (courseFilters.universities.length > 0) {
      filtered = filtered.filter(c => 
        courseFilters.universities.some(u => c.universities?.name.includes(u))
      );
    }
    
    if (courseFilters.provinces.length > 0) {
      filtered = filtered.filter(c => 
        courseFilters.provinces.includes(c.universities?.province || '')
      );
    }
    
    filtered = filtered.filter(c => 
      c.points_required >= courseFilters.apsRange[0] && 
      c.points_required <= courseFilters.apsRange[1]
    );
    
    filtered = filtered.filter(c => 
      c.estimated_cost >= courseFilters.costRange[0] && 
      c.estimated_cost <= courseFilters.costRange[1]
    );
    
    setFilteredCourses(filtered);
  }, [courses, courseSearch, courseFilters]);

  useEffect(() => {
    // Filter bursaries
    let filtered = bursaries;
    
    if (bursarySearch) {
      filtered = filtered.filter(b => 
        b.name.toLowerCase().includes(bursarySearch.toLowerCase()) ||
        b.provider.toLowerCase().includes(bursarySearch.toLowerCase())
      );
    }
    
    if (bursaryFilters.faculties.length > 0) {
      filtered = filtered.filter(b => 
        b.eligibility.faculties?.some(f => bursaryFilters.faculties.includes(f))
      );
    }
    
    if (bursaryFilters.provinces.length > 0) {
      filtered = filtered.filter(b => 
        b.eligibility.provinces?.some(p => bursaryFilters.provinces.includes(p))
      );
    }
    
    filtered = filtered.filter(b => 
      !b.eligibility.minimum_aps || 
      (b.eligibility.minimum_aps >= bursaryFilters.apsRange[0] && 
       b.eligibility.minimum_aps <= bursaryFilters.apsRange[1])
    );
    
    filtered = filtered.filter(b => 
      !b.eligibility.minimum_household_income || 
      (b.eligibility.minimum_household_income >= bursaryFilters.incomeRange[0] && 
       b.eligibility.minimum_household_income <= bursaryFilters.incomeRange[1])
    );
    
    setFilteredBursaries(filtered);
  }, [bursaries, bursarySearch, bursaryFilters]);

  useEffect(() => {
    // Filter residences
    let filtered = residences;
    
    if (residenceSearch) {
      filtered = filtered.filter(r => 
        r.name.toLowerCase().includes(residenceSearch.toLowerCase()) ||
        r.location.toLowerCase().includes(residenceSearch.toLowerCase())
      );
    }
    
    if (residenceFilters.universities.length > 0) {
      filtered = filtered.filter(r => 
        residenceFilters.universities.some(u => r.universities?.name.includes(u))
      );
    }
    
    if (residenceFilters.genders.length > 0) {
      filtered = filtered.filter(r => residenceFilters.genders.includes(r.gender));
    }
    
    filtered = filtered.filter(r => 
      r.price_per_month >= residenceFilters.priceRange[0] && 
      r.price_per_month <= residenceFilters.priceRange[1]
    );
    
    setFilteredResidences(filtered);
  }, [residences, residenceSearch, residenceFilters]);

  useEffect(() => {
    // Filter careers
    let filtered = careers;
    
    if (careerSearch) {
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(careerSearch.toLowerCase()) ||
        c.description.toLowerCase().includes(careerSearch.toLowerCase()) ||
        c.category.toLowerCase().includes(careerSearch.toLowerCase())
      );
    }
    
    setFilteredCareers(filtered);
  }, [careers, careerSearch]);

  // ==================== FILTER RESET FUNCTIONS ====================

  const resetCourseFilters = () => {
    setCourseFilters({
      faculties: [],
      universities: [],
      provinces: [],
      apsRange: [20, 50],
      costRange: [20000, 150000]
    });
    setCourseSearch('');
  };

  const resetBursaryFilters = () => {
    setBursaryFilters({
      faculties: [],
      provinces: [],
      apsRange: [20, 50],
      incomeRange: [0, 1000000]
    });
    setBursarySearch('');
  };

  const resetResidenceFilters = () => {
    setResidenceFilters({
      universities: [],
      genders: [],
      priceRange: [2000, 8000]
    });
    setResidenceSearch('');
  };

  // ==================== RENDER FUNCTIONS ====================

  const renderStats = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Building className="h-5 w-5 text-blue-600" />
            <div>
              <div className="text-2xl font-bold">{stats?.universities || 0}</div>
              <div className="text-sm text-gray-600">Universities</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5 text-green-600" />
            <div>
              <div className="text-2xl font-bold">{stats?.courses || 0}</div>
              <div className="text-sm text-gray-600">Courses</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5 text-yellow-600" />
            <div>
              <div className="text-2xl font-bold">{stats?.bursaries || 0}</div>
              <div className="text-sm text-gray-600">Bursaries</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-purple-600" />
            <div>
              <div className="text-2xl font-bold">{stats?.residences || 0}</div>
              <div className="text-sm text-gray-600">Residences</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Briefcase className="h-5 w-5 text-red-600" />
            <div>
              <div className="text-2xl font-bold">{stats?.careers || 0}</div>
              <div className="text-sm text-gray-600">Careers</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-indigo-600" />
            <div>
              <div className="text-2xl font-bold">{stats?.schools || 0}</div>
              <div className="text-sm text-gray-600">Schools</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Reference Data</h1>
        <p className="text-gray-600">
          Explore universities, courses, bursaries, residences, and career opportunities
        </p>
      </div>

      {renderStats()}

      <Tabs defaultValue="universities" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="universities">Universities</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="bursaries">Bursaries</TabsTrigger>
          <TabsTrigger value="residences">Residences</TabsTrigger>
          <TabsTrigger value="careers">Careers</TabsTrigger>
        </TabsList>

        <TabsContent value="universities" className="space-y-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-1/4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Search className="h-5 w-5 mr-2" />
                    Search Universities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SearchBar
                    placeholder="Search universities..."
                    value={universitySearch}
                    onChange={setUniversitySearch}
                    onClear={() => setUniversitySearch('')}
                  />
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:w-3/4">
              <UniversityGrid
                universities={filteredUniversities}
                loading={universitiesLoading}
                error={universitiesError}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="courses" className="space-y-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-1/4">
              <CourseFilters
                faculties={courseFilters.faculties}
                universities={courseFilters.universities}
                provinces={courseFilters.provinces}
                apsRange={courseFilters.apsRange}
                costRange={courseFilters.costRange}
                onFacultiesChange={(faculties) => setCourseFilters(prev => ({ ...prev, faculties }))}
                onUniversitiesChange={(universities) => setCourseFilters(prev => ({ ...prev, universities }))}
                onProvincesChange={(provinces) => setCourseFilters(prev => ({ ...prev, provinces }))}
                onAPSRangeChange={(apsRange) => setCourseFilters(prev => ({ ...prev, apsRange }))}
                onCostRangeChange={(costRange) => setCourseFilters(prev => ({ ...prev, costRange }))}
                onReset={resetCourseFilters}
              />
            </div>
            
            <div className="lg:w-3/4">
              <div className="mb-4">
                <SearchBar
                  placeholder="Search courses..."
                  value={courseSearch}
                  onChange={setCourseSearch}
                  onClear={() => setCourseSearch('')}
                />
              </div>
              <CourseGrid
                courses={filteredCourses}
                loading={coursesLoading}
                error={coursesError}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="bursaries" className="space-y-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-1/4">
              <BursaryFilters
                faculties={bursaryFilters.faculties}
                provinces={bursaryFilters.provinces}
                apsRange={bursaryFilters.apsRange}
                incomeRange={bursaryFilters.incomeRange}
                onFacultiesChange={(faculties) => setBursaryFilters(prev => ({ ...prev, faculties }))}
                onProvincesChange={(provinces) => setBursaryFilters(prev => ({ ...prev, provinces }))}
                onAPSRangeChange={(apsRange) => setBursaryFilters(prev => ({ ...prev, apsRange }))}
                onIncomeRangeChange={(incomeRange) => setBursaryFilters(prev => ({ ...prev, incomeRange }))}
                onReset={resetBursaryFilters}
              />
            </div>
            
            <div className="lg:w-3/4">
              <div className="mb-4">
                <SearchBar
                  placeholder="Search bursaries..."
                  value={bursarySearch}
                  onChange={setBursarySearch}
                  onClear={() => setBursarySearch('')}
                />
              </div>
              <BursaryGrid
                bursaries={filteredBursaries}
                loading={bursariesLoading}
                error={bursariesError}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="residences" className="space-y-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-1/4">
              <ResidenceFilters
                universities={residenceFilters.universities}
                genders={residenceFilters.genders}
                priceRange={residenceFilters.priceRange}
                onUniversitiesChange={(universities) => setResidenceFilters(prev => ({ ...prev, universities }))}
                onGendersChange={(genders) => setResidenceFilters(prev => ({ ...prev, genders }))}
                onPriceRangeChange={(priceRange) => setResidenceFilters(prev => ({ ...prev, priceRange }))}
                onReset={resetResidenceFilters}
              />
            </div>
            
            <div className="lg:w-3/4">
              <div className="mb-4">
                <SearchBar
                  placeholder="Search residences..."
                  value={residenceSearch}
                  onChange={setResidenceSearch}
                  onClear={() => setResidenceSearch('')}
                />
              </div>
              <ResidenceGrid
                residences={filteredResidences}
                loading={residencesLoading}
                error={residencesError}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="careers" className="space-y-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-1/4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Search className="h-5 w-5 mr-2" />
                    Search Careers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SearchBar
                    placeholder="Search careers..."
                    value={careerSearch}
                    onChange={setCareerSearch}
                    onClear={() => setCareerSearch('')}
                  />
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:w-3/4">
              <CareerGrid
                careers={filteredCareers}
                loading={careersLoading}
                error={careersError}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReferenceDataPage;
