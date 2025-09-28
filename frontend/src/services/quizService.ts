import { supabase } from '@/lib/supabase';

export interface QuizAnswers {
  quiz_id?: string;
  student_id: string;
  social_level: number;
  sleep_schedule: number;
  music_tolerance: number;
  party_frequency: number;
  smoking_preference: number;
  hobbies: string[];
  interests: string[];
  submitted_at?: string;
  created_at?: string;
  updated_at?: string;
}

class QuizService {
  // Save quiz answers to database
  async saveQuizAnswers(studentId: string, answers: Omit<QuizAnswers, 'quiz_id' | 'student_id' | 'submitted_at' | 'created_at' | 'updated_at'>): Promise<QuizAnswers | null> {
    try {
      const { data, error } = await supabase
        .from('quiz_answers')
        .upsert({
          student_id: studentId,
          social_level: answers.social_level,
          sleep_schedule: answers.sleep_schedule,
          music_tolerance: answers.music_tolerance,
          party_frequency: answers.party_frequency,
          smoking_preference: answers.smoking_preference,
          hobbies: answers.hobbies,
          interests: answers.interests,
          submitted_at: new Date().toISOString()
        }, {
          onConflict: 'student_id'
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving quiz answers:', error);
        throw new Error(`Failed to save quiz answers: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Quiz service error:', error);
      throw error;
    }
  }

  // Get quiz answers for a student
  async getQuizAnswers(studentId: string): Promise<QuizAnswers | null> {
    try {
      const { data, error } = await supabase
        .from('quiz_answers')
        .select('*')
        .eq('student_id', studentId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No quiz answers found
          return null;
        }
        console.error('Error fetching quiz answers:', error);
        throw new Error(`Failed to fetch quiz answers: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Quiz service error:', error);
      throw error;
    }
  }

  // Check if student has completed quiz
  async hasCompletedQuiz(studentId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('quiz_answers')
        .select('quiz_id')
        .eq('student_id', studentId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return false;
        }
        console.error('Error checking quiz completion:', error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error('Quiz service error:', error);
      return false;
    }
  }

  // Get all quiz answers for roommate matching
  async getAllQuizAnswers(): Promise<QuizAnswers[]> {
    try {
      const { data, error } = await supabase
        .from('quiz_answers')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (error) {
        console.error('Error fetching all quiz answers:', error);
        throw new Error(`Failed to fetch quiz answers: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Quiz service error:', error);
      throw error;
    }
  }

  // Calculate compatibility score between two students
  calculateCompatibility(student1: QuizAnswers, student2: QuizAnswers): number {
    let totalScore = 0;
    let maxScore = 0;

    // Social level compatibility (weight: 2)
    const socialDiff = Math.abs(student1.social_level - student2.social_level);
    const socialScore = Math.max(0, 4 - socialDiff) / 4;
    totalScore += socialScore * 2;
    maxScore += 2;

    // Sleep schedule compatibility (weight: 3)
    const sleepDiff = Math.abs(student1.sleep_schedule - student2.sleep_schedule);
    const sleepScore = Math.max(0, 2 - sleepDiff) / 2;
    totalScore += sleepScore * 3;
    maxScore += 3;

    // Music tolerance compatibility (weight: 2)
    const musicDiff = Math.abs(student1.music_tolerance - student2.music_tolerance);
    const musicScore = Math.max(0, 4 - musicDiff) / 4;
    totalScore += musicScore * 2;
    maxScore += 2;

    // Party frequency compatibility (weight: 2)
    const partyDiff = Math.abs(student1.party_frequency - student2.party_frequency);
    const partyScore = Math.max(0, 4 - partyDiff) / 4;
    totalScore += partyScore * 2;
    maxScore += 2;

    // Smoking preference compatibility (weight: 3)
    const smokingDiff = Math.abs(student1.smoking_preference - student2.smoking_preference);
    const smokingScore = Math.max(0, 2 - smokingDiff) / 2;
    totalScore += smokingScore * 3;
    maxScore += 3;

    // Hobbies compatibility (weight: 1)
    const commonHobbies = student1.hobbies.filter(hobby => student2.hobbies.includes(hobby)).length;
    const totalHobbies = new Set([...student1.hobbies, ...student2.hobbies]).size;
    const hobbiesScore = totalHobbies > 0 ? commonHobbies / totalHobbies : 0;
    totalScore += hobbiesScore * 1;
    maxScore += 1;

    // Interests compatibility (weight: 1)
    const commonInterests = student1.interests.filter(interest => student2.interests.includes(interest)).length;
    const totalInterests = new Set([...student1.interests, ...student2.interests]).size;
    const interestsScore = totalInterests > 0 ? commonInterests / totalInterests : 0;
    totalScore += interestsScore * 1;
    maxScore += 1;

    return maxScore > 0 ? totalScore / maxScore : 0;
  }

  // Find potential roommates for a student
  async findPotentialRoommates(studentId: string, limit: number = 10): Promise<Array<{ student: QuizAnswers; compatibility: number }>> {
    try {
      const studentQuiz = await this.getQuizAnswers(studentId);
      if (!studentQuiz) {
        return [];
      }

      const allQuizzes = await this.getAllQuizAnswers();
      const otherQuizzes = allQuizzes.filter(quiz => quiz.student_id !== studentId);

      const matches = otherQuizzes.map(quiz => ({
        student: quiz,
        compatibility: this.calculateCompatibility(studentQuiz, quiz)
      }));

      // Sort by compatibility score (highest first) and return top matches
      return matches
        .sort((a, b) => b.compatibility - a.compatibility)
        .slice(0, limit);
    } catch (error) {
      console.error('Error finding potential roommates:', error);
      throw error;
    }
  }

  // Delete quiz answers (for testing or if student wants to retake)
  async deleteQuizAnswers(studentId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('quiz_answers')
        .delete()
        .eq('student_id', studentId);

      if (error) {
        console.error('Error deleting quiz answers:', error);
        throw new Error(`Failed to delete quiz answers: ${error.message}`);
      }

      return true;
    } catch (error) {
      console.error('Quiz service error:', error);
      throw error;
    }
  }
}

export const quizService = new QuizService();
