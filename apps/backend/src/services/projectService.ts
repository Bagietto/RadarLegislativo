import { config } from '../config.js';
import { camaraClient } from '../integrations/camaraClient.js';
import { deputyRepository } from '../repositories/deputyRepository.js';
import { projectRepository } from '../repositories/projectRepository.js';
import { voteRepository } from '../repositories/voteRepository.js';
import { MemoryCache } from '../utils/cache.js';
import { logger } from '../utils/logger.js';
import { relevanceService } from './relevanceService.js';

const projectCache = new MemoryCache<any>(config.cacheTtlMs);

const normalizeVoteValue = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

const buildVoteSummary = (deputies: Array<{ vote: string }>) => {
  let favor = 0;
  let contra = 0;
  let abstencao = 0;

  for (const deputy of deputies) {
    const normalized = normalizeVoteValue(deputy.vote);
    if (normalized === 'sim') {
      favor += 1;
    } else if (normalized === 'nao') {
      contra += 1;
    } else {
      abstencao += 1;
    }
  }

  return {
    total: deputies.length,
    favor,
    contra,
    abstencao,
  };
};

const parseDeputyVote = (item: any): { deputyId: string; name: string; party: string; state: string; photoUrl: string; voteValue: string } => ({
  deputyId: String(item.deputado_?.id ?? item.deputado?.id ?? item.idDeputado ?? ''),
  name: item.deputado_?.nome ?? item.deputado?.nome ?? 'Deputado nao identificado',
  party: item.deputado_?.siglaPartido ?? item.deputado?.siglaPartido ?? '--',
  state: item.deputado_?.siglaUf ?? item.deputado?.siglaUf ?? '--',
  photoUrl: item.deputado_?.urlFoto ?? item.deputado?.urlFoto ?? '',
  voteValue: item.tipoVoto ?? item.voto ?? 'Abstencao',
});

