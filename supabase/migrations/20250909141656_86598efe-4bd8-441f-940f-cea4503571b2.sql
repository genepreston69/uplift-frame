-- Create external_links table
CREATE TABLE public.external_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  guide_text TEXT,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.external_links ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for public access
CREATE POLICY "Allow all access to external_links" 
ON public.external_links 
FOR ALL 
USING (true);

-- Add trigger for updated_at
CREATE TRIGGER update_external_links_updated_at
BEFORE UPDATE ON public.external_links
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();