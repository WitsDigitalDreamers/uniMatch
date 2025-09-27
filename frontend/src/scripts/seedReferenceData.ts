// Phase 3: Reference Data Integration - Data Seeding Script
// This script populates the database with reference data from mockData.ts

import { supabase } from '../../lib/supabase';
import { 
  schools, 
  universities, 
  courses, 
  bursaries, 
  residences, 
  careers 
} from '@/data/mockData';

interface SeedResult {
  table: string;
  success: boolean;
  count: number;
  error?: string;
}

class ReferenceDataSeeder {
  private results: SeedResult[] = [];

  async seedAll(): Promise<SeedResult[]> {
    console.log('🌱 Starting reference data seeding...');
    
    try {
      // Clear existing data first
      await this.clearExistingData();
      
      // Seed data in order (respecting foreign key constraints)
      await this.seedSchools();
      await this.seedUniversities();
      await this.seedCourses();
      await this.seedBursaries();
      await this.seedResidences();
      await this.seedCareers();
      
      console.log('✅ Reference data seeding completed successfully!');
      this.printResults();
      
      return this.results;
    } catch (error) {
      console.error('❌ Reference data seeding failed:', error);
      throw error;
    }
  }

  private async clearExistingData(): Promise<void> {
    console.log('🧹 Clearing existing reference data...');
    
    const tables = ['careers', 'residences', 'bursaries', 'courses', 'universities', 'schools'];
    
    for (const table of tables) {
      try {
        const { error } = await supabase
          .from(table)
          .delete()
          .neq('id', 0); // Delete all records
        
        if (error) {
          console.warn(`⚠️  Warning: Could not clear ${table}:`, error.message);
        } else {
          console.log(`✅ Cleared ${table}`);
        }
      } catch (error) {
        console.warn(`⚠️  Warning: Could not clear ${table}:`, error);
      }
    }
  }

