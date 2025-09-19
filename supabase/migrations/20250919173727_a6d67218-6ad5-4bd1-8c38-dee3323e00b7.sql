-- Add location column to survey_responses table
ALTER TABLE public.survey_responses 
ADD COLUMN location text;