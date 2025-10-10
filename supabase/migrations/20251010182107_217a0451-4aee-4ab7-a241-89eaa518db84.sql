-- Create intake_submissions table to store all intake form field entries
CREATE TABLE public.intake_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES public.sessions(id),
  reference_number TEXT NOT NULL,
  
  -- Personal Information
  first_name TEXT,
  last_name TEXT,
  date_of_birth DATE,
  ssn_last_four TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  
  -- Emergency Contact
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  emergency_contact_relationship TEXT,
  
  -- Insurance & Financial
  insurance_provider TEXT,
  insurance_policy_number TEXT,
  insurance_group_number TEXT,
  employment_status TEXT,
  
  -- Medical History
  primary_physician TEXT,
  current_medications JSONB DEFAULT '[]'::jsonb,
  allergies JSONB DEFAULT '[]'::jsonb,
  medical_conditions JSONB DEFAULT '[]'::jsonb,
  
  -- Substance Use History
  substances_used JSONB DEFAULT '[]'::jsonb,
  previous_treatment TEXT,
  last_use_date DATE,
  
  -- Mental Health
  mental_health_history TEXT,
  current_mental_health_treatment BOOLEAN DEFAULT false,
  psychiatric_medications JSONB DEFAULT '[]'::jsonb,
  
  -- Legal & Background
  legal_issues TEXT,
  probation_parole BOOLEAN DEFAULT false,
  criminal_history TEXT,
  
  -- Additional Information
  referral_source TEXT,
  additional_notes TEXT,
  form_data JSONB DEFAULT '{}'::jsonb,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.intake_submissions ENABLE ROW LEVEL SECURITY;

-- Create policy for all access
CREATE POLICY "Allow all access to intake_submissions"
  ON public.intake_submissions
  FOR ALL
  USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_intake_submissions_updated_at
  BEFORE UPDATE ON public.intake_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster lookups
CREATE INDEX idx_intake_submissions_reference_number ON public.intake_submissions(reference_number);
CREATE INDEX idx_intake_submissions_session_id ON public.intake_submissions(session_id);
CREATE INDEX idx_intake_submissions_created_at ON public.intake_submissions(created_at DESC);