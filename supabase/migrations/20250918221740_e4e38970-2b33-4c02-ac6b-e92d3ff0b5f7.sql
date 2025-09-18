-- Create survey_responses table for client feedback
CREATE TABLE public.survey_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES public.sessions(id),
  tenure TEXT NOT NULL,
  responses JSONB NOT NULL DEFAULT '{}'::jsonb,
  open_feedback JSONB NOT NULL DEFAULT '{}'::jsonb,
  reference_number TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.survey_responses ENABLE ROW LEVEL SECURITY;

-- Create RLS policy to allow all access (since this is a recovery program with no user authentication)
CREATE POLICY "Allow all access to survey_responses" 
ON public.survey_responses 
FOR ALL 
USING (true);

-- Create index for better performance on session_id lookups
CREATE INDEX idx_survey_responses_session_id ON public.survey_responses(session_id);

-- Create index for reference number lookups
CREATE INDEX idx_survey_responses_reference_number ON public.survey_responses(reference_number);