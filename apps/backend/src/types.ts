export type VoteValue = 'Sim' | 'Nao' | 'Abstencao' | 'Obstrucao' | 'Artigo17';

export type InterestType = 'interesse_povo' | 'interesse_proprio' | 'nao_classificado';

export interface Project {
  id: number;
  external_id: string;
  title: string;
  summary: string;
  status: string;
  vote_date: string | null;
  relevance_score: number;
  relevance_label: string;
  interest_type: InterestType;
  is_relevant: number;
  created_at: string;
  updated_at: string;
}

export interface Deputy {
  id: number;
  external_id: string;
  name: string;
  party: string;
  state: string;
  photo_url: string;
}

export interface Vote {
  id: number;
  project_id: number;
  deputy_id: number;
  vote_value: VoteValue;
  vote_datetime: string | null;
}
