import { Student } from '@/types';
import { supabase } from '@/lib/supabase';

export interface Offer {
  offer_id: string;
  student_id: string;
  course_id: string;
  university_id: string;
  course_name: string;
  university_name: string;
  university_location: string;
  offer_type: 'Conditional' | 'Unconditional' | 'Waitlist';
  offer_conditions: Record<string, any>;
  expiry_date: string;
  acceptance_deadline: string;
  offer_status: 'Active' | 'Accepted' | 'Declined' | 'Expired';
  created_at: string;
  updated_at: string;
}

export interface Application {
  application_id: string;
  student_id: string;
  course_id: string;
  university_id: string;
  course_name: string;
  university_name: string;
  university_location: string;
  application_status: 'Pending' | 'Under Review' | 'Accepted' | 'Rejected' | 'Waitlisted';
  application_date: string;
  decision_date?: string;
  notes?: string;
}

class OffersService {

  // Generate offers based on applications
  async generateOffersFromApplications(student: Student): Promise<Offer[]> {
    const applications = await this.getApplications(student.id_number);
    const offers: Offer[] = [];

    for (const application of applications) {
      // Simulate offer generation logic
      const shouldReceiveOffer = this.shouldGenerateOffer(student, application);
      
      if (shouldReceiveOffer) {
        const offer = await this.createOffer(student, application);
        offers.push(offer);
      }
    }

    return offers;
  }

  // Check if student should receive an offer
  private shouldGenerateOffer(student: Student, application: Application): boolean {
    // Simple logic: if application is pending and student has good marks, generate offer
    if (application.application_status !== 'Pending') {
      return false;
    }

    // Calculate APS score
    const apsScore = this.calculateAPS(student.marks);
    
    // Different universities have different requirements
    const universityRequirements: Record<string, number> = {
      'UNI001': 35, // UCT
      'UNI002': 40, // Wits
      'UNI003': 38, // Stellenbosch
    };

    const requiredAPS = universityRequirements[application.university_id] || 30;
    
    return apsScore >= requiredAPS;
  }

  // Create an offer from an application
  private async createOffer(student: Student, application: Application): Promise<Offer> {
    const now = new Date();
    const expiryDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days
    const acceptanceDeadline = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000); // 14 days

    const offerData = {
      student_id: student.id_number,
      course_id: application.course_id,
      university_id: application.university_id,
      course_name: application.course_name,
      university_name: application.university_name,
      university_location: application.university_location,
      offer_type: this.determineOfferType(student, application),
      offer_conditions: this.generateOfferConditions(student, application),
      expiry_date: expiryDate.toISOString().split('T')[0],
      acceptance_deadline: acceptanceDeadline.toISOString().split('T')[0],
      offer_status: 'Active' as const
    };

    try {
      const { data, error } = await supabase
        .from('offers')
        .insert(offerData)
        .select()
        .single();

      if (error) {
        console.error('Error creating offer:', error);
        throw error;
      }

      return {
        offer_id: data.offer_id,
        student_id: data.student_id,
        course_id: data.course_id,
        university_id: data.university_id,
        course_name: data.course_name,
        university_name: data.university_name,
        university_location: data.university_location,
        offer_type: data.offer_type,
        offer_conditions: data.offer_conditions,
        expiry_date: data.expiry_date,
        acceptance_deadline: data.acceptance_deadline,
        offer_status: data.offer_status,
        created_at: data.created_at,
        updated_at: data.updated_at
      };
    } catch (error) {
      console.error('Error creating offer:', error);
      throw error;
    }
  }

  // Determine offer type based on student profile
  private determineOfferType(student: Student, application: Application): 'Conditional' | 'Unconditional' | 'Waitlist' {
    const apsScore = this.calculateAPS(student.marks);
    
    if (apsScore >= 45) {
      return 'Unconditional';
    } else if (apsScore >= 35) {
      return 'Conditional';
    } else {
      return 'Waitlist';
    }
  }

  // Generate offer conditions
  private generateOfferConditions(student: Student, application: Application): Record<string, any> {
    const apsScore = this.calculateAPS(student.marks);
    
    if (apsScore >= 45) {
      return {}; // No conditions for unconditional offers
    } else {
      return {
        maintain_aps: apsScore,
        complete_grade_12: true,
        submit_documents: true,
        pay_registration_fee: true
      };
    }
  }

  // Calculate APS score
  private calculateAPS(marks: Record<string, number>): number {
    let totalPoints = 0;
    
    Object.values(marks).forEach(mark => {
      if (mark >= 90) totalPoints += 7;
      else if (mark >= 80) totalPoints += 6;
      else if (mark >= 70) totalPoints += 5;
      else if (mark >= 60) totalPoints += 4;
      else if (mark >= 50) totalPoints += 3;
      else if (mark >= 40) totalPoints += 2;
      else if (mark >= 30) totalPoints += 1;
    });
    
    return totalPoints;
  }

  // Get offers for a specific student from database
  async getOffers(studentId: string): Promise<Offer[]> {
    try {
      const { data, error } = await supabase
        .from('offers')
        .select('*')
        .eq('student_id', studentId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching offers:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching offers:', error);
      return [];
    }
  }

  // Update offer status in database
  async updateOfferStatus(studentId: string, offerId: string, status: Offer['offer_status']): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('offers')
        .update({ 
          offer_status: status,
          updated_at: new Date().toISOString()
        })
        .eq('offer_id', offerId)
        .eq('student_id', studentId);

      if (error) {
        console.error('Error updating offer status:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error updating offer status:', error);
      return false;
    }
  }

  // Get applications for a specific student from database
  async getApplications(studentId: string): Promise<Application[]> {
    try {
      const { data, error } = await supabase
        .from('student_applications')
        .select('*')
        .eq('student_id', studentId)
        .order('application_date', { ascending: false });

      if (error) {
        console.error('Error fetching applications:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching applications:', error);
      return [];
    }
  }

  // Add new application to database
  async addApplication(studentId: string, application: Omit<Application, 'application_id' | 'application_date'>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('student_applications')
        .insert({
          student_id: studentId,
          course_id: application.course_id,
          university_id: application.university_id,
          course_name: application.course_name,
          university_name: application.university_name,
          university_location: application.university_location,
          application_status: application.application_status,
          notes: application.notes
        });

      if (error) {
        console.error('Error adding application:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error adding application:', error);
      return false;
    }
  }

  // Update application status in database
  async updateApplicationStatus(studentId: string, applicationId: string, status: Application['application_status']): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('student_applications')
        .update({ 
          application_status: status,
          decision_date: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('application_id', applicationId)
        .eq('student_id', studentId);

      if (error) {
        console.error('Error updating application status:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error updating application status:', error);
      return false;
    }
  }

  // Clear all data for a student from database
  async clearStudentData(studentId: string): Promise<boolean> {
    try {
      // Delete offers
      const { error: offersError } = await supabase
        .from('offers')
        .delete()
        .eq('student_id', studentId);

      if (offersError) {
        console.error('Error clearing offers:', offersError);
        return false;
      }

      // Delete applications
      const { error: applicationsError } = await supabase
        .from('student_applications')
        .delete()
        .eq('student_id', studentId);

      if (applicationsError) {
        console.error('Error clearing applications:', applicationsError);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error clearing student data:', error);
      return false;
    }
  }

  // Generate sample applications for demo purposes - REMOVED
  // Applications should now be created through the actual course application flow
}

export const offersService = new OffersService();
