import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

console.log('Testing Supabase Connection...');
console.log('URL:', supabaseUrl);
console.log('Key exists:', !!supabaseKey);

if (!supabaseUrl || !supabaseKey) {
  console.error('ERROR: Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('\n--- Testing Database Connection ---\n');
  
  try {
    // Test 1: Fetch data from a table
    console.log('Test 1: Attempting to fetch data from tables...\n');
    
    // Replace 'users' with one of your actual table names
    const { data, error } = await supabase
      .from('Destinations') // CHANGE THIS to your actual table name
      .select('*')
      .limit(5);
    
    if (error) {
      console.error('❌ Supabase Query Error:');
      console.error('Error Code:', error.code);
      console.error('Error Message:', error.message);
      console.error('Error Details:', error.details);
      console.error('Error Hint:', error.hint);
    } else {
      console.log('✅ Connection successful!');
      console.log('Data retrieved:', data);
      console.log('Number of rows:', data.length);
    }
    
  } catch (err) {
    console.error('❌ Connection failed with exception:');
    console.error(err);
  }
  
  console.log('\n--- Test Complete ---');
}

testConnection();