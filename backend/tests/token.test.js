import test from "node:test";
import assert from "node:assert/strict";
import jwt from "jsonwebtoken";

// Configuração exclusiva do ambiente de testes
process.env.JWT_SECRET = "chave-ficticia-exclusiva-para-testes";
process.env.JWT_EXPIRA_EM = "7d";

const { gerarToken, verificarToken } = await import("../src/utils/token.js");

const usuario = {
  id: 1,
  tipo: "usuario",
};

test("UT-19: deve gerar um token JWT", () => {
  const token = gerarToken(usuario);

  assert.equal(typeof token, "string");
  assert.equal(token.split(".").length, 3);
  assert.equal(jwt.decode(token, { complete: true }).header.alg, "HS256");
});

test("UT-20: deve verificar um token válido", () => {
  const token = gerarToken(usuario);

  assert.doesNotThrow(() => verificarToken(token));
});

test("UT-21: deve preservar o identificador do usuário", () => {
  const token = gerarToken(usuario);
  const dados = verificarToken(token);

  assert.equal(dados.id, usuario.id);
});

test("UT-22: deve preservar o tipo de usuário", () => {
  const token = gerarToken(usuario);
  const dados = verificarToken(token);

  assert.equal(dados.tipo, usuario.tipo);
});

test("UT-23: deve rejeitar token adulterado", () => {
  const token = gerarToken(usuario);
  const partes = token.split(".");

  partes[1] = Buffer.from(JSON.stringify({ id: 999, tipo: "admin" })).toString(
    "base64url",
  );

  const tokenAdulterado = partes.join(".");

  assert.throws(() => verificarToken(tokenAdulterado), {
    name: "JsonWebTokenError",
    message: "invalid signature",
  });
});

test("UT-24: deve rejeitar token malformado", () => {
  assert.throws(() => verificarToken("token-invalido"), {
    name: "JsonWebTokenError",
  });
});

test("UT-25: deve rejeitar token expirado", () => {
  const token = jwt.sign(usuario, process.env.JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: -1,
  });

  assert.throws(() => verificarToken(token), { name: "TokenExpiredError" });
});

test("UT-26: deve rejeitar token assinado com chave diferente", () => {
  const token = jwt.sign(usuario, "outra-chave-ficticia", {
    algorithm: "HS256",
    expiresIn: "7d",
  });

  assert.throws(() => verificarToken(token), {
    name: "JsonWebTokenError",
    message: "invalid signature",
  });
});
