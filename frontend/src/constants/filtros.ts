
export const CATEGORIAS = [
  'Todas',
  'Bar',
  'Balada',
  'Cultural',
  'Parque',
  'Diversão',
] as const;


export const REGIOES = [
  'Todas as regiões',
  'Centro',
  'Zona Sul',
  'Zona Norte',
  'Zona Leste',
  'Zona Oeste',
] as const;

export const PRECOS = [
  { valor: 'qualquer', rotulo: 'Qualquer' },
  { valor: 'gratuito', rotulo: 'Gratuito' },
  { valor: 'ate50', rotulo: 'Até R$ 50' },
] as const;

export type Categoria = (typeof CATEGORIAS)[number];
export type Regiao = (typeof REGIOES)[number];
export type FaixaFiltro = (typeof PRECOS)[number]['valor'];

export type Filtros = {
  categoria: Categoria;
  regiao: Regiao;
  preco: FaixaFiltro;
  consulta: string;
};