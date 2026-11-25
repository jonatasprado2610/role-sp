import test from "node:test";
import assert from "node:assert/strict";

import { emailValido, maiorDeIdade } from "../src/utils/validacao.js";

test("UT-01: deve aceitar um e-mail válido", () => {
  assert.equal(emailValido("usuario@email.com"), true);
});

test("UT-02: deve rejeitar e-mail sem @", () => {
  assert.equal(emailValido("usuarioemail.com"), false);
});

test("UT-03: deve rejeitar e-mail sem domínio completo", () => {
  assert.equal(emailValido("usuario@email"), false);
});

test("UT-04: deve rejeitar e-mail com mais de 100 caracteres", () => {
  const email = "a".repeat(91) + "@email.com";

  assert.equal(emailValido(email), false);
});

test("UT-05: deve rejeitar valores que não sejam strings", () => {
  assert.equal(emailValido(null), false);
  assert.equal(emailValido(undefined), false);
  assert.equal(emailValido(123), false);
});

test("UT-06: deve aceitar pessoa maior de 18 anos", () => {
  assert.equal(maiorDeIdade("1990-05-15"), true);
});

test("UT-07: deve rejeitar pessoa menor de 18 anos", () => {
  const ano = new Date().getFullYear() - 10;

  assert.equal(maiorDeIdade(`${ano}-01-01`), false);
});

test("UT-08: deve aceitar pessoa que completa 18 anos hoje", () => {
  const hoje = new Date();

  const data = [
    hoje.getFullYear() - 18,
    String(hoje.getMonth() + 1).padStart(2, "0"),
    String(hoje.getDate()).padStart(2, "0"),
  ].join("-");

  assert.equal(maiorDeIdade(data), true);
});

test("UT-09: deve rejeitar data em formato inválido", () => {
  assert.equal(maiorDeIdade("15/05/2000"), false);
  assert.equal(maiorDeIdade("data-invalida"), false);
});

test("UT-10: deve rejeitar data de nascimento futura", () => {
  const anoFuturo = new Date().getFullYear() + 1;

  assert.equal(maiorDeIdade(`${anoFuturo}-01-01`), false);
});

test("UT-11: deve rejeitar valores que não sejam strings", () => {
  assert.equal(maiorDeIdade(null), false);
  assert.equal(maiorDeIdade(undefined), false);
  assert.equal(maiorDeIdade(2000), false);
});

test("UT-12: deve aceitar e-mail com exatamente 100 caracteres", () => {
  const email = "a".repeat(90) + "@email.com";

  assert.equal(emailValido(email), true);
});

test("UT-13: deve rejeitar e-mail vazio", () => {
  assert.equal(emailValido(""), false);
});

test("UT-14: deve rejeitar e-mail com espaços internos", () => {
  assert.equal(emailValido("usuario teste@email.com"), false);
});

test("UT-15: deve rejeitar pessoa que completa 18 anos amanhã", () => {
  const amanha = new Date();
  amanha.setDate(amanha.getDate() + 1);

  const data = [
    amanha.getFullYear() - 18,
    String(amanha.getMonth() + 1).padStart(2, "0"),
    String(amanha.getDate()).padStart(2, "0"),
  ].join("-");

  assert.equal(maiorDeIdade(data), false);
});

// Defeito conhecido: https://github.com/jonatasprado2610/role-sp/issues/1
test(
  "UT-16: deve rejeitar data de nascimento inexistente",
  { todo: "Aguardando correção da Issue #1" },
  () => {
    assert.equal(maiorDeIdade("1990-02-30"), false);
  }
);

test("UT-17: deve rejeitar data com mês inexistente", () => {
  assert.equal(maiorDeIdade("1990-13-01"), false);
});

test("UT-18: deve aceitar data válida em ano bissexto", () => {
  assert.equal(maiorDeIdade("2000-02-29"), true);
});
