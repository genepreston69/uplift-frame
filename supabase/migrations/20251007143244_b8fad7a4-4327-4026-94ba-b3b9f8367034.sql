-- Add new submission types for website and resource requests
-- First, drop the existing check constraint
ALTER TABLE public.submissions DROP CONSTRAINT IF EXISTS submissions_type_check;

-- Add updated check constraint with new types
ALTER TABLE public.submissions ADD CONSTRAINT submissions_type_check 
  CHECK (type IN ('survey', 'grievance', 'innovation', 'website_request', 'resource_request'));

-- Create index for faster filtering by type
CREATE INDEX IF NOT EXISTS idx_submissions_type ON public.submissions(type);
CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON public.submissions(created_at DESC);