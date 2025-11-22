#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import readline from 'readline';

// CORRECT myant-europe project credentials
const supabaseUrl = 'https://trfrikhxxtzmknjmpgub.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRyZnJpa2h4eHR6bWtuam1wZ3ViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3MzA1NTYsImV4cCI6MjA2MzMwNjU1Nn0.SHfsMDCQcXbL0auHK3Ct8oTBcjNWoTt03LQhvRdiTWA';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

console.log('🔐 Supabase Auth OTP Test - myant-europe project (trfrikhxxtzmknjmpgub)');
console.log('==========================================\n');

async function testOTPFlow() {
  try {
    // Step 1: Get email from user
    const email = await question('Enter your email address to test OTP: ');
    
    console.log('\n📧 Sending OTP to:', email);
    
    // Step 2: Send OTP
    const { data: otpData, error: otpError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        data: {
          source: 'eligibility_form_test'
        }
      }
    });

    if (otpError) {
      console.error('❌ Error sending OTP:', otpError.message);
      rl.close();
      return;
    }

    console.log('✅ OTP sent successfully!');
    console.log('\nCheck your email for the verification code.');
    console.log('(In development, check Supabase Dashboard > Auth > Logs)\n');

    // Step 3: Get OTP code from user
    const token = await question('Enter the 6-digit code from your email: ');

    console.log('\n🔍 Verifying OTP...');

    // Step 4: Verify OTP
    const { data: verifyData, error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email'
    });

    if (verifyError) {
      console.error('❌ Verification failed:', verifyError.message);
      rl.close();
      return;
    }

    console.log('✅ OTP verified successfully!');
    console.log('\n📋 User details:');
    console.log('- User ID:', verifyData.user?.id);
    console.log('- Email:', verifyData.user?.email);
    console.log('- Session:', verifyData.session ? 'Active' : 'None');

    // Step 5: Test user profile creation
    if (verifyData.user) {
      console.log('\n👤 Creating user profile...');
      
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .upsert({
          id: verifyData.user.id,
          date_of_birth: '1990-01-01',
          preferred_language: 'en',
          phone: '+41791234567'
        })
        .select()
        .single();

      if (profileError) {
        console.error('❌ Profile creation error:', profileError.message);
      } else {
        console.log('✅ User profile created/updated successfully!');
      }
    }

    // Step 6: Sign out
    console.log('\n🚪 Signing out...');
    const { error: signOutError } = await supabase.auth.signOut();
    
    if (!signOutError) {
      console.log('✅ Signed out successfully!');
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  } finally {
    rl.close();
  }
}

// Run the test
testOTPFlow();