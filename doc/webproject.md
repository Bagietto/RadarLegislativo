# Web Project - Especificacao do Produto

## 1. Visao Geral
Plataforma web para consultar projetos de lei votados na Camara dos Deputados e exibir, de forma clara e visual, como cada deputado votou (sim/nao), alem de um indicador de relevancia social do projeto.

Objetivo principal:
- Permitir que qualquer pessoa entenda rapidamente quem votou, como votou e qual o impacto social estimado de um projeto de lei.

## 2. Objetivos do Sistema
- Consultar projetos de lei vindos de endpoints oficiais do governo.
- Armazenar localmente projetos de lei e metadados de relevancia.
- Listar deputados com voto por projeto selecionado.
- Exibir informacoes dos deputados em cards: foto, nome, partido e estado (UF).
- Calcular e mostrar um indicador de relevancia para a sociedade.

## 3. Stack Tecnologica
- Frontend: Angular
- Backend: Node.js com Express
- Banco de dados local: SQLite
- Estilo visual: Google Material Design (interface elegante, limpa e moderna)

## 4. Escopo Funcional (MVP)
### 4.1 Consulta de Projetos
- Buscar projetos de lei via API governamental.
- Permitir pesquisa por numero, tema, periodo ou situacao.
- Exibir lista de projetos para selecao.

### 4.2 Detalhes e Votacao
Ao selecionar um projeto e clicar em pesquisar:
- Mostrar dados gerais do projeto (titulo, ementa, situacao, data da votacao).
- Mostrar indicador de relevancia social (percentual/indice + classificacao textual).
- Mostrar resumo da votacao nominal:
  - Total de votos
  - Total de votos a favor
  - Total de votos contra
  - Total de abstencoes/outras posicoes
- Exibir lista de deputados em cards com:
  - Foto
  - Nome
  - Partido
  - Estado (UF)
  - Voto (Sim/Nao/Abstencao, quando disponivel)
- Permitir filtro da lista por posicao de voto:
  - Todos
  - Somente a favor
  - Somente contra

### 4.3 Cadastro de Relevancia Local
- Persistir localmente se o projeto foi considerado relevante para a sociedade.
- Permitir classificacao local por regras de negocio (automaticas e/ou manuais).
- Registrar historico basico de consultas.

### 4.4 Persistencia ao Pesquisar Projeto
- Sempre que um projeto for pesquisado, o sistema deve verificar se ele ja existe na base local.
- Se o projeto nao existir, o sistema deve salvar os dados localmente.
- Se o projeto ja existir, o sistema nao deve duplicar registro; deve apenas atualizar campos que mudaram (quando aplicavel).
- A regra de identificacao deve usar um identificador externo oficial do projeto (ex.: `external_id`).
- Durante a busca e o salvamento no banco, a interface deve exibir estado de carregamento (loading) para evitar percepcao de travamento.
- Enquanto estiver em loading:
  - desabilitar o botao de pesquisa para evitar requisicoes duplicadas;
  - exibir indicador visual (spinner/progress bar Material Design) e mensagem de status;
  - liberar a interface ao concluir com sucesso ou erro.

Adendo de implementacao atual:
- A persistencia completa de `projeto + deputados + votos` ocorre no endpoint de detalhe do projeto.
- A busca/listagem de projetos retorna resultados para selecao e pode nao persistir todos os relacionamentos nesse passo.
- O uso de cache em memoria nao deve impedir persistencia no banco quando o projeto ainda nao existir localmente.

### 4.5 Consulta de Deputado (Base Local)
- O sistema deve oferecer busca de deputado ja cadastrado no banco local.
- Na lista de resultado da busca de deputado, exibir foto do deputado no card de resultado.
- Ao selecionar um deputado, exibir detalhes dos projetos em que ele votou:
  - Projeto
  - Data da votacao
  - Voto do deputado (Sim/Nao/Abstencao)
  - Relevancia social do projeto
- Exibir indicadores percentuais do deputado:
  - Percentual de votos em projetos classificados como de interesse do povo.
  - Percentual de votos em projetos classificados como de interesse proprio/partidario.

Regras iniciais de calculo:
- Base de calculo: total de votacoes do deputado que possuam classificacao de interesse.
- Formula sugerida:
  - `% interesse do povo = (qtd votos em projetos "interesse_povo" / total classificavel) * 100`
  - `% interesse proprio/partidario = (qtd votos em projetos "interesse_proprio" / total classificavel) * 100`
- Os dois percentuais devem ser exibidos com ate 2 casas decimais.

## 5. Relevancia Social do Projeto
Definir um indice de relevancia com base em criterios claros.

