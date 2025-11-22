import React, { useState } from 'react';
import { MinimalButton } from '@/components/ui/minimal-button';
import { MinimalCard, MinimalCardContent, MinimalCardHeader, MinimalCardTitle } from '@/components/ui/minimal-card';
import { MinimalInput } from '@/components/ui/minimal-input';
import { CheckCircle, XCircle, Database, Shield, Mail } from 'lucide-react';
import { 
  supabase, 
  isSupabaseConfigured, 
  getCurrentUser,
  signOut
} from '@/lib/supabase';
import { authService } from '@/services/authService';

export default function TestSupabase() {
  const [testResults, setTestResults] = useState<Record<string, boolean | null>>({
    connection: null,
    auth: null,
    tables: null,
    edgeFunction: null
  });
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const testConnection = async () => {
    setLoading(true);
    const results: Record<string, boolean | null> = {};

    // Test 1: Supabase Configuration
  // Console statement removed by ESLint fix
    results.connection = isSupabaseConfigured();
    
    if (results.connection) {
      // Test 2: Database Connection
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('count')
          .limit(1);
        
        results.tables = !error;
  // Console statement removed by ESLint fix
      } catch (e) {
        results.tables = false;
        console.error('Database error:', e);
      }

      // Test 3: Auth System
      try {
        const user = await getCurrentUser();
        results.auth = true; // Auth system is accessible
        setCurrentUser(user);
      } catch (e) {
        results.auth = false;
        console.error('Auth error:', e);
      }

      // Test 4: Edge Function
      try {
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/eligibility-handler`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY
          },
          body: JSON.stringify({ action: 'health_check' })
        });
        
        results.edgeFunction = response.ok || response.status === 401; // 401 means it's reachable but needs auth
  // Console statement removed by ESLint fix
      } catch (e) {
        results.edgeFunction = false;
        console.error('Edge function error:', e);
      }
    }

    setTestResults(results);
    setLoading(false);
  };

  const handleSendOTP = async () => {
    if (!email) {
      alert('Please enter an email address');
      return;
    }

    setLoading(true);
  // Console statement removed by ESLint fix
    const result = await authService.sendOTP(email);
    
    if (result.success) {
      setOtpSent(true);
      alert('OTP sent! Check your email (or Supabase Dashboard > Auth > Logs in development)');
    } else {
      console.error('OTP send failed:', result.error);
      if (result.retryAfter) {
        alert(`Failed to send OTP: ${result.error}\nPlease wait ${Math.ceil(result.retryAfter / 60)} minutes before trying again.`);
      } else {
        alert(`Failed to send OTP: ${result.error}`);
      }
    }
    setLoading(false);
  };

  const handleVerifyOTP = async () => {
    if (!otp) {
      alert('Please enter the OTP code');
      return;
    }

    setLoading(true);
    const result = await authService.verifyOTP(email, otp);
    
    if (result.success) {
      alert(`Success! User ID: ${result.userId}`);
      const user = await getCurrentUser();
      setCurrentUser(user);
      setOtpSent(false);
      setOtp('');
    } else {
      alert(`Verification failed: ${result.error}`);
    }
    setLoading(false);
  };

  const handleSignOut = async () => {
    setLoading(true);
    await signOut();
    setCurrentUser(null);
    setEmail('');
    setOtp('');
    setOtpSent(false);
    alert('Signed out successfully');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#EEE8E1]/20 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#0D0D0D] mb-2">
            Supabase Integration Test
          </h1>
          <p className="text-[#475259]">
            Project: myant-europe (trfrikhxxtzmknjmpgub)
          </p>
        </div>

        {/* Connection Test Card */}
        <MinimalCard>
          <MinimalCardHeader>
            <MinimalCardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5 text-[#004C96]" />
              Connection Status
            </MinimalCardTitle>
          </MinimalCardHeader>
          <MinimalCardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(testResults).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  {value === null ? (
                    <span className="text-gray-400">Not tested</span>
                  ) : value ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>
              ))}
            </div>
            <MinimalButton
              onClick={testConnection}
              disabled={loading}
              variant="primary"
              className="w-full"
            >
              {loading ? 'Testing...' : 'Run Connection Tests'}
            </MinimalButton>
          </MinimalCardContent>
        </MinimalCard>

        {/* Auth Test Card */}
        <MinimalCard>
          <MinimalCardHeader>
            <MinimalCardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#004C96]" />
              Authentication Test
            </MinimalCardTitle>
          </MinimalCardHeader>
          <MinimalCardContent className="space-y-4">
            {currentUser ? (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded">
                  <p className="text-sm text-green-800">
                    <strong>Authenticated User:</strong><br />
                    ID: {currentUser.id}<br />
                    Email: {currentUser.email}
                  </p>
                </div>
                <MinimalButton
                  onClick={handleSignOut}
                  disabled={loading}
                  variant="outline"
                  className="w-full"
                >
                  Sign Out
                </MinimalButton>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-[#0D0D0D] mb-2">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </label>
                  <MinimalInput
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="test@example.com"
                    disabled={loading || otpSent}
                  />
                </div>

                {!otpSent ? (
                  <MinimalButton
                    onClick={handleSendOTP}
                    disabled={loading || !email}
                    variant="primary"
                    className="w-full"
                  >
                    {loading ? 'Sending...' : 'Send OTP'}
                  </MinimalButton>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-[#0D0D0D] mb-2 block">
                        Enter OTP Code
                      </label>
                      <MinimalInput
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="123456"
                        maxLength={6}
                        disabled={loading}
                      />
                    </div>
                    <div className="flex gap-2">
                      <MinimalButton
                        onClick={handleVerifyOTP}
                        disabled={loading || !otp}
                        variant="primary"
                        className="flex-1"
                      >
                        {loading ? 'Verifying...' : 'Verify OTP'}
                      </MinimalButton>
                      <MinimalButton
                        onClick={() => {
                          setOtpSent(false);
                          setOtp('');
                        }}
                        variant="outline"
                        className="flex-1"
                      >
                        Cancel
                      </MinimalButton>
                    </div>
                  </div>
                )}
              </div>
            )}
          </MinimalCardContent>
        </MinimalCard>

        {/* Project Info */}
        <div className="text-center text-sm text-[#475259]">
          <p>Supabase URL: {import.meta.env.VITE_SUPABASE_URL || 'Not configured'}</p>
          <p>Environment: {import.meta.env.VITE_ENV || 'development'}</p>
        </div>
      </div>
    </div>
  );
}