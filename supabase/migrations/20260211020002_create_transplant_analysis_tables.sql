/*
  # Sistema de Análise de Viabilidade de Transplante Hepático

  1. Novas Tabelas
    - `donors` - Dados do doador
    - `receptors` - Dados do receptor
    - `compatibility_analysis` - Análise de compatibilidade

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS donors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  age integer NOT NULL CHECK (age >= 0 AND age <= 150),
  gender text NOT NULL CHECK (gender IN ('M', 'F')),
  weight numeric NOT NULL CHECK (weight > 0),
  height numeric NOT NULL CHECK (height > 0),
  hepatic_steatosis text NOT NULL CHECK (hepatic_steatosis IN ('ausente', 'leve', 'moderada', 'grave')),
  active_infections boolean DEFAULT false,
  blood_type text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS receptors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id text NOT NULL,
  name text NOT NULL,
  age integer NOT NULL CHECK (age >= 0 AND age <= 150),
  gender text NOT NULL CHECK (gender IN ('M', 'F')),
  weight numeric NOT NULL CHECK (weight > 0),
  height numeric NOT NULL CHECK (height > 0),
  meld_na numeric NOT NULL CHECK (meld_na >= 0 AND meld_na <= 40),
  renal_disease_creatinine numeric CHECK (renal_disease_creatinine >= 0),
  collateral_circulation boolean DEFAULT false,
  hepatocellular_carcinoma boolean DEFAULT false,
  blood_type text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS compatibility_analysis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id uuid REFERENCES donors(id) ON DELETE CASCADE,
  receptor_id uuid REFERENCES receptors(id) ON DELETE CASCADE,
  risk_level text NOT NULL CHECK (risk_level IN ('critical', 'moderate', 'favorable')),
  risk_score numeric NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
  critical_factors jsonb DEFAULT '[]'::jsonb,
  warning_factors jsonb DEFAULT '[]'::jsonb,
  analysis_date timestamptz DEFAULT now(),
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE receptors ENABLE ROW LEVEL SECURITY;
ALTER TABLE compatibility_analysis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view all donors" ON donors FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert donors" ON donors FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update donors" ON donors FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can delete donors" ON donors FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can view all receptors" ON receptors FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert receptors" ON receptors FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update receptors" ON receptors FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can delete receptors" ON receptors FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can view all analyses" ON compatibility_analysis FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert analyses" ON compatibility_analysis FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update analyses" ON compatibility_analysis FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can delete analyses" ON compatibility_analysis FOR DELETE TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_donors_age ON donors(age);
CREATE INDEX IF NOT EXISTS idx_donors_blood_type ON donors(blood_type);
CREATE INDEX IF NOT EXISTS idx_receptors_patient_id ON receptors(patient_id);
CREATE INDEX IF NOT EXISTS idx_receptors_meld_na ON receptors(meld_na);
CREATE INDEX IF NOT EXISTS idx_receptors_blood_type ON receptors(blood_type);
CREATE INDEX IF NOT EXISTS idx_compatibility_donor ON compatibility_analysis(donor_id);
CREATE INDEX IF NOT EXISTS idx_compatibility_receptor ON compatibility_analysis(receptor_id);
CREATE INDEX IF NOT EXISTS idx_compatibility_risk ON compatibility_analysis(risk_level);
