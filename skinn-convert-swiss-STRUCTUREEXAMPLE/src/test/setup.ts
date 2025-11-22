import { vi } from 'vitest';

// Mock environment variables
vi.stubEnv('VITE_SUPABASE_URL', 'https://trfrikhxxtzmknjmpgub.supabase.co');
vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRyZnJpa2h4eHR6bWtuam1wZ3ViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3MzA1NTYsImV4cCI6MjA2MzMwNjU1Nn0.SHfsMDCQcXbL0auHK3Ct8oTBcjNWoTt03LQhvRdiTWA');