# Backlog Detalhado de Desenvolvimento

## EPIC 1 - Arquitetura e Setup
### TSK-001 Criar estrutura de pastas do monorepo
- Objetivo: padronizar organizacao do projeto.
- Entrega: pastas `apps/frontend`, `apps/backend`, `packages/shared`, `infra`, `doc`.
- Criterio de aceite: estrutura criada e documentada.

### TSK-002 Configurar padrao de codigo
- Objetivo: garantir qualidade e consistencia.
- Entrega: ESLint + Prettier + scripts de lint.
- Criterio de aceite: `lint` executa sem erros.

### TSK-003 Configurar CI
- Objetivo: validar automaticamente cada alteracao.
- Entrega: workflow com `lint`, `test`, `build`.
- Criterio de aceite: pipeline verde em branch principal.

## EPIC 2 - Banco de Dados e Persistencia
### TSK-010 Criar schema inicial SQLite
- Objetivo: persistir projetos, deputados e votos.
- Entrega: tabelas `projects`, `deputies`, `votes`.
- Criterio de aceite: migrations aplicadas com sucesso.

### TSK-011 Garantir integridade de dados
- Objetivo: evitar duplicidade e inconsistencias.
- Entrega: constraints de unicidade e FKs.
- Criterio de aceite: duplicacao por `external_id` bloqueada.

### TSK-012 Implementar estrategia de upsert de projetos
- Objetivo: salvar projeto pesquisado sem duplicar.
- Entrega: upsert por `projects.external_id`.
- Criterio de aceite: nova busca do mesmo projeto atualiza registro existente.

## EPIC 3 - Integracao Governamental
### TSK-020 Conectar API de projetos de lei
- Objetivo: consultar projetos oficiais.
- Entrega: endpoint interno para busca por filtros.
- Criterio de aceite: retorno normalizado e paginado.

### TSK-021 Conectar API de votacoes
- Objetivo: obter votos por projeto.
- Entrega: endpoint interno de votacoes consolidadas.
- Criterio de aceite: cada voto vinculado ao deputado correto.

### TSK-022 Conectar API de deputados
- Objetivo: obter metadados do deputado.
- Entrega: carga de nome, partido, UF e foto.
- Criterio de aceite: cards exibem dados completos quando disponiveis.

### TSK-023 Resiliencia de integracao
- Objetivo: evitar falhas totais em instabilidade externa.
- Entrega: timeout, retry, fallback local e logs.
- Criterio de aceite: indisponibilidade externa nao derruba a aplicacao.

## EPIC 4 - Backend de Dominio
### TSK-030 Criar modulo de projetos
- Objetivo: expor consulta de projetos e detalhes.
- Entrega: rotas, controllers e services de projeto.
- Criterio de aceite: endpoint retorna projeto + relevancia + votos.

### TSK-031 Criar modulo de deputados
- Objetivo: consulta local de deputado cadastrado.
- Entrega: endpoint de busca e endpoint de historico de votos.
- Criterio de aceite: lista de projetos votados retorna corretamente.

### TSK-032 Calcular indicadores do deputado
- Objetivo: exibir `% interesse_povo` e `% interesse_proprio`.
- Entrega: regra de calculo no service.
- Criterio de aceite: percentuais corretos com 2 casas decimais.

## EPIC 5 - Frontend Angular (Material Design)
### TSK-040 Tela de busca de projetos
- Objetivo: iniciar fluxo principal de consulta.
- Entrega: formulario com filtros e botao pesquisar.
- Criterio de aceite: pesquisa aciona backend e lista resultados.

### TSK-041 Tela de detalhe de projeto
- Objetivo: visualizar dados consolidados.
- Entrega: cabecalho do projeto + score de relevancia + votos.
- Criterio de aceite: dados exibidos sem inconsistencias.

### TSK-042 Cards de deputados
- Objetivo: facilitar leitura visual por parlamentar.
- Entrega: card com foto, nome, partido, UF e voto.
- Criterio de aceite: layout responsivo em desktop e mobile.

