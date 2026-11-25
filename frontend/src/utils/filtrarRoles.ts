
import { Filtros } from '../constants/filtros';
import { Role } from '../data/roles';

function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export function filtrarRoles(
  lista: Role[],
  filtros: Filtros
): Role[] {
  const termo = normalizar(filtros.consulta);

  return lista.filter((role) => {

    // Categoria
    if (
      filtros.categoria !== 'Todas' &&
      !role.categorias.some(
        (categoria) =>
          normalizar(categoria) === normalizar(filtros.categoria)
      )
    ) {
      return false;
    }

    // Região
    if (
      filtros.regiao !== 'Todas as regiões' &&
      role.regiao !== filtros.regiao
    ) {
      return false;
    }

    // Gratuito
    if (
      filtros.preco === 'gratuito' &&
      normalizar(role.faixaPreco) !== 'gratuito'
    ) {
      return false;
    }

    // Até R$ 50 (aproximação: faixa Médio)
    if (
      filtros.preco === 'ate50' &&
      normalizar(role.faixaPreco) !== 'medio'
    ) {
      return false;
    }

    // Pesquisa
    if (termo) {
      const texto = normalizar(
        `${role.nome} ${role.local} ${role.categorias.join(' ')} ${role.regiao ?? ''}`
      );

      if (!texto.includes(termo)) {
        return false;
      }
    }

    return true;
  });
}
