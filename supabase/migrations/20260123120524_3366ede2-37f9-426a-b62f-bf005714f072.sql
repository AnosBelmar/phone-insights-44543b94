-- Create phones table for mobile price portal
CREATE TABLE public.phones (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    price NUMERIC NOT NULL,
    ram TEXT,
    storage TEXT,
    processor TEXT,
    battery TEXT,
    camera TEXT,
    display TEXT,
    image_url TEXT,
    ai_verdict TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster lookups
CREATE INDEX idx_phones_brand ON public.phones(brand);
CREATE INDEX idx_phones_slug ON public.phones(slug);

-- Enable Row Level Security
ALTER TABLE public.phones ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (phones are public data)
CREATE POLICY "Anyone can view phones" 
ON public.phones 
FOR SELECT 
USING (true);

-- Create policy for authenticated admin operations (we'll add proper admin roles later)
CREATE POLICY "Authenticated users can insert phones" 
ON public.phones 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update phones" 
ON public.phones 
FOR UPDATE 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete phones" 
ON public.phones 
FOR DELETE 
TO authenticated
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_phones_updated_at
BEFORE UPDATE ON public.phones
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample phone data
INSERT INTO public.phones (name, brand, slug, price, ram, storage, processor, battery, camera, display, image_url) VALUES
('iPhone 15 Pro Max', 'Apple', 'iphone-15-pro-max', 1199, '8GB', '256GB', 'A17 Pro', '4422mAh', '48MP + 12MP + 12MP', '6.7" Super Retina XDR OLED', NULL),
('iPhone 15 Pro', 'Apple', 'iphone-15-pro', 999, '8GB', '128GB', 'A17 Pro', '3274mAh', '48MP + 12MP + 12MP', '6.1" Super Retina XDR OLED', NULL),
('iPhone 15', 'Apple', 'iphone-15', 799, '6GB', '128GB', 'A16 Bionic', '3349mAh', '48MP + 12MP', '6.1" Super Retina XDR OLED', NULL),
('Samsung Galaxy S24 Ultra', 'Samsung', 'samsung-galaxy-s24-ultra', 1299, '12GB', '256GB', 'Snapdragon 8 Gen 3', '5000mAh', '200MP + 50MP + 12MP + 10MP', '6.8" Dynamic AMOLED 2X', NULL),
('Samsung Galaxy S24+', 'Samsung', 'samsung-galaxy-s24-plus', 999, '12GB', '256GB', 'Exynos 2400', '4900mAh', '50MP + 12MP + 10MP', '6.7" Dynamic AMOLED 2X', NULL),
('Samsung Galaxy S24', 'Samsung', 'samsung-galaxy-s24', 799, '8GB', '128GB', 'Exynos 2400', '4000mAh', '50MP + 12MP + 10MP', '6.2" Dynamic AMOLED 2X', NULL),
('Google Pixel 8 Pro', 'Google', 'google-pixel-8-pro', 999, '12GB', '128GB', 'Tensor G3', '5050mAh', '50MP + 48MP + 48MP', '6.7" LTPO OLED', NULL),
('Google Pixel 8', 'Google', 'google-pixel-8', 699, '8GB', '128GB', 'Tensor G3', '4575mAh', '50MP + 12MP', '6.2" OLED', NULL),
('OnePlus 12', 'OnePlus', 'oneplus-12', 799, '12GB', '256GB', 'Snapdragon 8 Gen 3', '5400mAh', '50MP + 48MP + 64MP', '6.82" LTPO AMOLED', NULL),
('OnePlus 12R', 'OnePlus', 'oneplus-12r', 499, '8GB', '128GB', 'Snapdragon 8 Gen 2', '5500mAh', '50MP + 8MP + 2MP', '6.78" AMOLED', NULL),
('Xiaomi 14 Ultra', 'Xiaomi', 'xiaomi-14-ultra', 1299, '16GB', '512GB', 'Snapdragon 8 Gen 3', '5000mAh', '50MP + 50MP + 50MP + 50MP', '6.73" LTPO AMOLED', NULL),
('Xiaomi 14', 'Xiaomi', 'xiaomi-14', 799, '12GB', '256GB', 'Snapdragon 8 Gen 3', '4610mAh', '50MP + 50MP + 50MP', '6.36" LTPO AMOLED', NULL),
('OPPO Find X7 Ultra', 'OPPO', 'oppo-find-x7-ultra', 999, '16GB', '256GB', 'Snapdragon 8 Gen 3', '5000mAh', '50MP + 50MP + 50MP + 50MP', '6.82" LTPO AMOLED', NULL),
('Realme GT 5 Pro', 'Realme', 'realme-gt-5-pro', 599, '12GB', '256GB', 'Snapdragon 8 Gen 3', '5400mAh', '50MP + 50MP + 8MP', '6.78" AMOLED', NULL),
('Vivo X100 Pro', 'Vivo', 'vivo-x100-pro', 899, '16GB', '256GB', 'Dimensity 9300', '5400mAh', '50MP + 50MP + 50MP', '6.78" LTPO AMOLED', NULL);

-- Enable realtime for phones table (optional, for live updates)
ALTER PUBLICATION supabase_realtime ADD TABLE public.phones;