Sugestao inicial de criterios:
- Area impactada (saude, educacao, seguranca, economia etc.)
- Alcance populacional estimado
- Urgencia social
- Potencial de impacto financeiro publico
- Indicadores manuais (avaliacao editorial interna)

Saida recomendada:
- Score de 0 a 100
- Classificacao:
  - 0-39: Baixa relevancia
  - 40-69: Media relevancia
  - 70-100: Alta relevancia

Classificacao adicional de interesse (para indicadores por deputado):
- `interesse_povo`
- `interesse_proprio` (ou `interesse_partidario`, padronizar no backend)

## 6. Integracao com Endpoints do Governo
- Fonte principal: APIs publicas da Camara dos Deputados e/ou outros endpoints governamentais oficiais.
- Dados esperados:
  - Projetos de lei
  - Votacoes por projeto
  - Deputados e metadados (nome, partido, UF, foto)

Requisitos de integracao:
- Tratar rate limits e indisponibilidade temporaria.
- Normalizar campos recebidos para o modelo interno.
- Armazenar cache local para reduzir chamadas repetidas.
- Para consulta de projeto por identificacao exata, suportar busca por `siglaTipo + numero + ano` (ex.: `PL 1579/2025`).
- Quando a busca textual por `keywords` nao localizar o item esperado, priorizar tentativa de busca exata.
- No detalhe do projeto, selecionar a primeira votacao que possua votos nominais validos para compor a lista de deputados.

## 7. Arquitetura Proposta
### Frontend (Angular)
- Pagina de busca de projetos.
- Pagina de detalhe do projeto com votos e cards dos deputados.
- Componentes visuais com Angular Material.

### Backend (Node.js + Express)
- API propria para orquestrar chamadas governamentais.
- Servico de consolidacao e normalizacao dos dados.
- Camada de persistencia local com SQLite.

### Banco de Dados (SQLite)
Tabelas iniciais sugeridas:
- `projects`
  - id
  - external_id
  - title
  - summary
  - status
  - vote_date
  - relevance_score
  - relevance_label
  - interest_type
  - is_relevant
  - created_at
  - updated_at
- `deputies`
  - id
  - external_id
  - name
  - party
  - state
  - photo_url
- `votes`
  - id
  - project_id
  - deputy_id
  - vote_value
  - vote_datetime

Dados derivados no retorno de detalhe (nao persistidos como tabela dedicada):
- `voteSummary`
  - total
  - favor
  - contra
  - abstencao
- `votingInfo`
  - votingId selecionado
  - totalVotacoesEncontradas
  - totalVotosNominais

Regra operacional de manutencao:
- Deve existir procedimento para limpeza controlada das tabelas (`projects`, `deputies`, `votes`) em ambiente de desenvolvimento/teste.

## 8. Requisitos de Interface (Material Design)
- Layout limpo com hierarquia visual forte.
- Uso de cards, chips, tabelas e dialogs do Angular Material.
- Uso de feedback de carregamento (spinner/skeleton/progress) em operacoes de busca e persistencia.
- Exibir resumo visual de votacao (a favor x contra) no detalhe do projeto.
- Exibir filtros de voto no detalhe para reduzir ruido visual em votacoes extensas.
- Padronizar visual entre abas Projetos e Deputados (barra de busca, botoes de acao e cards de resultado).
- Aplicar destaque visual em botoes primarios de acao (`Pesquisar`, `Ver detalhes`, `Ver historico`) com linguagem consistente.
- Indicadores de voto com cores semaforicas:
  - Sim: verde
  - Nao: vermelho
  - Abstencao: amarelo/cinza
- Responsividade para desktop e mobile.
- Acessibilidade minima (contraste, foco visivel, labels).

## 9. Fluxo Principal do Usuario
1. Usuario acessa a plataforma.
2. Pesquisa e seleciona um projeto de lei.
3. Clica em pesquisar.
4. Sistema consulta APIs oficiais e base local.
5. Tela exibe:
   - Dados do projeto
   - Relevancia social
   - Lista de deputados em cards com voto

Fluxo adicional - Consulta por deputado:
1. Usuario acessa a busca de deputados locais.
2. Seleciona um deputado cadastrado.
3. Sistema retorna historico de votacoes do deputado.
4. Tela exibe lista de projetos votados (Sim/Nao/Abstencao).
5. Tela exibe percentual de votos em projetos de interesse do povo e de interesse proprio/partidario.

Fluxo adicional - Detalhe com votacao nominal:
1. Usuario seleciona um projeto na lista.
2. Sistema consulta as votacoes do projeto.
3. Sistema percorre as votacoes e seleciona a primeira que possua votos nominais.
4. Sistema persiste projeto, deputados e votos da votacao nominal selecionada.
5. Sistema calcula e exibe resumo de votos (favor, contra, abstencao e total).
6. Usuario pode filtrar deputados por voto (todos, a favor, contra).
7. Se nenhuma votacao nominal existir, exibir aviso claro na interface.
8. Se houver cache em memoria e o projeto ainda nao existir no banco local, o sistema deve priorizar persistencia antes de retornar.

