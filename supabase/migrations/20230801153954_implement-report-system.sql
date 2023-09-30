CREATE TABLE reports (
    id SERIAL PRIMARY KEY,
    reporter_id UUID NOT NULL REFERENCES auth.users,
    creation_id UUID NOT NULL REFERENCES creations (id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Can insert report" 
ON reports FOR INSERT 
WITH CHECK (auth.uid() = reporter_id);