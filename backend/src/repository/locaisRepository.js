import con from '../config/db.js';

export async function listarTodosLocais() {
  return buscarLocais();
}

export async function buscarLocais(filtros = {}) {
  const condicoes = [];
  const valores = [];

  if (filtros.nome) {
    valores.push(`%${filtros.nome}%`);
    condicoes.push(`l.nome ILIKE $${valores.length}`);
  }

  if (filtros.bairro) {
    valores.push(`%${filtros.bairro}%`);
    condicoes.push(`e.bairro ILIKE $${valores.length}`);
  }

  if (filtros.categoria) {
    valores.push(filtros.categoria);
    condicoes.push(`
      EXISTS (
        SELECT 1
        FROM locais_categorias lc
        JOIN categorias c ON c.id_categoria = lc.id_categoria
        WHERE lc.id_local = l.id_local
          AND c.nome ILIKE $${valores.length}
      )
    `);
  }

  if (filtros.faixaPreco) {
    valores.push(filtros.faixaPreco);
    condicoes.push(`fp.descricao ILIKE $${valores.length}`);
  }

  if (filtros.parceiro !== undefined) {
    valores.push(filtros.parceiro);
    condicoes.push(`l.e_parceiro = $${valores.length}`);
  }

  if (filtros.notaMinima !== undefined) {
    valores.push(filtros.notaMinima);
    condicoes.push(`
      (SELECT ROUND(AVG(a.nota), 1)
       FROM avaliacoes a
       WHERE a.id_local = l.id_local) >= $${valores.length}
    `);
  }

  const where = condicoes.length > 0 ? `WHERE ${condicoes.join(' AND ')}` : '';

  const comando = `
    SELECT
      l.id_local AS id,
      l.nome,
      l.e_parceiro AS "eParceiro",
      e.logradouro,
      e.numero,
      e.bairro,
      e.cidade,
      e.estado,
      e.latitude::float8 AS latitude,
      e.longitude::float8 AS longitude,
      fp.descricao AS "faixaPreco",
      fp.valor_estimado AS "valorEstimado",
      COALESCE((
        SELECT array_agg(c.nome ORDER BY c.nome)
        FROM locais_categorias lc
        JOIN categorias c ON c.id_categoria = lc.id_categoria
        WHERE lc.id_local = l.id_local
      ), '{}') AS categorias,
      (SELECT ROUND(AVG(a.nota), 1)::float8
         FROM avaliacoes a WHERE a.id_local = l.id_local) AS "notaMedia",
      (SELECT COUNT(*)::int
         FROM avaliacoes a WHERE a.id_local = l.id_local) AS "totalAvaliacoes"
    FROM locais l
    JOIN enderecos e ON e.id_endereco = l.id_endereco
    JOIN faixas_preco fp ON fp.id_faixa_preco = l.id_faixa_preco
    ${where}
    ORDER BY l.nome
  `;

  const { rows } = await con.query(comando, valores);
  return rows;
}