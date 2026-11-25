
import { api } from './api';
import { Role } from '../data/roles';
import { RoleDetalhe } from '../data/roleDetalhe';



export async function buscarLocalPorId(
  id: string | number
): Promise<RoleDetalhe> {
  const { data } = await api.get<RoleDetalhe>(
    `/locais/${id}`
  );

  return data;
}

export type LocalApi = {
  id: number;
  nome: string;
  eParceiro: boolean;
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  latitude: number | null;
  longitude: number | null;
  faixaPreco: string;
  valorEstimado: string;
  categorias: string[];
  notaMedia: number | null;
  totalAvaliacoes: number;
};

export type FiltrosLocais = {
  nome?: string;
  bairro?: string;
  categoria?: string;
  faixaPreco?: string;
  parceiro?: boolean;
  notaMinima?: number;
};

// Relaciona os bairros às regiões de São Paulo.
function identificarRegiao(bairro: string): string | null {
  const regioes: Record<string, string> = {
    'Santa Cecília': 'Centro',
    'Barra Funda': 'Zona Oeste',
    'Vila Madalena': 'Zona Oeste',
    'Consolação': 'Centro',
    'Jardim Paulista': 'Zona Oeste',
    'Bela Vista': 'Centro',
    'Vila Mariana': 'Zona Sul',
    'Itaquera': 'Zona Leste',
    'Mooca': 'Zona Leste',
    'República': 'Centro',
  };

  return regioes[bairro] ?? null;
}

function adaptarLocal(local: LocalApi): Role {
  return {
    id: String(local.id),
    nome: local.nome,
    categoria: local.categorias[0] ?? 'Outros',
    categorias: local.categorias,
    regiao: identificarRegiao(local.bairro),
    local: `${local.logradouro}, ${local.numero} · ${local.bairro}`,
    nota: local.notaMedia ?? 0,
    preco: local.valorEstimado,
    faixaPreco: local.faixaPreco,
    observacao: `${local.totalAvaliacoes} avaliações`,
  };
}

export async function buscarLocais(
  filtros: FiltrosLocais = {}
): Promise<Role[]> {
  const { data } = await api.get<LocalApi[]>('/locais', {
    params: filtros,
  });

  return data.map(adaptarLocal);
}
