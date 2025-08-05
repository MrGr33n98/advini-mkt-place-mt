-- Policies for lawyers table
CREATE POLICY "Lawyers can manage their own profile" 
ON lawyers FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view approved lawyer profiles" 
ON lawyers FOR SELECT 
USING (status = 'approved');