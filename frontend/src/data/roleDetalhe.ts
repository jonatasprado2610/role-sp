
export type EnderecoRole = {
  logradouro: string;
  numero: string;
  bairro: string;
  cep: string;
  cidade: string;
  estado: string;
  latitude: number | null;
  longitude: number | null;
};

export type PrecoRole = {
  descricao: string;
  valorEstimado: string;
};

export type HorarioRole = {
  diaSemana: string;
  abertura: string;
  fechamento: string;
};

export type AcessibilidadeRole = {
  rampaAcesso: boolean;
  banheiroAdaptado: boolean;
  estacionamento: boolean;
  arCondicionado: boolean;
  wifiGratis: boolean;
  seguranca: boolean;
};

export type AvaliacaoRole = {
  id: number;
  nomeUsuario: string;
  nota: number;
  comentario: string | null;
  dataPublicacao: string;
};

export type RoleDetalhe = {
  id: number;
  nome: string;
  telefone: string | null;
  site: string | null;
  comoChegar: string | null;
  eParceiro: boolean;
  atualizadoEm: string;

  endereco: EnderecoRole;
  preco: PrecoRole;
  categorias: string[];
  horarios: HorarioRole[];
  acessibilidade: AcessibilidadeRole | null;

  notaMedia: number | null;
  totalAvaliacoes: number;

  avaliacoes: AvaliacaoRole[];
};
