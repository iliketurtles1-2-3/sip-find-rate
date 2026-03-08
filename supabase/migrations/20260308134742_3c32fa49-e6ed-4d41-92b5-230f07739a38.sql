-- Drop restrictive policies on wines
DROP POLICY IF EXISTS "Users can view their own wines" ON wines;
DROP POLICY IF EXISTS "Users can insert their own wines" ON wines;
DROP POLICY IF EXISTS "Users can update their own wines" ON wines;
DROP POLICY IF EXISTS "Users can delete their own wines" ON wines;

-- Recreate as permissive
CREATE POLICY "Users can view their own wines" ON wines FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own wines" ON wines FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own wines" ON wines FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own wines" ON wines FOR DELETE USING (auth.uid() = user_id);

-- Fix profiles too
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = user_id);