
-- Create wine photos storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('wine-photos', 'wine-photos', true);

-- Allow authenticated users to upload to wine-photos bucket
CREATE POLICY "Users can upload wine photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'wine-photos' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Allow anyone to view wine photos (public bucket)
CREATE POLICY "Anyone can view wine photos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'wine-photos');

-- Allow users to delete their own wine photos
CREATE POLICY "Users can delete their own wine photos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'wine-photos' AND (storage.foldername(name))[1] = auth.uid()::text);
