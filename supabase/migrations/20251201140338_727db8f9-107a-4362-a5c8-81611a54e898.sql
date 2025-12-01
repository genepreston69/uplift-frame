-- Add status column to submissions table for tracking request approvals
ALTER TABLE public.submissions 
ADD COLUMN IF NOT EXISTS status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied'));

-- Add admin notes column for approval/denial reasons
ALTER TABLE public.submissions 
ADD COLUMN IF NOT EXISTS admin_notes text;

-- Add index for faster filtering by status
CREATE INDEX IF NOT EXISTS idx_submissions_status ON public.submissions(status);