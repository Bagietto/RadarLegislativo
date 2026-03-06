# Plataforma de Projetos de Lei

Plataforma web para consulta de projetos de lei e votacoes nominais da Camara dos Deputados, com foco em transparencia: quem votou, como votou e qual o impacto social estimado de cada projeto.

## Objetivo

Permitir que qualquer pessoa entenda rapidamente:
- Dados principais de um projeto de lei.
- Resultado consolidado da votacao nominal.
- Posicionamento de cada deputado (sim, nao, abstencao).
- Indicador de relevancia social do projeto.

## Funcionalidades do MVP

- Busca de projetos por numero, tema, periodo ou situacao.
- Detalhe de projeto com:
  - titulo, ementa, situacao e data de votacao;
  - score de relevancia social e classificacao textual;
  - resumo da votacao (favor, contra, abstencao, total).
- Lista de deputados em cards com foto, nome, partido, UF e voto.
- Filtro de deputados por voto (todos, a favor, contra).
- Persistencia local de `projeto + deputados + votos` no detalhe do projeto.
- Consulta de deputado na base local com historico de votacoes e indicadores percentuais.

## Arquitetura e Stack

- Frontend: Angular + Angular Material.
- Backend: Node.js + Express.
- Persistencia local: SQLite.
- Organizacao: monorepo.

### Estrutura de pastas

- `apps/backend`: API, integracoes governamentais e persistencia SQLite.
- `apps/frontend`: aplicacao web Angular.
- `packages/shared`: tipos, contratos e utilitarios compartilhados.
- `infra/docker`: artefatos de infraestrutura local.
- `doc`: documentacao funcional e tecnica.

## Integracao de dados

- Fonte principal: APIs publicas oficiais da Camara dos Deputados.
- O backend normaliza os dados externos para o modelo interno.
- Consultas podem informar origem dos dados (`governo` ou `local`), conforme implementacao da API.

## Regras importantes de negocio

- Projeto deve ser identificado por `external_id` para evitar duplicidade.
- Sempre que um projeto for consultado no detalhe:
  - se nao existir localmente, deve ser persistido;
  - se ja existir, deve ser atualizado sem duplicar.
- Quando houver multiplas votacoes de um projeto, usar a primeira com votos nominais validos.
- Durante consultas e persistencia, a interface deve exibir estado de carregamento e bloquear acoes duplicadas.

## Modelo de dados resumido

- `projects`: dados do projeto, relevancia e classificacao de interesse.
- `deputies`: cadastro de deputados (nome, partido, UF, foto).
- `votes`: votos nominais por projeto e deputado.

Campos-chave esperados:
- `projects.external_id` (unicidade).
- `projects.relevance_score` e `projects.relevance_label`.
- `projects.interest_type` (`interesse_povo` ou `interesse_proprio`/`interesse_partidario`).

## Pre-requisitos

- Node.js (LTS recomendado).
- npm.
- (Opcional) Docker para ambiente conteinerizado.

## Como executar localmente

1. Instalar dependencias:

```bash
npm install
```

2. Subir backend:

```bash
npm run dev:backend
```

3. Subir frontend:

```bash
npm run dev:frontend
```

4. Acessar a aplicacao no navegador (porta conforme configuracao local do frontend).

## Scripts uteis

```bash
npm run dev:backend   # ambiente de desenvolvimento do backend
npm run dev:frontend  # ambiente de desenvolvimento do frontend
npm run lint          # analise estatica
npm run test          # execucao de testes
npm run build         # build de producao
npm run seed -w apps/backend  # carga inicial opcional no backend
```

## Fluxos principais de uso

### Consulta por projeto

1. Pesquisar e selecionar um projeto.
2. Solicitar detalhes.
3. Sistema consulta APIs oficiais e base local.
4. Sistema persiste dados locais quando necessario.
5. Interface exibe dados do projeto, relevancia e votos por deputado.

### Consulta por deputado

1. Pesquisar deputado na base local.
2. Selecionar deputado.
3. Interface exibe historico de votacoes e indicadores percentuais por classificacao de interesse.

## Qualidade e validacao

- Separacao clara entre camadas de frontend, backend e persistencia.
- Lint, testes e build como validacoes minimas.
- Recomendado manter padrao com TypeScript, ESLint e Prettier.

## Roadmap curto

- Definir contratos finais dos endpoints oficiais e internos.
- Consolidar regra final de calculo de relevancia social.
- Evoluir backlog tecnico (MVP, V1, V2).
- Expandir cobertura de testes de componentes, servicos e rotas.

## Documentacao complementar

- Especificacao funcional: [doc/webproject.md](doc/webproject.md)
