
-- Remove the "Figmant:" prefix from all template names in the design_use_cases table
UPDATE public.design_use_cases 
SET name = REPLACE(name, 'Figmant: ', '')
WHERE name LIKE 'Figmant:%';
