import { runMigrations } from './migrate.js';
import { projectRepository } from '../repositories/projectRepository.js';
import { deputyRepository } from '../repositories/deputyRepository.js';
import { voteRepository } from '../repositories/voteRepository.js';

runMigrations();

const project = projectRepository.upsert({
  externalId: 'SEED-PL-001',
  title: 'PL 001/2026',
  summary: 'Projeto de saude publica e educacao basica.',
  status: 'Aprovado',
  voteDate: new Date().toISOString(),
  relevanceScore: 82,
  relevanceLabel: 'Alta relevancia',
  interestType: 'interesse_povo',
});

const deputy = deputyRepository.upsert({
  externalId: '1001',
  name: 'Deputado Exemplo',
  party: 'ABC',
  state: 'SP',
  photoUrl: '',
});

voteRepository.upsert({
  projectId: project.id,
  deputyId: deputy.id,
  voteValue: 'Sim',
  voteDateTime: new Date().toISOString(),
});

console.log('Seed concluida.');
