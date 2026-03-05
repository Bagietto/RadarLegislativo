# Plataforma de Projetos de Lei

Monorepo com frontend Angular, backend Node.js/Express e SQLite para consulta de projetos de lei e votos de deputados.

## Estrutura
- `apps/backend`: API, persistencia SQLite e integracao governamental.
- `apps/frontend`: Interface Angular + Material Design.
- `packages/shared`: tipos e constantes compartilhadas.
- `infra/docker`: Dockerfiles.
- `doc`: especificacao e tarefas.

## Executar localmente
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

## Validacoes
```bash
npm run lint
npm run test
npm run build
```

## Seed opcional
```bash
npm run seed -w apps/backend
```
