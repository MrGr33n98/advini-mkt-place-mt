-- Policies for reviews table
CREATE POLICY "Lawyers can manage their reviews" 
ON reviews FOR ALL 
USING (lawyer_id IN (SELECT id FROM lawyers WHERE user_id = auth.uid()));

CREATE POLICY "Anyone can view approved reviews" 
ON reviews FOR SELECT 
USING (status = 'approved');