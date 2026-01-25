-- Add phone specification columns
ALTER TABLE public.phones
ADD COLUMN IF NOT EXISTS processor text,
ADD COLUMN IF NOT EXISTS ram text,
ADD COLUMN IF NOT EXISTS storage text,
ADD COLUMN IF NOT EXISTS battery text,
ADD COLUMN IF NOT EXISTS main_camera text,
ADD COLUMN IF NOT EXISTS selfie_camera text,
ADD COLUMN IF NOT EXISTS display_size text,
ADD COLUMN IF NOT EXISTS display_type text,
ADD COLUMN IF NOT EXISTS os text,
ADD COLUMN IF NOT EXISTS network text,
ADD COLUMN IF NOT EXISTS weight text,
ADD COLUMN IF NOT EXISTS dimensions text;