import { describe, test, expect } from "@jest/globals";
import { lerParametro } from "../src/utils/parametros";
import { CATEGORIAS } from "../src/constants/filtros";

describe("Leitura e validação de parâmetros", () => {
  test("UT-55: deve retornar um parâmetro válido", () => {
    expect(lerParametro("Cultura", CATEGORIAS, "Todas")).toBe("Cultura");
  });

  test("UT-56: deve retornar o padrão para um parâmetro inválido", () => {
    expect(lerParametro("Cinema", CATEGORIAS, "Todas")).toBe("Todas");
  });

  test("UT-57: deve retornar o padrão para um parâmetro indefinido", () => {
    expect(lerParametro(undefined, CATEGORIAS, "Todas")).toBe("Todas");
  });

  test("UT-58: deve retornar o padrão para um parâmetro vazio", () => {
    expect(lerParametro("", CATEGORIAS, "Todas")).toBe("Todas");
  });

  test("UT-59: deve aceitar um array com valor válido", () => {
    expect(lerParametro(["Comer"], CATEGORIAS, "Todas")).toBe("Comer");
  });

  test("UT-60: deve considerar apenas o primeiro valor do array", () => {
    expect(lerParametro(["Cultura", "Shows"], CATEGORIAS, "Todas")).toBe(
      "Cultura",
    );
  });

  test("UT-61: deve retornar o padrão para um array vazio", () => {
    expect(lerParametro([], CATEGORIAS, "Todas")).toBe("Todas");
  });

  test("UT-62: deve retornar o padrão quando o primeiro valor do array é inválido", () => {
    expect(lerParametro(["Cinema", "Cultura"], CATEGORIAS, "Todas")).toBe(
      "Todas",
    );
  });

  test("UT-63: deve diferenciar letras maiúsculas e minúsculas", () => {
    expect(lerParametro("cultura", CATEGORIAS, "Todas")).toBe("Todas");
  });

  test("UT-64: deve retornar o padrão para valores com espaços adicionais", () => {
    expect(lerParametro(" Cultura ", CATEGORIAS, "Todas")).toBe("Todas");
  });
});
