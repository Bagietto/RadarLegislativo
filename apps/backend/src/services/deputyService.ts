import { deputyRepository } from '../repositories/deputyRepository.js';
import { voteRepository } from '../repositories/voteRepository.js';

const calculatePercent = (part: number, total: number): number => {
  if (!total) return 0;
  return Number(((part / total) * 100).toFixed(2));
};

export const deputyService = {
  searchDeputies(query: string): any[] {
    return deputyRepository.searchLocal(query).map((deputy) => ({
      externalId: deputy.external_id,
      name: deputy.name,
      party: deputy.party,
      state: deputy.state,
      photoUrl: deputy.photo_url,
    }));
  },

  getDeputyHistory(externalId: string): any {
    const deputy = deputyRepository.findByExternalId(externalId);
    if (!deputy) {
      throw new Error('Deputado nao encontrado na base local.');
    }

    const votes = voteRepository.listByDeputy(deputy.id).map((vote) => ({
      projectExternalId: vote.project_external_id,
      projectTitle: vote.project_title,
      vote: vote.vote_value,
      voteDateTime: vote.vote_datetime,
      relevanceScore: vote.relevance_score,
      relevanceLabel: vote.relevance_label,
      interestType: vote.interest_type,
    }));

    const classified = votes.filter((vote) =>
      ['interesse_povo', 'interesse_proprio'].includes(vote.interestType),
    );
    const peopleCount = classified.filter((vote) => vote.interestType === 'interesse_povo').length;
    const selfCount = classified.filter((vote) => vote.interestType === 'interesse_proprio').length;

    return {
      deputy: {
        externalId: deputy.external_id,
        name: deputy.name,
        party: deputy.party,
        state: deputy.state,
        photoUrl: deputy.photo_url,
      },
      metrics: {
        interessePovoPercent: calculatePercent(peopleCount, classified.length),
        interesseProprioPercent: calculatePercent(selfCount, classified.length),
        totalClassificavel: classified.length,
      },
      votes,
    };
  },
};
