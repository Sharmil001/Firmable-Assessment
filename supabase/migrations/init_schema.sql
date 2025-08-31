-- Create single companies table
CREATE TABLE IF NOT EXISTS companies (
  id BIGSERIAL PRIMARY KEY,
  abn TEXT UNIQUE NOT NULL,
  abn_status TEXT,
  entity_type TEXT,
  entity_name TEXT NOT NULL,
  trading_name TEXT,
  gst_status TEXT,
  registration_date TEXT,
  last_updated_date TEXT,
  business_names JSONB, -- Store array of names as JSON
  addresse JSONB,      -- Store address object as JSON
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster searching
CREATE INDEX IF NOT EXISTS idx_abn ON companies (abn);
