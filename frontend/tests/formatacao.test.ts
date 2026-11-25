import { describe, test, expect } from "@jest/globals";
import { formatarNota } from "../src/utils/formatacao";

describe("Formatação de notas", () => {
  test("UT-49: deve formatar uma nota inteira com uma casa decimal", () => {
    expect(formatarNota(4)).toBe("4,0");
  });

  test("UT-50: deve utilizar vírgula como separador decimal", () => {
    expect(formatarNota(4.8)).toBe("4,8");
  });

  test("UT-51: deve arredondar a nota para baixo", () => {
    expect(formatarNota(4.23)).toBe("4,2");
  });

  test("UT-52: deve arredondar a nota para cima", () => {
    expect(formatarNota(4.78)).toBe("4,8");
  });

  test("UT-53: deve formatar corretamente a nota zero", () => {
    expect(formatarNota(0)).toBe("0,0");
  });

  test("UT-54: deve formatar corretamente a nota cinco", () => {
    expect(formatarNota(5)).toBe("5,0");
  });
});