### TSK-043 UX de loading e estado assincrono
- Objetivo: evitar percepcao de travamento.
- Entrega: spinner/progress + botao desabilitado durante requisicao.
- Criterio de aceite: usuario recebe feedback visual do inicio ao fim.

### TSK-044 Tela de consulta de deputado
- Objetivo: explorar historico de votacao individual.
- Entrega: busca local + lista de projetos votados + percentuais.
- Criterio de aceite: percentuais e lista batem com backend.

## EPIC 6 - Relevancia e Classificacao
### TSK-050 Definir regra inicial de score de relevancia
- Objetivo: padronizar classificacao social.
- Entrega: regra de score 0-100 + label.
- Criterio de aceite: cada projeto recebe score e faixa correspondente.

### TSK-051 Definir `interest_type` do projeto
- Objetivo: habilitar metricas por deputado.
- Entrega: classificacao `interesse_povo` ou `interesse_proprio`.
- Criterio de aceite: projeto classificado e persistido no banco.

## EPIC 7 - Testes e Confiabilidade
### TSK-060 Testes unitarios backend
- Objetivo: validar regras de negocio criticas.
- Entrega: testes de services de projetos/deputados.
- Criterio de aceite: cobertura de cenarios chave aprovada.

### TSK-061 Testes de integracao backend
- Objetivo: validar rotas e persistencia.
- Entrega: testes de API com banco de teste.
- Criterio de aceite: fluxos principais sem regressao.

### TSK-062 Testes frontend
- Objetivo: validar componentes e estados de tela.
- Entrega: testes de componentes e servicos Angular.
- Criterio de aceite: fluxos de busca e loading cobertos.

## EPIC 8 - Entrega e Operacao
### TSK-070 Dockerizacao
- Objetivo: ambiente reproduzivel.
- Entrega: Dockerfiles e compose para app completa.
- Criterio de aceite: projeto sobe com comando unico.

### TSK-071 Observabilidade basica
- Objetivo: facilitar suporte e diagnostico.
- Entrega: logs estruturados e rastreio de erros principais.
- Criterio de aceite: erro critico fica rastreavel por log.

### TSK-072 Release v1
- Objetivo: entregar primeira versao utilizavel.
- Entrega: checklist final + release notes.
- Criterio de aceite: versao publicada com escopo MVP completo.

## EPIC 9 - Complementos Implementados e Consolidacao
### TSK-080 Busca exata por numero/ano do projeto
- Objetivo: garantir localizacao confiavel de projetos especificos.
- Entrega: parser para formato `SIGLA numero/ano` (ex.: `PL 1579/2025`) com consulta exata em endpoint oficial.
- Criterio de aceite: busca por `PL 1579/2025` retorna o projeto correto.

### TSK-081 Selecao de votacao nominal valida
- Objetivo: evitar detalhe vazio quando a primeira votacao nao tem votos nominais.
- Entrega: percorrer votacoes do projeto e selecionar a primeira com votos nominais.
- Criterio de aceite: projeto com votacao nominal conhecida retorna lista de deputados preenchida.

### TSK-082 Resumo de votos no detalhe do projeto
- Objetivo: oferecer leitura consolidada da votacao.
- Entrega: metrica `voteSummary` com `total`, `favor`, `contra` e `abstencao`.
- Criterio de aceite: totais exibidos e coerentes com a lista nominal.

### TSK-083 Filtro de deputados por voto
- Objetivo: facilitar analise de quem votou a favor ou contra.
- Entrega: filtro no frontend com opcoes `todos`, `a favor`, `contra`.
- Criterio de aceite: lista de deputados reage ao filtro sem nova consulta.

### TSK-084 Foto na busca de deputado
- Objetivo: enriquecer identificacao visual na pesquisa local de deputados.
- Entrega: exibir `photo_url` no card de resultado da busca.
- Criterio de aceite: card de deputado mostra foto ou fallback quando indisponivel.

### TSK-085 Procedimento de limpeza de base local
- Objetivo: permitir reset seguro de ambiente de desenvolvimento/teste.
- Entrega: procedimento documentado para limpar `projects`, `deputies` e `votes`.
- Criterio de aceite: tabelas reiniciadas sem quebrar estrutura e constraints.