  private async seedSchools(): Promise<void> {
    console.log('🏫 Seeding schools...');
    
    try {
      const { data, error } = await supabase
        .from('schools')
        .insert(schools.map(school => ({
          school_id: school.school_id,
          name: school.name,
          province: school.province,
          type: school.type,
          is_partner: school.is_partner
        })));

      if (error) throw error;
      
      this.results.push({
        table: 'schools',
        success: true,
        count: schools.length
      });
      
      console.log(`✅ Seeded ${schools.length} schools`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.results.push({
        table: 'schools',
        success: false,
        count: 0,
        error: errorMessage
      });
      console.error('❌ Failed to seed schools:', errorMessage);
    }
  }

  private async seedUniversities(): Promise<void> {
    console.log('🏛️ Seeding universities...');
    
    try {
      const { data, error } = await supabase
        .from('universities')
        .insert(universities.map(university => ({
          university_id: university.university_id,
          name: university.name,
          location: university.location,
          province: university.province
        })));

      if (error) throw error;
      
      this.results.push({
        table: 'universities',
        success: true,
        count: universities.length
      });
      
      console.log(`✅ Seeded ${universities.length} universities`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.results.push({
        table: 'universities',
        success: false,
        count: 0,
        error: errorMessage
      });
      console.error('❌ Failed to seed universities:', errorMessage);
    }
  }

  private async seedCourses(): Promise<void> {
    console.log('📚 Seeding courses...');
    
    try {
      const { data, error } = await supabase
        .from('courses')
        .insert(courses.map(course => ({
          course_id: course.course_id,
          university_id: course.university_id,
          name: course.name,
          faculty: course.faculty,
          requirements: course.requirements,
          points_required: course.points_required,
          estimated_cost: course.estimated_cost,
          modules: course.modules,
          available_residences: course.available_residences
        })));

      if (error) throw error;
      
      this.results.push({
        table: 'courses',
        success: true,
        count: courses.length
      });
      
      console.log(`✅ Seeded ${courses.length} courses`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.results.push({
        table: 'courses',
        success: false,
        count: 0,
        error: errorMessage
      });
      console.error('❌ Failed to seed courses:', errorMessage);
    }
  }

  private async seedBursaries(): Promise<void> {
    console.log('💰 Seeding bursaries...');
    
    try {
      const { data, error } = await supabase
        .from('bursaries')
        .insert(bursaries.map(bursary => ({
          bursary_id: bursary.bursary_id,
          name: bursary.name,
          provider: bursary.provider,
          eligibility: bursary.eligibility,
          deadline: bursary.deadline
        })));

      if (error) throw error;
      
      this.results.push({
        table: 'bursaries',
        success: true,
        count: bursaries.length
      });
      
      console.log(`✅ Seeded ${bursaries.length} bursaries`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.results.push({
        table: 'bursaries',
        success: false,
        count: 0,
        error: errorMessage
      });
      console.error('❌ Failed to seed bursaries:', errorMessage);
    }
  }

  private async seedResidences(): Promise<void> {
    console.log('🏠 Seeding residences...');
    
    try {
      const { data, error } = await supabase
        .from('residences')
        .insert(residences.map(residence => ({
          residence_id: residence.residence_id,
          name: residence.name,
          university_id: residence.university_id,
          location: residence.location,
          gender: residence.gender,
          price_per_month: residence.price_per_month,
          estimated_annual_cost: residence.estimated_annual_cost,
          capacity: residence.capacity,
          amenities: residence.amenities,
          distance_from_campus: residence.distance_from_campus,
          contact_info: residence.contact_info,
          availability_status: 'Available'
        })));

      if (error) throw error;
      
      this.results.push({
        table: 'residences',
        success: true,
        count: residences.length
      });
      
      console.log(`✅ Seeded ${residences.length} residences`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.results.push({
        table: 'residences',
        success: false,
        count: 0,
        error: errorMessage
      });
      console.error('❌ Failed to seed residences:', errorMessage);
    }
  }

  private async seedCareers(): Promise<void> {
    console.log('💼 Seeding careers...');
    
    try {
      const { data, error } = await supabase
        .from('careers')
        .insert(careers.map(career => ({
          career_id: career.career_id,
          name: career.name,
          description: career.description,
          category: career.category,
          required_courses: career.required_courses,
          alternative_courses: career.alternative_courses,
          skills_required: career.skills_required,
          average_salary: career.average_salary,
          job_market_outlook: career.job_market_outlook,
          growth_rate: career.growth_rate,
          learn_more_url: career.learn_more_url
        })));

      if (error) throw error;
      
      this.results.push({
        table: 'careers',
        success: true,
        count: careers.length
      });
      
      console.log(`✅ Seeded ${careers.length} careers`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.results.push({
        table: 'careers',
        success: false,
        count: 0,
        error: errorMessage
      });
      console.error('❌ Failed to seed careers:', errorMessage);
    }
  }

  private printResults(): void {
    console.log('\n📊 Seeding Results:');
    console.log('==================');
    
    this.results.forEach(result => {
      const status = result.success ? '✅' : '❌';
      const count = result.success ? result.count : 0;
      console.log(`${status} ${result.table}: ${count} records`);
      
      if (!result.success && result.error) {
        console.log(`   Error: ${result.error}`);
      }
    });
    
    const totalSuccess = this.results.filter(r => r.success).length;
    const totalRecords = this.results.reduce((sum, r) => sum + r.count, 0);
    
    console.log(`\n📈 Summary: ${totalSuccess}/${this.results.length} tables seeded successfully`);
    console.log(`📊 Total records: ${totalRecords}`);
  }

  // Utility method to check if data already exists
  async checkExistingData(): Promise<{ [key: string]: number }> {
    const counts: { [key: string]: number } = {};
    
    const tables = ['schools', 'universities', 'courses', 'bursaries', 'residences', 'careers'];
    
    for (const table of tables) {
      try {
        const { count, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });
        
        if (error) {
          console.warn(`⚠️  Could not check ${table}:`, error.message);
          counts[table] = -1;
        } else {
          counts[table] = count || 0;
        }
      } catch (error) {
        console.warn(`⚠️  Could not check ${table}:`, error);
        counts[table] = -1;
      }
    }
    
    return counts;
  }
}

// Export the seeder class and a convenience function
export { ReferenceDataSeeder };

export const seedReferenceData = async (): Promise<SeedResult[]> => {
  const seeder = new ReferenceDataSeeder();
  return await seeder.seedAll();
};

// Export a function to check existing data
export const checkReferenceData = async (): Promise<{ [key: string]: number }> => {
  const seeder = new ReferenceDataSeeder();
  return await seeder.checkExistingData();
};
