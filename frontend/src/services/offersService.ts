import { Student } from '@/types';

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
  private readonly STORAGE_KEY_OFFERS = 'unimatch_offers';
  private readonly STORAGE_KEY_APPLICATIONS = 'unimatch_applications';

  // Generate offers based on applications
  generateOffersFromApplications(student: Student): Offer[] {
    const applications = this.getApplications(student.id_number);
    const offers: Offer[] = [];

    applications.forEach(application => {
      // Simulate offer generation logic
      const shouldReceiveOffer = this.shouldGenerateOffer(student, application);
      
      if (shouldReceiveOffer) {
        const offer = this.createOffer(student, application);
        offers.push(offer);
      }
    });

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
  private createOffer(student: Student, application: Application): Offer {
    const now = new Date();
    const expiryDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days
    const acceptanceDeadline = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000); // 14 days

    return {
      offer_id: `offer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
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
      offer_status: 'Active',
      created_at: now.toISOString(),
      updated_at: now.toISOString()
    };
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

  // Store offers in localStorage
  saveOffers(studentId: string, offers: Offer[]): void {
    const existingOffers = this.getAllOffers();
    const updatedOffers = {
      ...existingOffers,
      [studentId]: offers
    };
    localStorage.setItem(this.STORAGE_KEY_OFFERS, JSON.stringify(updatedOffers));
  }

  // Get offers for a specific student
  getOffers(studentId: string): Offer[] {
    const allOffers = this.getAllOffers();
    return allOffers[studentId] || [];
  }

  // Get all offers from localStorage
  private getAllOffers(): Record<string, Offer[]> {
    const stored = localStorage.getItem(this.STORAGE_KEY_OFFERS);
    return stored ? JSON.parse(stored) : {};
  }

  // Update offer status
  updateOfferStatus(studentId: string, offerId: string, status: Offer['offer_status']): boolean {
    const offers = this.getOffers(studentId);
    const offerIndex = offers.findIndex(offer => offer.offer_id === offerId);
    
    if (offerIndex !== -1) {
      offers[offerIndex].offer_status = status;
      offers[offerIndex].updated_at = new Date().toISOString();
      this.saveOffers(studentId, offers);
      return true;
    }
    
    return false;
  }

  // Store applications in localStorage
  saveApplications(studentId: string, applications: Application[]): void {
    const existingApplications = this.getAllApplications();
    const updatedApplications = {
      ...existingApplications,
      [studentId]: applications
    };
    localStorage.setItem(this.STORAGE_KEY_APPLICATIONS, JSON.stringify(updatedApplications));
  }

  // Get applications for a specific student
  getApplications(studentId: string): Application[] {
    const allApplications = this.getAllApplications();
    return allApplications[studentId] || [];
  }

  // Get all applications from localStorage
  private getAllApplications(): Record<string, Application[]> {
    const stored = localStorage.getItem(this.STORAGE_KEY_APPLICATIONS);
    return stored ? JSON.parse(stored) : {};
  }

  // Add new application
  addApplication(studentId: string, application: Omit<Application, 'application_id' | 'application_date'>): void {
    const applications = this.getApplications(studentId);
    const newApplication: Application = {
      ...application,
      application_id: `app_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      application_date: new Date().toISOString()
    };
    
    applications.push(newApplication);
    this.saveApplications(studentId, applications);
  }

  // Update application status
  updateApplicationStatus(studentId: string, applicationId: string, status: Application['application_status']): boolean {
    const applications = this.getApplications(studentId);
    const applicationIndex = applications.findIndex(app => app.application_id === applicationId);
    
    if (applicationIndex !== -1) {
      applications[applicationIndex].application_status = status;
      applications[applicationIndex].decision_date = new Date().toISOString();
      this.saveApplications(studentId, applications);
      return true;
    }
    
    return false;
  }

  // Clear all data for a student
  clearStudentData(studentId: string): void {
    const allOffers = this.getAllOffers();
    const allApplications = this.getAllApplications();
    
    delete allOffers[studentId];
    delete allApplications[studentId];
    
    localStorage.setItem(this.STORAGE_KEY_OFFERS, JSON.stringify(allOffers));
    localStorage.setItem(this.STORAGE_KEY_APPLICATIONS, JSON.stringify(allApplications));
  }

  // Generate sample applications for demo purposes - REMOVED
  // Applications should now be created through the actual course application flow
}

export const offersService = new OffersService();
