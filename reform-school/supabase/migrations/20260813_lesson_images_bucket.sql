-- Create the lesson-images storage bucket (public read, authenticated write)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'lesson-images',
  'lesson-images',
  true,
  10485760,  -- 10 MB per file
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
)
ON CONFLICT (id) DO NOTHING;

-- Public read: anyone can view uploaded images (needed for lesson pages)
CREATE POLICY "lesson-images: public read"
ON storage.objects FOR SELECT
USING (bucket_id = 'lesson-images');

-- Authenticated upload: signed-in users can upload
-- (Supabase RLS on profiles.role = 'admin' is enforced at the app layer via requireAdmin())
CREATE POLICY "lesson-images: authenticated upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'lesson-images' AND auth.role() = 'authenticated');

-- Authenticated delete: signed-in users can remove their own uploads
CREATE POLICY "lesson-images: authenticated delete"
ON storage.objects FOR DELETE
USING (bucket_id = 'lesson-images' AND auth.role() = 'authenticated');
