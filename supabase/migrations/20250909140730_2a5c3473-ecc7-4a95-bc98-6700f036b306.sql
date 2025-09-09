-- Create storage bucket for resource files
INSERT INTO storage.buckets (id, name, public) VALUES ('resources', 'resources', true);

-- Create RLS policies for resource files
CREATE POLICY "Resource files are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'resources');

CREATE POLICY "Authenticated users can upload resource files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'resources');

CREATE POLICY "Authenticated users can update resource files" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'resources');

CREATE POLICY "Authenticated users can delete resource files" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'resources');