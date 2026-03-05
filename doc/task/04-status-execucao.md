# Status de Execucao das Tasks

## Concluidas nesta entrega
- [x] Estrutura monorepo (`apps/frontend`, `apps/backend`, `packages/shared`, `infra`).
- [x] Setup base de TypeScript, ESLint, Prettier e `.env.example`.
- [x] Pipeline CI (`lint`, `test`, `build`) em `.github/workflows/ci.yml`.
- [x] Backend Express com arquitetura por camadas.
- [x] SQLite com migration inicial e constraints de unicidade.
- [x] Upsert de projeto por `external_id`.
- [x] Persistencia de deputados e votos vinculados ao projeto.
- [x] Integracao com endpoints da Camara (projetos, votacoes e votos).
- [x] Fallback local quando API externa falha.
- [x] Cache em memoria para consultas de projeto.
- [x] Modulo de consulta por deputado local com metricas percentuais.
- [x] Frontend Angular + Material com:
  - busca de projetos
  - detalhe do projeto
  - cards de deputados
  - busca de deputado
  - historico de votos
  - loading com botao desabilitado em operacoes assincronas
- [x] Testes iniciais (backend + frontend).
- [x] Dockerfiles e `docker-compose.yml`.

## Pendencias para evolucao (proxima iteracao)
- [ ] Refinar regras de relevancia/interest_type com criterios oficiais de negocio.
- [ ] Aumentar cobertura de testes (integracao backend e cenarios E2E frontend).
- [ ] Endurecer seguranca (auth, politicas de CORS por ambiente, auditoria).
- [ ] Melhorar observabilidade (correlation-id, metricas e dashboard).
- [ ] Fechar processo de release (`v1.0.0`) com changelog formal.
