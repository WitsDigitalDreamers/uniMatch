import { supabase } from './supabase';

/**
 * Test Supabase connection and authentication
 */
export async function testSupabaseConnection() {
  try {
    console.log('🔍 Testing Supabase connection...');
    
    // Test basic connection
    const { data, error } = await supabase
      .from('students')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Supabase connection failed:', error.message);
      return false;
    }
    
    console.log('✅ Supabase connection successful');
    
    // Test auth
    const { data: { session } } = await supabase.auth.getSession();
    console.log('🔐 Auth session:', session ? 'Active' : 'None');
    
    return true;
  } catch (error) {
    console.error('❌ Supabase test failed:', error);
    return false;
  }
}

/**
 * Test student data operations
 */
export async function testStudentOperations() {
  try {
    console.log('🧪 Testing student operations...');
    
    // Test reading students
    const { data: students, error: readError } = await supabase
      .from('students')
      .select('*')
      .limit(5);
    
    if (readError) {
      console.error('❌ Failed to read students:', readError.message);
      return false;
    }
    
    console.log(`✅ Successfully read ${students?.length || 0} students`);
    return true;
  } catch (error) {
    console.error('❌ Student operations test failed:', error);
    return false;
  }
}

// Run tests if this file is executed directly
if (import.meta.hot) {
  testSupabaseConnection().then(success => {
    if (success) {
      testStudentOperations();
    }
  });
}
