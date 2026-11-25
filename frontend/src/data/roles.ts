

export type Role = {
  id: string;
  nome: string;
  categoria: string;
  categorias: string[];
  regiao: string | null;
  local: string;
  nota: number;
  preco: string;
  faixaPreco: string;
  observacao: string;
  imagem?: undefined;
};