## 10. Requisitos Nao Funcionais
- Performance: resposta de consulta em tempo aceitavel com cache local.
- Confiabilidade: fallback para dados locais quando endpoint estiver indisponivel.
- Manutenibilidade: separacao clara entre frontend, backend e persistencia.
- Observabilidade basica: logs de erro e integracao.
- Integridade de dados: impedir duplicidade de projetos com restricao de unicidade por `external_id`.
- Experiencia do usuario: toda operacao assincrona de consulta/salvamento deve ter feedback visual de progresso e tratamento de timeout.
- Transparencia de dados: respostas da API devem informar origem (`governo` ou `local`) para cada consulta relevante.

## 11. Entregaveis Iniciais
- Estrutura inicial do projeto (frontend + backend + db).
- Integracao basica com endpoint governamental.
- Tela de busca + detalhe de projeto.
- Listagem de votos por deputado em cards.
- Persistencia local de projetos e relevancia.

## 12. Proximos Passos
- Definir endpoints oficiais exatos e contratos de resposta.
- Definir regra final de calculo de relevancia.
- Criar backlog tecnico (MVP, V1, V2).
- Implementar autenticacao (se necessario em fases futuras).

## 13. Adendo - Estrutura do Projeto (Padrao de Mercado)
Para garantir qualidade, escalabilidade e manutencao no longo prazo, adotar estrutura moderna com separacao clara de responsabilidades.

### 13.1 Organizacao Geral (Monorepo)
Estrutura sugerida:
- `apps/frontend` -> aplicacao Angular
- `apps/backend` -> API Node.js + Express
- `packages/shared` -> tipos, contratos e utilitarios compartilhados
- `infra` -> docker, scripts e configuracoes de ambiente
- `doc` -> documentacao funcional e tecnica

Beneficios:
- Reuso de tipos entre frontend e backend.
- Padrao unico de lint, testes e convencoes.
- Evolucao coordenada entre aplicacoes.

### 13.2 Frontend (Angular) - Boas Praticas
- Arquitetura por feature (ex.: `features/projects`, `features/deputies`).
- Componentes de UI desacoplados de regras de negocio.
- Camada de servicos para consumo da API.
- State management apenas quando necessario (preferencia por simplicidade no MVP).
- Angular Material como base de design system.

### 13.3 Backend (Node.js + Express) - Boas Praticas
- Camadas separadas:
  - `routes` (entrada HTTP)
  - `controllers` (orquestracao)
  - `services` (regras de negocio)
  - `repositories` (acesso ao SQLite)
  - `integrations` (endpoints do governo)
- Validacao de entrada na borda da API.
- Tratamento centralizado de erros.
- Logs estruturados para rastreabilidade.

### 13.4 Banco de Dados (SQLite) - Boas Praticas
- Migrations versionadas.
- Indices para consultas frequentes (`external_id`, chaves de relacao).
- Restricoes de unicidade para evitar duplicidade.
- Seeds para ambiente local e testes.

### 13.5 Qualidade e Padronizacao
- TypeScript no frontend e backend.
- ESLint + Prettier para padrao de codigo.
- Commits padronizados (Conventional Commits).
- Hooks de pre-commit para lint e testes rapidos.

### 13.6 Testes (Camadas)
- Frontend: testes de componentes e servicos.
- Backend: testes unitarios de regras e integracao de rotas.
- Contrato de API: validacao de request/response.
- Regressao: cenarios criticos de consulta de projetos e deputados.

### 13.7 Seguranca e Confiabilidade
- Sanitizacao e validacao de parametros.
- Rate limit na API propria.
- Timeout e retry para chamadas a APIs externas.
- Cache local com politica de expiracao.

### 13.8 Entrega e Operacao
- Variaveis de ambiente por contexto (`.env.example`).
- Docker para padronizar ambiente local.
- Pipeline CI com etapas minimas:
  - lint
  - testes
  - build
- Versionamento semantico para releases.

### 13.9 Estrutura Base de Pastas (Referencia)
```text
Projeto VsCode/
  apps/
    frontend/
      src/
        app/
          core/
          shared/
          features/
            projects/
            deputies/
    backend/
      src/
        routes/
        controllers/
        services/
        repositories/
        integrations/
        middlewares/
  packages/
    shared/
      src/
        types/
        constants/
  infra/
    docker/
    scripts/
  doc/
    webproject.md
```
