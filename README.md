# Plataforma de Projetos de Lei

Plataforma web para consulta de projetos de lei e votações nominais da Câmara dos Deputados, com foco em transparência: quem votou, como votou e qual o impacto social estimado de cada projeto.

## Objetivo

Permitir que qualquer pessoa entenda rapidamente:
- Dados principais de um projeto de lei.
- Resultado consolidado da votação nominal.
- Posicionamento de cada deputado (sim, não, abstenção).
- Indicador de relevância social do projeto.

## Funcionalidades do MVP

- Busca de projetos por número, tema, período ou situação.
- Detalhe de projeto com:
  - título, ementa, situação e data de votação;
  - score de relevância social e classificação textual;
  - resumo da votação (favor, contra, abstenção, total).
- Lista de deputados em cards com foto, nome, partido, UF e voto.
- Filtro de deputados por voto (todos, a favor, contra).
- Persistência local de `projeto + deputados + votos` no detalhe do projeto.
- Consulta de deputado na base local com histórico de votações e indicadores percentuais.

## Arquitetura e Stack

- Frontend: Angular + Angular Material.
- Backend: Node.js + Express.
- Persistência local: SQLite.
- Organização: monorepo.

### Estrutura de pastas

- `apps/backend`: API, integrações governamentais e persistência SQLite.
- `apps/frontend`: aplicação web Angular.
- `packages/shared`: tipos, contratos e utilitários compartilhados.
- `infra/docker`: artefatos de infraestrutura local.
- `doc`: documentação funcional e técnica.

## Integração de dados

- Fonte principal: APIs públicas oficiais da Câmara dos Deputados.
- O backend normaliza os dados externos para o modelo interno.
- Consultas podem informar origem dos dados (`governo` ou `local`), conforme implementação da API.

## Regras importantes de negócio

- Projeto deve ser identificado por `external_id` para evitar duplicidade.
- Sempre que um projeto for consultado no detalhe:
  - se não existir localmente, deve ser persistido;
  - se já existir, deve ser atualizado sem duplicar.
- Quando houver múltiplas votações de um projeto, usar a primeira com votos nominais válidos.
- Durante consultas e persistência, a interface deve exibir estado de carregamento e bloquear ações duplicadas.

## Modelo de dados resumido

- `projects`: dados do projeto, relevância e classificação de interesse.
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

1. Instalar dependências:

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

4. Acessar a aplicação no navegador (porta conforme configuração local do frontend).

## Scripts úteis

```bash
npm run dev:backend   # ambiente de desenvolvimento do backend
npm run dev:frontend  # ambiente de desenvolvimento do frontend
npm run lint          # análise estática
npm run test          # execução de testes
npm run build         # build de produção
npm run seed -w apps/backend  # carga inicial opcional no backend
```

## Fluxos principais de uso

### Consulta por projeto

1. Pesquisar e selecionar um projeto.
2. Solicitar detalhes.
3. Sistema consulta APIs oficiais e base local.
4. Sistema persiste dados locais quando necessário.
5. Interface exibe dados do projeto, relevância e votos por deputado.

### Consulta por deputado

1. Pesquisar deputado na base local.
2. Selecionar deputado.
3. Interface exibe histórico de votações e indicadores percentuais por classificação de interesse.

## Qualidade e validação

- Separação clara entre camadas de frontend, backend e persistência.
- Lint, testes e build como validações mínimas.
- Recomendado manter padrão com TypeScript, ESLint e Prettier.

## Roadmap curto

- Definir contratos finais dos endpoints oficiais e internos.
- Consolidar regra final de cálculo de relevância social.
- Evoluir backlog técnico (MVP, V1, V2).
- Expandir cobertura de testes de componentes, serviços e rotas.

## Documentação complementar

- Especificação funcional: [doc/webproject.md](doc/webproject.md)
