import { describe, test, expect } from "@jest/globals";
import { filtrarRoles } from "../src/utils/filtrarRoles";
import type { Role } from "../src/data/roles";
import type { Filtros } from "../src/constants/filtros";

// Fixtures: dados fictícios para os testes
const rolesTeste: Role[] = [
  {
    id: "1",
    nome: "Parque das Águas",
    categoria: "Ao ar livre",
    regiao: "Zona Sul",
    local: "Vila Mariana",
    nota: 4.8,
    preco: "Entrada gratuita",
    faixaPreco: "gratuito",
    observacao: "Local fictício para testes",
  },
  {
    id: "2",
    nome: "Museu da Cidade",
    categoria: "Cultura",
    regiao: "Centro",
    local: "Sé",
    nota: 4.5,
    preco: "R$ 30",
    faixaPreco: "ate50",
    observacao: "Local fictício para testes",
  },
  {
    id: "3",
    nome: "Bistrô Central",
    categoria: "Comer",
    regiao: "Centro",
    local: "República",
    nota: 4.3,
    preco: "R$ 45",
    faixaPreco: "ate50",
    observacao: "Local fictício para testes",
  },
  {
    id: "4",
    nome: "Festival de Música",
    categoria: "Shows",
    regiao: "Zona Oeste",
    local: "Pinheiros",
    nota: 4.7,
    preco: "R$ 80",
    faixaPreco: "acima50",
    observacao: "Local fictício para testes",
  },
];

// Configuração padrão: nenhum filtro ativo
const filtrosPadrao: Filtros = {
  categoria: "Todas",
  regiao: "Todas as regiões",
  preco: "qualquer",
  consulta: "",
};

describe("Filtragem de rolês", () => {
  test("UT-27: deve retornar todos os rolês sem filtros ativos", () => {
    const resultado = filtrarRoles(rolesTeste, filtrosPadrao);

    expect(resultado).toEqual(rolesTeste);
  });

  test("UT-28: deve filtrar por categoria", () => {
    const resultado = filtrarRoles(rolesTeste, {
      ...filtrosPadrao,
      categoria: "Cultura",
    });

    expect(resultado.map((role) => role.id)).toEqual(["2"]);
  });

  test("UT-29: deve filtrar por região", () => {
    const resultado = filtrarRoles(rolesTeste, {
      ...filtrosPadrao,
      regiao: "Centro",
    });

    expect(resultado.map((role) => role.id)).toEqual(["2", "3"]);
  });

  test("UT-30: deve retornar somente rolês gratuitos", () => {
    const resultado = filtrarRoles(rolesTeste, {
      ...filtrosPadrao,
      preco: "gratuito",
    });

    expect(resultado.map((role) => role.id)).toEqual(["1"]);
  });

  test("UT-31: deve retornar rolês de até R$ 50 incluindo gratuitos", () => {
    const resultado = filtrarRoles(rolesTeste, {
      ...filtrosPadrao,
      preco: "ate50",
    });

    expect(resultado.map((role) => role.id)).toEqual(["1", "2", "3"]);
  });

  test("UT-32: deve pesquisar pelo nome do rolê", () => {
    const resultado = filtrarRoles(rolesTeste, {
      ...filtrosPadrao,
      consulta: "Museu",
    });

    expect(resultado.map((role) => role.id)).toEqual(["2"]);
  });

  test("UT-33: deve pesquisar pelo local", () => {
    const resultado = filtrarRoles(rolesTeste, {
      ...filtrosPadrao,
      consulta: "Pinheiros",
    });

    expect(resultado.map((role) => role.id)).toEqual(["4"]);
  });

  test("UT-34: deve pesquisar pela categoria", () => {
    const resultado = filtrarRoles(rolesTeste, {
      ...filtrosPadrao,
      consulta: "Cultura",
    });

    expect(resultado.map((role) => role.id)).toEqual(["2"]);
  });

  test("UT-35: deve ignorar maiúsculas e minúsculas", () => {
    const resultado = filtrarRoles(rolesTeste, {
      ...filtrosPadrao,
      consulta: "MUSEU",
    });

    expect(resultado.map((role) => role.id)).toEqual(["2"]);
  });

  test("UT-36: deve ignorar acentos na pesquisa", () => {
    const resultado = filtrarRoles(rolesTeste, {
      ...filtrosPadrao,
      consulta: "aguas",
    });

    expect(resultado.map((role) => role.id)).toEqual(["1"]);
  });

  test("UT-37: deve ignorar espaços nas extremidades da consulta", () => {
    const resultado = filtrarRoles(rolesTeste, {
      ...filtrosPadrao,
      consulta: "   Museu   ",
    });

    expect(resultado.map((role) => role.id)).toEqual(["2"]);
  });

  test("UT-38: deve combinar múltiplos filtros", () => {
    const resultado = filtrarRoles(rolesTeste, {
      categoria: "Comer",
      regiao: "Centro",
      preco: "ate50",
      consulta: "Bistro",
    });

    expect(resultado.map((role) => role.id)).toEqual(["3"]);
  });

  test("UT-39: deve retornar lista vazia sem correspondências", () => {
    const resultado = filtrarRoles(rolesTeste, {
      ...filtrosPadrao,
      consulta: "Cinema",
    });

    expect(resultado).toEqual([]);
  });

  test("UT-40: deve processar uma lista de rolês vazia", () => {
    const resultado = filtrarRoles([], filtrosPadrao);

    expect(resultado).toEqual([]);
  });
});