export const projectService = {
  async searchProjects(query: string): Promise<any[]> {
    try {
      const normalizedQuery = query.trim();
      const exactPattern = normalizedQuery.match(/^([A-Za-z]{2,4})\s*(\d+)\/(\d{4})$/);
      const externalProjects = exactPattern
        ? await camaraClient.searchProjectByNumberYear(
            exactPattern[1].toUpperCase(),
            exactPattern[2],
            exactPattern[3],
          )
        : await camaraClient.searchProjects(normalizedQuery);

      const enriched = await Promise.all(
        externalProjects.map(async (project) => {
          try {
            const votacoes = await camaraClient.getVotesByProject(String(project.id));
            return {
              externalId: String(project.id),
              title: `${project.siglaTipo} ${project.numero}/${project.ano}`,
              summary: project.ementa ?? '',
              status: project.statusProposicao?.descricaoSituacao ?? 'Sem status',
              voteDate: votacoes[0]?.dataHoraRegistro ?? null,
              votesCount: votacoes.length,
              source: 'governo',
            };
          } catch {
            return {
              externalId: String(project.id),
              title: `${project.siglaTipo} ${project.numero}/${project.ano}`,
              summary: project.ementa ?? '',
              status: project.statusProposicao?.descricaoSituacao ?? 'Sem status',
              voteDate: null,
              votesCount: 0,
              source: 'governo',
            };
          }
        }),
      );

      const votedProjects = enriched.filter((item) => item.votesCount > 0);
      if (votedProjects.length > 0) {
        return votedProjects;
      }

      return enriched.map((project) => ({
        externalId: project.externalId,
        title: project.title,
        summary: project.summary,
        status: project.status,
        voteDate: project.voteDate,
        votesCount: project.votesCount,
        source: project.source,
      }));
    } catch (error) {
      logger.error('Falha na API externa, usando busca local', { error: (error as Error).message });
      return projectRepository.searchLocal(query).map((project) => ({
        externalId: project.external_id,
        title: project.title,
        summary: project.summary,
        status: project.status,
        voteDate: project.vote_date,
        votesCount: 0,
        source: 'local',
      }));
    }
  },

  async getProjectDetailAndPersist(externalId: string): Promise<any> {
    const cached = projectCache.get(externalId);
    const cachedProjectInDb = projectRepository.findByExternalId(externalId);
    if (cached && cachedProjectInDb && Array.isArray(cached.deputies) && cached.deputies.length > 0) {
      return cached;
    }

    const fallbackProject = cachedProjectInDb;

    try {
      const [projectRaw, votacoes] = await Promise.all([
        camaraClient.getProject(externalId),
        camaraClient.getVotesByProject(externalId),
      ]);

      const summary = projectRaw.ementa ?? projectRaw.descricao ?? '';
      const relevance = relevanceService.scoreFromText(summary);

      let selectedVoting: any | null = null;
      let votesRaw: any[] = [];

      for (const voting of votacoes) {
        const votes = await camaraClient.getVoteOrientations(String(voting.id));
        if (votes.length > 0) {
          selectedVoting = voting;
          votesRaw = votes;
          break;
        }
      }

      const project = projectRepository.upsert({
        externalId,
        title: `${projectRaw.siglaTipo} ${projectRaw.numero}/${projectRaw.ano}`,
        summary,
        status: projectRaw.statusProposicao?.descricaoSituacao ?? 'Sem status',
        voteDate: selectedVoting?.dataHoraRegistro ?? votacoes[0]?.dataHoraRegistro ?? null,
        relevanceScore: relevance.score,
        relevanceLabel: relevance.label,
        interestType: relevance.interestType,
      });

      for (const voteRaw of votesRaw) {
        const normalized = parseDeputyVote(voteRaw);
        if (!normalized.deputyId) continue;

        const deputy = deputyRepository.upsert({
          externalId: normalized.deputyId,
          name: normalized.name,
          party: normalized.party,
          state: normalized.state,
          photoUrl: normalized.photoUrl,
        });

        voteRepository.upsert({
          projectId: project.id,
          deputyId: deputy.id,
          voteValue: normalized.voteValue,
          voteDateTime: selectedVoting?.dataHoraRegistro ?? null,
        });
      }

      const deputies = voteRepository.listByProject(project.id).map((vote) => ({
        externalId: String(vote.deputy_id),
        photoUrl: vote.photo_url,
        name: vote.deputy_name,
        party: vote.party,
        state: vote.state,
        vote: vote.vote_value,
      }));
      const voteSummary = buildVoteSummary(deputies);

      const payload = {
        project: {
          externalId: project.external_id,
          title: project.title,
          summary: project.summary,
          status: project.status,
          voteDate: project.vote_date,
          source: 'governo',
          votingInfo: {
            votingId: selectedVoting?.id ?? null,
            totalVotacoesEncontradas: votacoes.length,
            totalVotosNominais: votesRaw.length,
          },
          voteSummary,
          relevance: {
            score: project.relevance_score,
            label: project.relevance_label,
            interestType: project.interest_type,
          },
        },
        deputies,
      };

      projectCache.set(externalId, payload);
      return payload;
    } catch (error) {
      logger.error('Falha ao buscar projeto na API externa', { externalId, error: (error as Error).message });
      if (!fallbackProject) {
        throw new Error('Projeto nao encontrado na API externa e nem na base local.');
      }
      return {
        project: {
          externalId: fallbackProject.external_id,
          title: fallbackProject.title,
          summary: fallbackProject.summary,
          status: fallbackProject.status,
          voteDate: fallbackProject.vote_date,
          source: 'local',
          voteSummary: (() => {
            const localDeputies = voteRepository.listByProject(fallbackProject.id).map((vote) => ({
              vote: vote.vote_value,
            }));
            return buildVoteSummary(localDeputies);
          })(),
          relevance: {
            score: fallbackProject.relevance_score,
            label: fallbackProject.relevance_label,
            interestType: fallbackProject.interest_type,
          },
        },
        deputies: (() => {
          const localDeputies = voteRepository.listByProject(fallbackProject.id).map((vote) => ({
            externalId: String(vote.deputy_id),
            photoUrl: vote.photo_url,
            name: vote.deputy_name,
            party: vote.party,
            state: vote.state,
            vote: vote.vote_value,
          }));
          return localDeputies;
        })(),
      };
    }
  },
};
