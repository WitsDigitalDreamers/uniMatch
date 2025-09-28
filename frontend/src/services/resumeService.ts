import { StudentProfile } from './profileService';
import { careersService } from './careersService';

export interface ResumeData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
    dateOfBirth: string;
    citizenship: string;
  };
  education: {
    highSchool: {
      name: string;
      year: number;
      type: string;
    };
    currentEducation?: {
      institution: string;
      qualification: string;
      yearOfStudy: string;
    };
  };
  academicPerformance: {
    averagePercentage: number;
    apsScore: number;
    subjects: Array<{
      name: string;
      mark: number;
    }>;
  };
  interests: string[];
  hobbies: string[];
  careerGoals: string[];
  skills: string[];
  achievements: string[];
}

class ResumeService {
  private readonly CHAT_API_URL = import.meta.env.VITE_CHAT_API_URL || 'http://localhost:5001/api/chat';

  // Generate resume using AI model
  async generateResume(studentProfile: StudentProfile, studentId: string, studentInfo?: { first_name?: string; last_name?: string; email?: string }): Promise<string> {
    try {
      // Get student interests and hobbies from careers service
      const interests = careersService.getStudentInterests(studentId) || [];
      const hobbies = this.extractHobbiesFromProfile(studentProfile);
      
      // Prepare resume data
      const resumeData: ResumeData = {
        personalInfo: {
          name: `${studentInfo?.first_name || ''} ${studentInfo?.last_name || ''}`.trim(),
          email: studentInfo?.email || '',
          phone: studentProfile.contact_number || '',
          address: this.formatAddress(studentProfile.home_address),
          dateOfBirth: studentProfile.date_of_birth || '',
          citizenship: studentProfile.citizenship || ''
        },
        education: {
          highSchool: {
            name: studentProfile.high_school_name || '',
            year: studentProfile.year_matriculated || 0,
            type: studentProfile.matric_type || ''
          },
          currentEducation: studentProfile.current_institution ? {
            institution: studentProfile.current_institution,
            qualification: studentProfile.qualification_name || '',
            yearOfStudy: studentProfile.year_of_study || ''
          } : undefined
        },
        academicPerformance: {
          averagePercentage: studentProfile.average_percentage || 0,
          apsScore: studentProfile.aps_score || 0,
          subjects: studentProfile.subjects || []
        },
        interests,
        hobbies,
        careerGoals: this.generateCareerGoals(interests),
        skills: this.generateSkills(studentProfile, interests),
        achievements: this.generateAchievements(studentProfile)
      };

      // Create AI prompt for resume generation
      const systemPrompt = `You are a professional resume writer specializing in student resumes for university applications and job applications. Create a well-structured, professional resume in HTML format that highlights the student's academic achievements, interests, and potential.

Guidelines:
- Use professional HTML formatting with proper structure
- Include all relevant sections: Personal Information, Education, Academic Performance, Skills, Interests, Career Goals, and Achievements
- Make it visually appealing with proper headings and formatting
- Highlight academic strengths and relevant skills
- Keep it concise but comprehensive
- Use professional language appropriate for a student
- Include relevant keywords for the student's field of interest
- Format as a complete HTML document with embedded CSS for styling`;

      const userPrompt = `Please generate a professional resume for this student:

${JSON.stringify(resumeData, null, 2)}

Requirements:
- Format as a complete HTML document with embedded CSS
- Use a clean, professional design
- Include all provided information in appropriate sections
- Highlight academic achievements and relevant skills
- Make it suitable for university applications and job applications
- Ensure it's well-structured and easy to read`;

      const response = await fetch(this.CHAT_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: userPrompt
            }
          ],
          system: systemPrompt
        })
      });

      if (!response.ok) {
        throw new Error(`Resume generation failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data.content || '';

    } catch (error) {
      console.error('Error generating resume:', error);
      throw new Error('Failed to generate resume. Please try again.');
    }
  }

  // Download resume as HTML file
  downloadResume(htmlContent: string, filename: string = 'resume.html'): void {
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Extract hobbies from profile (if stored)
  private extractHobbiesFromProfile(profile: StudentProfile): string[] {
    // This could be extended to include hobbies from room matching quiz
    // For now, return empty array - can be enhanced later
    return [];
  }

  // Format address for display
  private formatAddress(address: any): string {
    if (!address) return '';
    const parts = [
      address.suburb,
      address.city,
      address.province,
      address.postal_code
    ].filter(Boolean);
    return parts.join(', ');
  }

  // Generate career goals based on interests
  private generateCareerGoals(interests: string[]): string[] {
    const goals: string[] = [];
    
    if (interests.includes('Technology')) {
      goals.push('Pursue a career in software development or data science');
    }
    if (interests.includes('Science')) {
      goals.push('Contribute to scientific research and innovation');
    }
    if (interests.includes('Business')) {
      goals.push('Develop leadership skills in business management');
    }
    if (interests.includes('Arts')) {
      goals.push('Explore creative expression through various art forms');
    }
    if (interests.includes('Health')) {
      goals.push('Make a positive impact on community health and wellness');
    }
    if (interests.includes('Education')) {
      goals.push('Inspire and educate future generations');
    }
    
    return goals.length > 0 ? goals : ['Develop professional skills and contribute to society'];
  }

  // Generate skills based on profile and interests
  private generateSkills(profile: StudentProfile, interests: string[]): string[] {
    const skills: string[] = [];
    
    // Academic skills
    if (profile.average_percentage && profile.average_percentage >= 80) {
      skills.push('Academic Excellence');
    }
    if (profile.aps_score && profile.aps_score >= 30) {
      skills.push('Strong Academic Foundation');
    }
    
    // Subject-based skills
    if (profile.subjects) {
      profile.subjects.forEach(subject => {
        if (subject.mark >= 80) {
          skills.push(`Advanced ${subject.name}`);
        }
      });
    }
    
    // Interest-based skills
    interests.forEach(interest => {
      switch (interest.toLowerCase()) {
        case 'technology':
          skills.push('Digital Literacy', 'Problem Solving');
          break;
        case 'science':
          skills.push('Analytical Thinking', 'Research');
          break;
        case 'business':
          skills.push('Leadership', 'Communication');
          break;
        case 'arts':
          skills.push('Creativity', 'Visual Communication');
          break;
        case 'sports':
          skills.push('Teamwork', 'Physical Fitness');
          break;
        case 'languages':
          skills.push('Multilingual Communication');
          break;
      }
    });
    
    return skills.length > 0 ? skills : ['Academic Foundation', 'Communication', 'Problem Solving'];
  }

  // Generate achievements based on profile
  private generateAchievements(profile: StudentProfile): string[] {
    const achievements: string[] = [];
    
    if (profile.average_percentage && profile.average_percentage >= 90) {
      achievements.push('Academic Excellence - 90%+ average');
    } else if (profile.average_percentage && profile.average_percentage >= 80) {
      achievements.push('High Academic Performance - 80%+ average');
    }
    
    if (profile.aps_score && profile.aps_score >= 40) {
      achievements.push('Outstanding APS Score - 40+ points');
    } else if (profile.aps_score && profile.aps_score >= 30) {
      achievements.push('Strong APS Score - 30+ points');
    }
    
    if (profile.subjects) {
      const highPerformingSubjects = profile.subjects.filter(s => s.mark >= 90);
      if (highPerformingSubjects.length > 0) {
        achievements.push(`Excellence in ${highPerformingSubjects.map(s => s.name).join(', ')}`);
      }
    }
    
    if (profile.year_matriculated) {
      const currentYear = new Date().getFullYear();
      const yearsSinceMatric = currentYear - profile.year_matriculated;
      if (yearsSinceMatric <= 2) {
        achievements.push('Recent Matriculant with Current Academic Knowledge');
      }
    }
    
    return achievements.length > 0 ? achievements : ['Academic Achievement', 'Dedication to Learning'];
  }
}

export const resumeService = new ResumeService();
