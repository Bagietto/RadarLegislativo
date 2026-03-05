export interface ProjectSearchItem {
  externalId: string;
  title: string;
  summary: string;
  status: string;
  voteDate?: string | null;
  votesCount?: number;
  source?: 'governo' | 'local';
}

export interface ProjectDetailResponse {
  project: {
    externalId: string;
    title: string;
    summary: string;
    status: string;
    voteDate: string | null;
    source?: 'governo' | 'local';
    voteSummary?: {
      total: number;
      favor: number;
      contra: number;
      abstencao: number;
    };
    relevance: {
      score: number;
      label: string;
      interestType: string;
    };
  };
  deputies: Array<{
    externalId: string;
    photoUrl: string;
    name: string;
    party: string;
    state: string;
    vote: string;
  }>;
}

export interface DeputySearchItem {
  externalId: string;
  name: string;
  party: string;
  state: string;
  photoUrl: string;
}

export interface DeputyHistoryResponse {
  deputy: DeputySearchItem;
  metrics: {
    interessePovoPercent: number;
    interesseProprioPercent: number;
    totalClassificavel: number;
  };
  votes: Array<{
    projectExternalId: string;
    projectTitle: string;
    vote: string;
    voteDateTime: string | null;
    relevanceScore: number;
    relevanceLabel: string;
    interestType: string;
  }>;
}
