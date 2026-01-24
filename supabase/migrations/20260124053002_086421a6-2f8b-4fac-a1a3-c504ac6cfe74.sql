-- Drop old columns that are no longer needed
ALTER TABLE public.phones 
DROP COLUMN IF EXISTS brand,
DROP COLUMN IF EXISTS price,
DROP COLUMN IF EXISTS ram,
DROP COLUMN IF EXISTS storage,
DROP COLUMN IF EXISTS processor,
DROP COLUMN IF EXISTS battery,
DROP COLUMN IF EXISTS camera,
DROP COLUMN IF EXISTS display,
DROP COLUMN IF EXISTS ai_verdict;

-- Add new columns for the updated data source
ALTER TABLE public.phones 
ADD COLUMN IF NOT EXISTS current_price numeric NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS original_price numeric,
ADD COLUMN IF NOT EXISTS discount text,
ADD COLUMN IF NOT EXISTS rating numeric;