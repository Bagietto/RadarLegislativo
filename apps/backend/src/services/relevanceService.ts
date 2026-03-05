import type { InterestType } from '../types.js';

const PEOPLE_CENTRIC_TERMS = ['saude', 'educacao', 'seguranca', 'transporte', 'moradia', 'assistencia'];
const SELF_INTEREST_TERMS = ['anistia', 'partidario', 'fundo eleitoral', 'beneficio parlamentar'];

export const relevanceService = {
  scoreFromText(text: string): { score: number; label: string; interestType: InterestType } {
    const normalized = text.toLowerCase();
    let score = 30;

    const peopleMatches = PEOPLE_CENTRIC_TERMS.filter((term) => normalized.includes(term)).length;
    const selfMatches = SELF_INTEREST_TERMS.filter((term) => normalized.includes(term)).length;

    score += peopleMatches * 18;
    score -= selfMatches * 12;
    score = Math.max(0, Math.min(100, score));

    const label =
      score >= 70 ? 'Alta relevancia' : score >= 40 ? 'Media relevancia' : 'Baixa relevancia';
    const interestType: InterestType =
      peopleMatches > selfMatches
        ? 'interesse_povo'
        : selfMatches > peopleMatches
          ? 'interesse_proprio'
          : 'nao_classificado';

    return { score, label, interestType };
  },
};
