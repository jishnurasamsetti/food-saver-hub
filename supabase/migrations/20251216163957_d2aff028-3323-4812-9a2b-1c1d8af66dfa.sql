-- Create food_submissions table
CREATE TABLE public.food_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  food_type TEXT NOT NULL,
  quantity DECIMAL NOT NULL,
  unit TEXT NOT NULL DEFAULT 'kg',
  location TEXT NOT NULL,
  latitude DECIMAL,
  longitude DECIMAL,
  event_type TEXT,
  notes TEXT,
  status TEXT DEFAULT 'available',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create NGOs table with sample data
CREATE TABLE public.ngos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  latitude DECIMAL NOT NULL,
  longitude DECIMAL NOT NULL,
  contact_phone TEXT,
  contact_email TEXT,
  description TEXT,
  capacity_kg DECIMAL DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.food_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ngos ENABLE ROW LEVEL SECURITY;

-- Public read/write policies for MVP (no auth required)
CREATE POLICY "Anyone can view food submissions" 
ON public.food_submissions FOR SELECT USING (true);

CREATE POLICY "Anyone can create food submissions" 
ON public.food_submissions FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update food submissions" 
ON public.food_submissions FOR UPDATE USING (true);

CREATE POLICY "Anyone can view NGOs" 
ON public.ngos FOR SELECT USING (true);

-- Insert sample NGO data
INSERT INTO public.ngos (name, address, latitude, longitude, contact_phone, contact_email, description, capacity_kg) VALUES
('City Food Bank', '123 Main Street, Downtown', 40.7128, -74.0060, '+1-555-0101', 'contact@cityfoodbank.org', 'Serving the downtown community since 1990', 500),
('Hope Kitchen', '456 Oak Avenue, Westside', 40.7580, -73.9855, '+1-555-0102', 'info@hopekitchen.org', 'Providing meals to those in need', 200),
('Community Pantry', '789 Elm Road, Eastside', 40.7489, -73.9680, '+1-555-0103', 'help@communitypantry.org', 'Local neighborhood food assistance', 150),
('Meals on Wheels', '321 Pine Street, Northside', 40.7614, -73.9776, '+1-555-0104', 'deliver@mealsonwheels.org', 'Home delivery for seniors and disabled', 300),
('Second Harvest', '654 Maple Drive, Southside', 40.7282, -73.7949, '+1-555-0105', 'donate@secondharvest.org', 'Rescuing food, feeding families', 400);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_food_submissions_updated_at
BEFORE UPDATE ON public.food_submissions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();