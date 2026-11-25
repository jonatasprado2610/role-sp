import { isAxiosError } from 'axios';
import { api } from './api';
import { salvarSessao, Usuario } from './sessao';

type RespostaAuth = {
  token: string;
  usuario: Usuario;
};

type DadosCadastro = {
  nome: string;
  email: string;
  senha: string;
  dataNascimento: string; // AAAA-MM-DD
  aceiteTermos: boolean;
};

type DadosLogin = {
  email: string;
  senha: string;
};

export async function cadastrarUsuario(dados: DadosCadastro): Promise<Usuario> {
  console.log('1. Enviando cadastro para API...');

  const { data } = await api.post<RespostaAuth>('/auth/cadastro', dados);

  console.log('2. Cadastro realizado na API!');
  console.log('3. Salvando sessão...');

  await salvarSessao(data.token, data.usuario);

  console.log('4. Sessão salva com sucesso!');

  return data.usuario;
}

export async function loginUsuario(dados: DadosLogin): Promise<Usuario> {
  const { data } = await api.post<RespostaAuth>('/auth/login', dados);

  await salvarSessao(data.token, data.usuario);

  return data.usuario;
}



// transforma qualquer erro em uma mensagem amigável para a tela
export function mensagemDeErro(erro: unknown): string {
  if (isAxiosError<{ erro?: string }>(erro)) {
    if (erro.response?.data?.erro) return erro.response.data.erro;
    if (!erro.response) {
      return 'Não foi possível conectar ao servidor. Confira sua conexão e tente de novo.';
    }
  }
  return 'Algo deu errado. Tente novamente.';
}