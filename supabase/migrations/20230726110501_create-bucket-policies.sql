create policy "User can insert into own folder" 
ON storage.objects 
FOR INSERT TO public 
WITH CHECK (
    bucket_id = 'uploads' 
    AND (storage.foldername(name))[1] = 'users' 
    AND (storage.foldername(name))[2] = auth.uid()::text
    AND (storage.foldername(name))[3] = 'creations'
    AND auth.role() = 'authenticated'
);

create policy "User can update in own folder" 
ON storage.objects 
AS PERMISSIVE FOR UPDATE
TO public 
WITH CHECK (
    bucket_id = 'uploads' 
    AND (storage.foldername(name))[1] = 'users' 
    AND (storage.foldername(name))[2] = auth.uid()::text
    AND (storage.foldername(name))[3] = 'creations'
    AND auth.role() = 'authenticated'
);

create policy "User can delete in own folder" 
ON storage.objects 
AS PERMISSIVE FOR DELETE 
TO public 
USING (
    bucket_id = 'uploads' 
    AND (storage.foldername(name))[1] = 'users' 
    AND (storage.foldername(name))[2] = auth.uid()::text
    AND (storage.foldername(name))[3] = 'creations'
    AND auth.role() = 'authenticated'
);