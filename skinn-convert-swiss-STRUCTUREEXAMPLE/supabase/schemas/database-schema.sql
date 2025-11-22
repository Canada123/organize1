-- SKIIN Eligibility Form Database Schema
-- Create this table in your Supabase project

-- Enable Row Level Security
CREATE TABLE IF NOT EXISTS form_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  -- Session tracking
  session_id TEXT NOT NULL,
  
  -- Eligibility data
  symptoms TEXT,
  risk_factors TEXT,
  insurance_model TEXT,
  eligibility_result JSONB,
  
  -- Contact information
  contact_method TEXT CHECK (contact_method IN ('email', 'phone')),
  contact_value TEXT,
  phone_verified BOOLEAN DEFAULT false,
  email_verified BOOLEAN DEFAULT false,
  
  -- Insurance details
  insurance_provider TEXT,
  insurance_model_selected TEXT,
  
  -- Payment information
  payment_intent_id TEXT,
  payment_status TEXT CHECK (payment_status IN ('pending', 'completed', 'failed', 'cancelled')) DEFAULT 'pending',
  
  -- Metadata
  user_agent TEXT,
  ip_address INET,
  referrer TEXT
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_form_submissions_session_id ON form_submissions(session_id);
CREATE INDEX IF NOT EXISTS idx_form_submissions_created_at ON form_submissions(created_at);
CREATE INDEX IF NOT EXISTS idx_form_submissions_contact_method ON form_submissions(contact_method);
CREATE INDEX IF NOT EXISTS idx_form_submissions_payment_status ON form_submissions(payment_status);

-- Enable RLS (Row Level Security)
ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;

-- Create policy for anonymous users to insert and update their own records
CREATE POLICY "Allow anonymous users to manage their submissions" ON form_submissions
  FOR ALL USING (
    -- Allow if user is anonymous and session matches
    auth.role() = 'anon' AND session_id IS NOT NULL
  );

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_form_submissions_updated_at 
  BEFORE UPDATE ON form_submissions 
  FOR EACH ROW 
  EXECUTE PROCEDURE update_updated_at_column();

-- Optional: Create a view for analytics (without sensitive data)
CREATE OR REPLACE VIEW form_analytics AS
SELECT 
  id,
  created_at,
  symptoms,
  risk_factors,
  insurance_model,
  contact_method,
  phone_verified,
  email_verified,
  insurance_provider,
  insurance_model_selected,
  payment_status,
  (eligibility_result->>'eligible')::boolean as eligible,
  (eligibility_result->>'coverage') as coverage_type
FROM form_submissions
WHERE contact_value IS NOT NULL; -- Only include completed forms

-- Grant access to the analytics view
GRANT SELECT ON form_analytics TO anon, authenticated;