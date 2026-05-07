/*
  # Fix RLS Policies - Enforce Ownership-Based Access

  Adds `created_by` column to donors, receptors, and compatibility_analysis
  tables and replaces the permissive write policies with ownership-scoped ones.
*/

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'donors' AND column_name = 'created_by') THEN
    ALTER TABLE public.donors ADD COLUMN created_by uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id);
  END IF;
END $$;

DROP POLICY IF EXISTS "Authenticated users can insert donors" ON public.donors;
DROP POLICY IF EXISTS "Authenticated users can update donors" ON public.donors;
DROP POLICY IF EXISTS "Authenticated users can delete donors" ON public.donors;

CREATE POLICY "Owners can insert donors" ON public.donors FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Owners can update donors" ON public.donors FOR UPDATE TO authenticated USING (auth.uid() = created_by) WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Owners can delete donors" ON public.donors FOR DELETE TO authenticated USING (auth.uid() = created_by);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'receptors' AND column_name = 'created_by') THEN
    ALTER TABLE public.receptors ADD COLUMN created_by uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id);
  END IF;
END $$;

DROP POLICY IF EXISTS "Authenticated users can insert receptors" ON public.receptors;
DROP POLICY IF EXISTS "Authenticated users can update receptors" ON public.receptors;
DROP POLICY IF EXISTS "Authenticated users can delete receptors" ON public.receptors;

CREATE POLICY "Owners can insert receptors" ON public.receptors FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Owners can update receptors" ON public.receptors FOR UPDATE TO authenticated USING (auth.uid() = created_by) WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Owners can delete receptors" ON public.receptors FOR DELETE TO authenticated USING (auth.uid() = created_by);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'compatibility_analysis' AND column_name = 'created_by') THEN
    ALTER TABLE public.compatibility_analysis ADD COLUMN created_by uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id);
  END IF;
END $$;

DROP POLICY IF EXISTS "Authenticated users can insert analyses" ON public.compatibility_analysis;
DROP POLICY IF EXISTS "Authenticated users can update analyses" ON public.compatibility_analysis;
DROP POLICY IF EXISTS "Authenticated users can delete analyses" ON public.compatibility_analysis;

CREATE POLICY "Owners can insert analyses" ON public.compatibility_analysis FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Owners can update analyses" ON public.compatibility_analysis FOR UPDATE TO authenticated USING (auth.uid() = created_by) WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Owners can delete analyses" ON public.compatibility_analysis FOR DELETE TO authenticated USING (auth.uid() = created_by);
