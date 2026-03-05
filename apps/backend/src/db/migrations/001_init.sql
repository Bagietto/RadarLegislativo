CREATE TABLE IF NOT EXISTS projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  external_id TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  status TEXT NOT NULL,
  vote_date TEXT,
  relevance_score INTEGER NOT NULL DEFAULT 0,
  relevance_label TEXT NOT NULL DEFAULT 'Baixa relevancia',
  interest_type TEXT NOT NULL DEFAULT 'nao_classificado',
  is_relevant INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS deputies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  external_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  party TEXT NOT NULL,
  state TEXT NOT NULL,
  photo_url TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS votes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL,
  deputy_id INTEGER NOT NULL,
  vote_value TEXT NOT NULL,
  vote_datetime TEXT,
  UNIQUE(project_id, deputy_id),
  FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY(deputy_id) REFERENCES deputies(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_projects_external_id ON projects(external_id);
CREATE INDEX IF NOT EXISTS idx_deputies_external_id ON deputies(external_id);
CREATE INDEX IF NOT EXISTS idx_votes_project_id ON votes(project_id);
CREATE INDEX IF NOT EXISTS idx_votes_deputy_id ON votes(deputy_id);
