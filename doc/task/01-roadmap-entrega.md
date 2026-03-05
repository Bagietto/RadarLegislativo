# Roadmap de Entrega - Plataforma de Projetos de Lei

## Fase 0 - Fundacao Tecnica
- [x] Definir monorepo com `apps/frontend`, `apps/backend`, `packages/shared`, `infra`.
- [x] Configurar TypeScript, ESLint e Prettier para frontend e backend.
- [x] Criar pipeline CI minima (`lint`, `test`, `build`).
- [x] Configurar `.env.example` para frontend e backend.
- [x] Definir padrao de logs e tratamento global de erros.

## Fase 1 - Backend Base + Banco
- [x] Criar API Express com estrutura por camadas (`routes`, `controllers`, `services`, `repositories`, `integrations`).
- [x] Configurar SQLite e mecanismo de migrations.
- [x] Criar tabelas `projects`, `deputies`, `votes`.
- [x] Aplicar unicidade em `projects.external_id` e `deputies.external_id`.
- [x] Criar seeds iniciais para desenvolvimento local.

## Fase 2 - Integracao com API Governamental
- [x] Integrar busca de projetos de lei por filtros.
- [x] Integrar consulta de votacoes por projeto.
- [x] Integrar dados de deputados (nome, partido, UF, foto).
- [x] Implementar normalizacao dos dados externos para modelo interno.
- [x] Implementar timeout, retry e tratamento de indisponibilidade.

## Fase 3 - Persistencia Inteligente
- [x] Implementar regra de upsert por `external_id` ao pesquisar projeto.
- [x] Salvar projeto caso nao exista localmente.
- [x] Atualizar projeto sem duplicar caso ja exista.
- [x] Persistir votos e deputados relacionados ao projeto.
- [x] Implementar cache local de consultas.

## Fase 4 - Frontend MVP (Angular + Material)
- [x] Criar pagina de busca de projetos.
- [x] Criar pagina de detalhe do projeto.
- [x] Exibir cards de deputados com foto, nome, partido, UF e voto.
- [x] Exibir score/classificacao de relevancia social.
- [x] Implementar loading com botao desabilitado durante busca/salvamento.

## Fase 5 - Consulta por Deputado
- [x] Criar tela de busca de deputado local.
- [x] Exibir historico de projetos votados pelo deputado.
- [x] Exibir voto (Sim/Nao/Abstencao) por projeto.
- [x] Calcular e exibir `% interesse_povo`.
- [x] Calcular e exibir `% interesse_proprio`.

## Fase 6 - Qualidade, Seguranca e Confiabilidade
- [x] Implementar validacao de entrada em todas as rotas.
- [x] Implementar rate limit na API.
- [x] Cobrir regras criticas com testes unitarios e integracao.
- [x] Cobrir frontend com testes de componentes/servicos.
- [x] Implementar observabilidade basica com logs estruturados.

## Fase 7 - Preparacao para Producao
- [x] Configurar Docker para backend e frontend.
- [ ] Criar scripts de bootstrap do ambiente local.
- [ ] Validar performance em cenarios de consulta.
- [ ] Executar checklist final de aceite.
- [ ] Criar versao `v1.0.0` com release notes.
