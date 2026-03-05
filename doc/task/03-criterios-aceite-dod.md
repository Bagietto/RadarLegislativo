# Criterios de Aceite e Definition of Done (DoD)

## Criterios Globais de Aceite do Produto
- [ ] Usuario consegue pesquisar projeto de lei e ver detalhes.
- [ ] Sistema salva localmente projeto pesquisado quando ainda nao existe.
- [ ] Sistema atualiza projeto existente sem duplicar registro.
- [ ] Tela mostra loading durante busca/salvamento e nao aparenta travamento.
- [ ] Usuario consegue consultar deputado cadastrado localmente.
- [ ] Busca exata por numero/ano do projeto retorna o item correto.
- [ ] Tela de deputado mostra projetos votados e voto (Sim/Nao/Abstencao).
- [ ] Tela de deputado mostra `% interesse_povo` e `% interesse_proprio`.
- [ ] Detalhe do projeto exibe resumo de votos (favor, contra, abstencao e total).
- [ ] Detalhe do projeto permite filtro por voto (todos, a favor, contra).
- [ ] Resultado da busca de deputado exibe foto do parlamentar.
- [ ] Interface segue Material Design e funciona em desktop/mobile.

## Definition of Done por Entrega
- [ ] Codigo versionado com padrao de lint e formatacao aprovado.
- [ ] Testes automatizados da entrega executando sem falha.
- [ ] Regras de negocio cobertas por testes unitarios/integracao.
- [ ] Logs e tratamento de erro implementados para casos criticos.
- [ ] Sem regressao nos fluxos principais de projeto e deputado.
- [ ] Documentacao atualizada em `doc/`.

## Cenarios Criticos de Validacao Manual
- [ ] Pesquisar projeto inexistente localmente e confirmar insercao no banco.
- [ ] Pesquisar novamente o mesmo projeto e confirmar ausencia de duplicidade.
- [ ] Simular lentidao de API externa e validar comportamento de loading.
- [ ] Simular falha da API externa e validar fallback/erro amigavel.
- [ ] Validar busca exata por formato `PL numero/ano` com retorno correto.
- [ ] Validar projeto com multiplas votacoes e confirmar escolha de votacao nominal com deputados preenchidos.
- [ ] Validar soma de votos (`favor + contra + abstencao`) igual ao total exibido.
- [ ] Validar filtro de votos no detalhe alterando lista de deputados em tela.
- [ ] Consultar deputado com historico de votos e validar percentuais.
- [ ] Validar exibição de foto no resultado da busca de deputado.
- [ ] Validar responsividade dos cards de deputados em tela pequena.
