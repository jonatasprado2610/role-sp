import { describe, test, expect } from "@jest/globals";
import { emailValido } from "../src/utils/validacao";

describe("Validação de e-mail no frontend", () => {
  test("UT-41: deve aceitar um e-mail válido", () => {
    expect(emailValido("usuario@email.com")).toBe(true);
  });

  test("UT-42: deve rejeitar e-mail sem @", () => {
    expect(emailValido("usuarioemail.com")).toBe(false);
  });

  test("UT-43: deve rejeitar e-mail com domínio incompleto", () => {
    expect(emailValido("usuario@email")).toBe(false);
  });

  test("UT-44: deve rejeitar e-mail vazio", () => {
    expect(emailValido("")).toBe(false);
  });

  test("UT-45: deve rejeitar e-mail com espaços internos", () => {
    expect(emailValido("usu ario@email.com")).toBe(false);
  });

  test("UT-46: deve aceitar e-mail com espaços nas extremidades", () => {
    expect(emailValido("  usuario@email.com  ")).toBe(true);
  });

  test("UT-47: deve aceitar e-mail com subdomínio", () => {
    expect(emailValido("usuario@contato.email.com")).toBe(true);
  });

  test("UT-48: deve rejeitar e-mail com mais de um @", () => {
    expect(emailValido("usuario@@email.com")).toBe(false);
  });
});
