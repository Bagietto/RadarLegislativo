export type InterestType = 'interesse_povo' | 'interesse_proprio' | 'nao_classificado';

export interface DeputySummary {
  externalId: string;
  name: string;
  party: string;
  state: string;
  photoUrl: string;
}
