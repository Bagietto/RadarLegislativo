import { config } from '../config.js';

interface CamaraProjeto {
  id: number;
  siglaTipo: string;
  numero: number;
  ano: number;
  ementa: string;
  uri: string;
  statusProposicao?: {
    descricaoSituacao?: string;
  };
}

interface CamaraResponse<T> {
  dados: T[];
}

const withTimeout = async <T>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
  const timeout = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error('Tempo limite excedido na API externa')), timeoutMs);
  });
  return Promise.race([promise, timeout]);
};

const fetchJson = async <T>(path: string, params?: URLSearchParams): Promise<T> => {
  const url = new URL(`${config.camaraApiBaseUrl}${path}`);
  if (params) {
    url.search = params.toString();
  }
  const response = await withTimeout(fetch(url, { headers: { Accept: 'application/json' } }), config.requestTimeoutMs);
  if (!response.ok) {
    throw new Error(`Erro na API da Camara: ${response.status}`);
  }
  return (await response.json()) as T;
};

export const camaraClient = {
  async searchProjects(query: string): Promise<CamaraProjeto[]> {
    const params = new URLSearchParams({
      itens: '10',
      ordem: 'DESC',
      ordenarPor: 'id',
      siglaTipo: 'PL',
    });
    if (query.trim()) {
      params.set('keywords', query.trim());
    }
    const payload = await fetchJson<CamaraResponse<CamaraProjeto>>('/proposicoes', params);
    return payload.dados ?? [];
  },

  async searchProjectByNumberYear(siglaTipo: string, numero: string, ano: string): Promise<CamaraProjeto[]> {
    const params = new URLSearchParams({
      siglaTipo,
      numero,
      ano,
      itens: '10',
      ordem: 'DESC',
      ordenarPor: 'id',
    });
    const payload = await fetchJson<CamaraResponse<CamaraProjeto>>('/proposicoes', params);
    return payload.dados ?? [];
  },

  async getProject(projectId: string): Promise<any> {
    const payload = await fetchJson<{ dados: any }>(`/proposicoes/${projectId}`);
    return payload.dados;
  },

  async getVotesByProject(projectId: string): Promise<any[]> {
    const payload = await fetchJson<CamaraResponse<any>>(`/proposicoes/${projectId}/votacoes`);
    return payload.dados ?? [];
  },

  async getVoteOrientations(votacaoId: string): Promise<any[]> {
    const payload = await fetchJson<CamaraResponse<any>>(`/votacoes/${votacaoId}/votos`);
    return payload.dados ?? [];
  },
};
