-- Add status column to intake_submissions table
ALTER TABLE public.intake_submissions 
ADD COLUMN status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied'));

-- Add index for faster filtering by status
CREATE INDEX idx_intake_submissions_status ON public.intake_submissions(status);

-- Add admin notes column for denial/approval reasons
ALTER TABLE public.intake_submissions 
ADD COLUMN admin_notes text;